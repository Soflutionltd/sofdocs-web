import Stripe from 'stripe';

type Env = App.Platform['env'];

let cached: { key: string; client: Stripe } | null = null;

export function getStripe(env: Env): Stripe {
	const key = env.STRIPE_SECRET_KEY;
	if (!key) {
		throw new Error('STRIPE_SECRET_KEY is not configured');
	}
	if (cached?.key === key) return cached.client;

	const client = new Stripe(key, {
		apiVersion: '2026-03-25.dahlia',
		httpClient: Stripe.createFetchHttpClient(),
		typescript: true
	});

	cached = { key, client };
	return client;
}

export const PLAN_TO_PRICE = {
	pro: (env: Env) => env.STRIPE_PRICE_ID_PRO,
	business: (env: Env) => env.STRIPE_PRICE_ID_BUSINESS
} as const satisfies Record<'pro' | 'business', (env: Env) => string | undefined>;

export type PlanId = keyof typeof PLAN_TO_PRICE;
