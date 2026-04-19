import type { Auth } from '$lib/server/auth';

declare global {
	namespace App {
		interface Locals {
			auth: ReturnType<typeof Auth.create>;
			session: Awaited<ReturnType<ReturnType<typeof Auth.create>['api']['getSession']>> | null;
			user: NonNullable<Awaited<ReturnType<ReturnType<typeof Auth.create>['api']['getSession']>>>['user'] | null;
		}

		interface Platform {
			env: {
				DB: D1Database;
				BETTER_AUTH_SECRET: string;
				BETTER_AUTH_URL?: string;
				GOOGLE_CLIENT_ID?: string;
				GOOGLE_CLIENT_SECRET?: string;
				APPLE_CLIENT_ID?: string;
				APPLE_CLIENT_SECRET?: string;
				STRIPE_SECRET_KEY?: string;
				STRIPE_WEBHOOK_SECRET?: string;
				STRIPE_PRICE_ID_PRO?: string;
				STRIPE_PRICE_ID_BUSINESS?: string;
			};
			context: {
				waitUntil(promise: Promise<unknown>): void;
			};
			caches: CacheStorage & { default: Cache };
		}
	}
}

export {};
