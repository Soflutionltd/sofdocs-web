import { betterAuth } from 'better-auth';
import { Kysely } from 'kysely';
import { D1Dialect } from 'kysely-d1';

type Env = App.Platform['env'];

function buildSocialProviders(env: Env) {
	const providers: Record<string, unknown> = {};
	if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
		providers.google = {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET
		};
	}
	if (env.APPLE_CLIENT_ID && env.APPLE_CLIENT_SECRET) {
		providers.apple = {
			clientId: env.APPLE_CLIENT_ID,
			clientSecret: env.APPLE_CLIENT_SECRET
		};
	}
	return providers;
}

function create(env: Env, baseURL: string) {
	const db = new Kysely<unknown>({ dialect: new D1Dialect({ database: env.DB }) });

	return betterAuth({
		appName: 'Alto',
		baseURL,
		basePath: '/api/auth',
		secret: env.BETTER_AUTH_SECRET,
		database: {
			db,
			type: 'sqlite'
		},
		emailAndPassword: {
			enabled: true,
			requireEmailVerification: false,
			minPasswordLength: 8,
			autoSignIn: true,
			sendResetPassword: async ({ user, url }) => {
				// TODO Phase 4: wire to Resend / SendGrid via env.EMAIL_API_KEY
				// In dev / wrangler local, the reset link is logged so the flow remains testable.
				console.log(`[Alto Auth] Password reset for ${user.email}: ${url}`);
			}
		},
		socialProviders: buildSocialProviders(env),
		session: {
			expiresIn: 60 * 60 * 24 * 30, // 30 days
			updateAge: 60 * 60 * 24, // refresh sliding window every 24h
			cookieCache: {
				enabled: true,
				maxAge: 60 * 5 // 5 min in-edge cache
			}
		},
		trustedOrigins: [baseURL]
	});
}

export const Auth = { create };
