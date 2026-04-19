import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getStripe } from '$lib/server/stripe';
import { getSubscriptionByUserId } from '$lib/server/subscription';

export const POST: RequestHandler = async ({ locals, platform, url }) => {
	if (!locals.user || !platform?.env) {
		throw error(401, 'You must be signed in');
	}

	const env = platform.env;
	const sub = await getSubscriptionByUserId(env, locals.user.id);
	if (!sub?.stripe_customer_id) {
		throw error(400, 'No Stripe customer for this account yet');
	}

	const stripe = getStripe(env);
	const session = await stripe.billingPortal.sessions.create({
		customer: sub.stripe_customer_id,
		return_url: `${url.origin}/app/account`
	});

	return json({ url: session.url });
};
