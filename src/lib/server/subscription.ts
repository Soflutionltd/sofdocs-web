type Env = App.Platform['env'];

export type SubscriptionStatus = 'trialing' | 'active' | 'canceled' | 'past_due' | 'incomplete';
export type SubscriptionPlan = 'free' | 'pro' | 'business';

export interface SubscriptionRow {
	id: string;
	user_id: string;
	stripe_customer_id: string | null;
	stripe_subscription_id: string | null;
	status: SubscriptionStatus;
	plan: SubscriptionPlan;
	current_period_end: number | null;
	trial_ends_at: number | null;
	created_at: number;
	updated_at: number;
}

export async function getSubscriptionByUserId(env: Env, userId: string): Promise<SubscriptionRow | null> {
	const row = await env.DB.prepare('SELECT * FROM subscription WHERE user_id = ?').bind(userId).first<SubscriptionRow>();
	return row ?? null;
}

export async function getSubscriptionByStripeId(env: Env, subscriptionId: string): Promise<SubscriptionRow | null> {
	const row = await env.DB.prepare('SELECT * FROM subscription WHERE stripe_subscription_id = ?').bind(subscriptionId).first<SubscriptionRow>();
	return row ?? null;
}

export async function getSubscriptionByCustomerId(env: Env, customerId: string): Promise<SubscriptionRow | null> {
	const row = await env.DB.prepare('SELECT * FROM subscription WHERE stripe_customer_id = ?').bind(customerId).first<SubscriptionRow>();
	return row ?? null;
}

export async function upsertSubscription(env: Env, row: Omit<SubscriptionRow, 'created_at' | 'updated_at'>) {
	const now = Math.floor(Date.now() / 1000);
	await env.DB.prepare(
		`INSERT INTO subscription (id, user_id, stripe_customer_id, stripe_subscription_id, status, plan, current_period_end, trial_ends_at, created_at, updated_at)
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		 ON CONFLICT(user_id) DO UPDATE SET
		   stripe_customer_id = excluded.stripe_customer_id,
		   stripe_subscription_id = excluded.stripe_subscription_id,
		   status = excluded.status,
		   plan = excluded.plan,
		   current_period_end = excluded.current_period_end,
		   trial_ends_at = excluded.trial_ends_at,
		   updated_at = excluded.updated_at`
	)
		.bind(
			row.id,
			row.user_id,
			row.stripe_customer_id,
			row.stripe_subscription_id,
			row.status,
			row.plan,
			row.current_period_end,
			row.trial_ends_at,
			now,
			now
		)
		.run();
}

export async function ensureFreeSubscription(env: Env, userId: string): Promise<SubscriptionRow> {
	const existing = await getSubscriptionByUserId(env, userId);
	if (existing) return existing;

	const id = crypto.randomUUID();
	await upsertSubscription(env, {
		id,
		user_id: userId,
		stripe_customer_id: null,
		stripe_subscription_id: null,
		status: 'active',
		plan: 'free',
		current_period_end: null,
		trial_ends_at: null
	});
	return (await getSubscriptionByUserId(env, userId))!;
}

export function isSubscriptionEntitled(sub: SubscriptionRow | null): boolean {
	if (!sub) return false;
	if (sub.plan === 'free') return true;
	return sub.status === 'active' || sub.status === 'trialing';
}
