import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type Stripe from 'stripe';
import { getStripe } from '$lib/server/stripe';
import {
	getSubscriptionByCustomerId,
	getSubscriptionByStripeId,
	upsertSubscription,
	type SubscriptionPlan,
	type SubscriptionStatus
} from '$lib/server/subscription';

function planFromPriceId(env: App.Platform['env'], priceId: string | null | undefined): SubscriptionPlan {
	if (priceId && priceId === env.STRIPE_PRICE_ID_PRO) return 'pro';
	if (priceId && priceId === env.STRIPE_PRICE_ID_BUSINESS) return 'business';
	return 'free';
}

function mapStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
	switch (status) {
		case 'trialing':
		case 'active':
		case 'canceled':
		case 'past_due':
		case 'incomplete':
			return status;
		case 'incomplete_expired':
			return 'canceled';
		case 'unpaid':
			return 'past_due';
		case 'paused':
			return 'past_due';
		default:
			return 'incomplete';
	}
}

async function handleSubscriptionEvent(env: App.Platform['env'], sub: Stripe.Subscription) {
	const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
	const firstItem = sub.items.data[0];
	const priceId = firstItem?.price?.id ?? null;
	// Stripe API 2026-03-25 moved `current_period_end` onto subscription items.
	const currentPeriodEnd = firstItem?.current_period_end ?? null;

	const row =
		(await getSubscriptionByStripeId(env, sub.id)) ??
		(await getSubscriptionByCustomerId(env, customerId));

	const userId = row?.user_id ?? (sub.metadata?.user_id as string | undefined);
	if (!userId) {
		console.error(`[Stripe webhook] No user_id for subscription ${sub.id}`);
		return;
	}

	await upsertSubscription(env, {
		id: row?.id ?? crypto.randomUUID(),
		user_id: userId,
		stripe_customer_id: customerId,
		stripe_subscription_id: sub.id,
		status: mapStatus(sub.status),
		plan: planFromPriceId(env, priceId),
		current_period_end: currentPeriodEnd,
		trial_ends_at: sub.trial_end ?? null
	});
}

export const POST: RequestHandler = async ({ request, platform }) => {
	if (!platform?.env) throw error(500, 'Platform unavailable');
	const env = platform.env;
	const secret = env.STRIPE_WEBHOOK_SECRET;
	if (!secret) throw error(500, 'STRIPE_WEBHOOK_SECRET not configured');

	const sig = request.headers.get('stripe-signature');
	if (!sig) throw error(400, 'Missing stripe-signature');

	const body = await request.text();
	const stripe = getStripe(env);

	let event: Stripe.Event;
	try {
		event = await stripe.webhooks.constructEventAsync(body, sig, secret);
	} catch (err) {
		console.error('[Stripe webhook] Signature verification failed', err);
		throw error(400, 'Invalid signature');
	}

	switch (event.type) {
		case 'customer.subscription.created':
		case 'customer.subscription.updated':
		case 'customer.subscription.deleted':
		case 'customer.subscription.trial_will_end':
			await handleSubscriptionEvent(env, event.data.object);
			break;

		case 'checkout.session.completed': {
			const session = event.data.object;
			if (session.mode === 'subscription' && session.subscription) {
				const subId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id;
				const sub = await stripe.subscriptions.retrieve(subId);
				await handleSubscriptionEvent(env, sub);
			}
			break;
		}

		default:
			// Unhandled events are acked so Stripe doesn't retry
			break;
	}

	return new Response('ok', { status: 200 });
};
