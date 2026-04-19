<script lang="ts">
	import { goto } from '$app/navigation';
	import { signIn } from '$lib/auth-client';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let error = $state<string | null>(null);

	async function onSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (loading) return;
		loading = true;
		error = null;

		const { error: err } = await signIn.email({
			email,
			password,
			callbackURL: '/app'
		});

		if (err) {
			error = err.message ?? 'Invalid email or password';
			loading = false;
			return;
		}

		await goto('/app');
	}

	async function withGoogle() {
		await signIn.social({ provider: 'google', callbackURL: '/app' });
	}

	async function withApple() {
		await signIn.social({ provider: 'apple', callbackURL: '/app' });
	}
</script>

<svelte:head>
	<title>Sign in — Alto</title>
</svelte:head>

<div>
	<h1 class="text-3xl lg:text-4xl font-extrabold tracking-[-0.03em] leading-tight">
		Welcome back
	</h1>
	<p class="mt-2 text-white/60 text-sm">
		New to Alto?
		<a href="/register" class="text-white hover:text-[#2563eb] font-medium transition-colors">Create an account</a>
	</p>

	<!-- Social providers -->
	<div class="mt-8 grid grid-cols-2 gap-3">
		<button
			type="button"
			onclick={withGoogle}
			class="flex items-center justify-center gap-2 h-11 rounded-xl border border-white/[0.12] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.2] transition-all text-sm font-medium cursor-pointer"
		>
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" fill="#4285F4"/>
				<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" fill="#34A853"/>
				<path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83Z" fill="#FBBC05"/>
				<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38Z" fill="#EA4335"/>
			</svg>
			Google
		</button>
		<button
			type="button"
			onclick={withApple}
			class="flex items-center justify-center gap-2 h-11 rounded-xl border border-white/[0.12] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.2] transition-all text-sm font-medium cursor-pointer"
		>
			<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
				<path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.84-1.012 1.4-2.427 1.247-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
			</svg>
			Apple
		</button>
	</div>

	<!-- Divider -->
	<div class="mt-7 flex items-center gap-4">
		<div class="flex-1 h-px bg-white/[0.08]"></div>
		<span class="text-xs text-white/40 uppercase tracking-wider">or</span>
		<div class="flex-1 h-px bg-white/[0.08]"></div>
	</div>

	<!-- Email/password form -->
	<form onsubmit={onSubmit} class="mt-7 space-y-4">
		<div>
			<label for="email" class="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">Email</label>
			<input
				id="email"
				type="email"
				autocomplete="email"
				bind:value={email}
				required
				class="w-full h-11 px-4 rounded-xl bg-white/[0.03] border border-white/[0.12] text-white placeholder:text-white/30 focus:outline-none focus:border-[#2563eb] focus:bg-white/[0.05] transition-colors"
				placeholder="you@example.com"
			/>
		</div>

		<div>
			<div class="flex items-center justify-between mb-2">
				<label for="password" class="block text-xs font-semibold text-white/70 uppercase tracking-wider">Password</label>
				<a href="/forgot-password" class="text-xs text-white/60 hover:text-white transition-colors">Forgot?</a>
			</div>
			<input
				id="password"
				type="password"
				autocomplete="current-password"
				bind:value={password}
				required
				minlength="8"
				class="w-full h-11 px-4 rounded-xl bg-white/[0.03] border border-white/[0.12] text-white placeholder:text-white/30 focus:outline-none focus:border-[#2563eb] focus:bg-white/[0.05] transition-colors"
				placeholder="••••••••"
			/>
		</div>

		{#if error}
			<div class="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
				{error}
			</div>
		{/if}

		<button
			type="submit"
			disabled={loading}
			class="w-full h-11 rounded-xl bg-white text-[#0a0a0b] font-semibold text-sm transition-all hover:scale-[1.01] hover:bg-white/95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
		>
			{loading ? 'Signing in…' : 'Sign in'}
		</button>
	</form>

	<p class="mt-8 text-xs text-white/40 text-center">
		By signing in you agree to our
		<a href="/legal/terms" class="text-white/60 hover:text-white">Terms</a>
		and
		<a href="/legal/privacy" class="text-white/60 hover:text-white">Privacy Policy</a>.
	</p>
</div>
