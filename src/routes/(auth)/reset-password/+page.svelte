<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { authClient } from '$lib/auth-client';

	let password = $state('');
	let confirm = $state('');
	let loading = $state(false);
	let error = $state<string | null>(null);
	let done = $state(false);

	const token = $derived(page.url.searchParams.get('token') ?? '');

	async function onSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (loading) return;
		if (password !== confirm) {
			error = 'Passwords do not match';
			return;
		}
		if (!token) {
			error = 'Missing or invalid reset token';
			return;
		}
		loading = true;
		error = null;

		const { error: err } = await authClient.resetPassword({
			newPassword: password,
			token
		});

		loading = false;
		if (err) {
			error = err.message ?? 'Could not reset your password';
			return;
		}
		done = true;
		setTimeout(() => goto('/login'), 1500);
	}
</script>

<svelte:head>
	<title>Set a new password — Alto</title>
</svelte:head>

<div>
	<h1 class="text-3xl lg:text-4xl font-extrabold tracking-[-0.03em] leading-tight">
		Set a new password
	</h1>
	<p class="mt-2 text-white/60 text-sm">
		Choose a strong password — at least 8 characters.
	</p>

	{#if done}
		<div class="mt-8 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-5 text-sm text-emerald-200">
			<div class="font-semibold mb-1">Password updated</div>
			<p class="text-emerald-200/80">Redirecting you to sign in…</p>
		</div>
	{:else}
		<form onsubmit={onSubmit} class="mt-7 space-y-4">
			<div>
				<label for="pw" class="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">New password</label>
				<input
					id="pw"
					type="password"
					autocomplete="new-password"
					bind:value={password}
					required
					minlength="8"
					class="w-full h-11 px-4 rounded-xl bg-white/[0.03] border border-white/[0.12] text-white placeholder:text-white/30 focus:outline-none focus:border-[#2563eb] focus:bg-white/[0.05] transition-colors"
					placeholder="At least 8 characters"
				/>
			</div>

			<div>
				<label for="confirm" class="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">Confirm password</label>
				<input
					id="confirm"
					type="password"
					autocomplete="new-password"
					bind:value={confirm}
					required
					minlength="8"
					class="w-full h-11 px-4 rounded-xl bg-white/[0.03] border border-white/[0.12] text-white placeholder:text-white/30 focus:outline-none focus:border-[#2563eb] focus:bg-white/[0.05] transition-colors"
					placeholder="Repeat password"
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
				{loading ? 'Updating…' : 'Update password'}
			</button>
		</form>
	{/if}
</div>
