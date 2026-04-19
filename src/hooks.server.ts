import type { Handle } from '@sveltejs/kit';
import { Auth } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const platform = event.platform;

	if (!platform?.env?.DB) {
		// In `vite dev` (no wrangler) the D1 binding is unavailable.
		// Auth-dependent routes will fail loudly; marketing/static routes still work.
		event.locals.auth = null as never;
		event.locals.session = null;
		event.locals.user = null;
		return resolve(event);
	}

	const baseURL = platform.env.BETTER_AUTH_URL ?? event.url.origin;
	const auth = Auth.create(platform.env, baseURL);
	event.locals.auth = auth;

	// Better Auth catch-all route handler ----------------------------
	if (event.url.pathname.startsWith('/api/auth')) {
		return auth.handler(event.request);
	}

	// Resolve current session for downstream loaders / pages ---------
	const session = await auth.api.getSession({ headers: event.request.headers });
	event.locals.session = session;
	event.locals.user = session?.user ?? null;

	return resolve(event);
};
