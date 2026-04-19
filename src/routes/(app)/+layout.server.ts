import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { ensureFreeSubscription, isSubscriptionEntitled } from '$lib/server/subscription';

export const load: LayoutServerLoad = async ({ locals, platform, url }) => {
	if (!locals.session || !locals.user) {
		const next = encodeURIComponent(url.pathname + url.search);
		throw redirect(303, `/login?next=${next}`);
	}

	let subscription = null;
	if (platform?.env?.DB) {
		subscription = await ensureFreeSubscription(platform.env, locals.user.id);
	}

	return {
		user: locals.user,
		session: locals.session,
		subscription,
		entitled: isSubscriptionEntitled(subscription)
	};
};
