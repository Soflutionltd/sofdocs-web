<script lang="ts">
	import { authClient } from '$lib/auth-client';

	let email = $state('');
	let loading = $state(false);
	let error = $state<string | null>(null);
	let sent = $state(false);

	async function onSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (loading) return;
		loading = true;
		error = null;

		const { error: err } = await authClient.requestPasswordReset({
			email,
			redirectTo: '/reset-password'
		});

		loading = false;
		if (err) {
			error = err.message ?? 'Could not send reset email';
			return;
		}
		sent = true;
	}
</script>

<svelte:head>
	<title>Reset your password — Alto</title>
</svelte:head>

<div>
	<h1 class="text-3xl lg:text-4xl font-extrabold tracking-[-0.03em] leading-tight">
		Reset password
	</h1>
	<p class="mt-2 text-white/60 text-sm">
		Enter your email and we'll send you a link to reset it.
	</p>

	{#if sent}
		<div class="mt-8 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-5 text-sm text-emerald-200">
			<div class="font-semibold mb-1">Check your inbox</div>
			<p class="text-emerald-200/80">If an account exists for <strong>{email}</strong>, a password reset link is on its way.</p>
		</div>
		<div class="mt-6 text-center">
			<a href="/login" class="text-sm text-white/70 hover:text-white transition-colors">← Back to sign in</a>
		</div>
	{:else}
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
				{loading ? 'Sending…' : 'Send reset link'}
			</button>
		</form>

		<div class="mt-6 text-center">
			<a href="/login" class="text-sm text-white/60 hover:text-white transition-colors">← Back to sign in</a>
		</div>
	{/if}
</div>
