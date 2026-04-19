import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getStripe, PLAN_TO_PRICE, type PlanId } from '$lib/server/stripe';
import { getSubscriptionByUserId, upsertSubscription } from '$lib/server/subscription';

export const POST: RequestHandler = async ({ request, locals, platform, url }) => {
	if (!locals.user || !platform?.env) {
		throw error(401, 'You must be signed in');
	}
	const env = platform.env;

	const body = (await request.json().catch(() => ({}))) as { plan?: PlanId };
	const plan = body.plan;
	if (plan !== 'pro' && plan !== 'business') {
		throw error(400, 'Invalid plan');
	}

	const priceId = PLAN_TO_PRICE[plan](env);
	if (!priceId) {
		throw error(500, `Stripe price ID not configured for plan "${plan}"`);
	}

	const stripe = getStripe(env);
	const sub = await getSubscriptionByUserId(env, locals.user.id);

	let customerId = sub?.stripe_customer_id ?? null;
	if (!customerId) {
		const customer = await stripe.customers.create({
			email: locals.user.email,
			name: locals.user.name ?? undefined,
			metadata: { user_id: locals.user.id }
		});
		customerId = customer.id;

		await upsertSubscription(env, {
			id: sub?.id ?? crypto.randomUUID(),
			user_id: locals.user.id,
			stripe_customer_id: customerId,
			stripe_subscription_id: sub?.stripe_subscription_id ?? null,
			status: sub?.status ?? 'incomplete',
			plan: sub?.plan ?? 'free',
			current_period_end: sub?.current_period_end ?? null,
			trial_ends_at: sub?.trial_ends_at ?? null
		});
	}

	const session = await stripe.checkout.sessions.create({
		mode: 'subscription',
		customer: customerId,
		line_items: [{ price: priceId, quantity: 1 }],
		subscription_data: {
			trial_period_days: 14,
			metadata: { user_id: locals.user.id, plan }
		},
		success_url: `${url.origin}/app?checkout=success`,
		cancel_url: `${url.origin}/pricing?checkout=cancel`,
		allow_promotion_codes: true,
		client_reference_id: locals.user.id
	});

	return json({ url: session.url });
};
