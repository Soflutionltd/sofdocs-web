<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let loading = $state(false);
	let error = $state<string | null>(null);

	const sub = $derived(data.subscription);
	const planLabel = $derived(
		sub?.plan === 'pro' ? 'Pro' : sub?.plan === 'business' ? 'Business' : 'Free'
	);
	const statusLabel = $derived(
		sub?.status === 'trialing'
			? 'Trial'
			: sub?.status === 'active'
				? 'Active'
				: sub?.status === 'past_due'
					? 'Past due'
					: sub?.status === 'canceled'
						? 'Canceled'
						: sub?.status ?? 'Unknown'
	);

	function fmtDate(unix: number | null | undefined) {
		if (!unix) return '—';
		return new Date(unix * 1000).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	async function openPortal() {
		error = null;
		loading = true;
		try {
			const res = await fetch('/api/stripe/portal', { method: 'POST' });
			if (!res.ok) {
				error = (await res.text()) || `Portal failed (${res.status})`;
				loading = false;
				return;
			}
			const { url } = (await res.json()) as { url?: string };
			if (url) window.location.assign(url);
			else {
				error = 'Stripe did not return a portal URL';
				loading = false;
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Portal failed';
			loading = false;
		}
	}

	async function upgrade(plan: 'pro' | 'business') {
		error = null;
		loading = true;
		try {
			const res = await fetch('/api/stripe/checkout', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ plan })
			});
			if (!res.ok) {
				error = (await res.text()) || `Checkout failed (${res.status})`;
				loading = false;
				return;
			}
			const { url } = (await res.json()) as { url?: string };
			if (url) window.location.assign(url);
			else {
				error = 'Stripe did not return a checkout URL';
				loading = false;
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Checkout failed';
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Account · Alto</title>
</svelte:head>

<div class="min-h-screen bg-zinc-50 px-6 py-16">
	<div class="mx-auto max-w-3xl">
		<a href="/app" class="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">← Back to apps</a>

		<h1 class="mt-6 text-4xl font-bold tracking-tight text-zinc-950">Account</h1>
		<p class="mt-2 text-zinc-600">Manage your Alto subscription and billing.</p>

		<div class="mt-10 rounded-3xl border border-zinc-200 bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)]">
			<div class="flex items-start justify-between gap-6 flex-wrap">
				<div>
					<div class="text-xs uppercase tracking-wider text-zinc-500">Profile</div>
					<div class="mt-2 text-lg font-semibold text-zinc-950">{data.user?.name}</div>
					<div class="text-sm text-zinc-600">{data.user?.email}</div>
				</div>
			</div>
		</div>

		<div class="mt-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)]">
			<div class="flex items-start justify-between gap-6 flex-wrap">
				<div>
					<div class="text-xs uppercase tracking-wider text-zinc-500">Subscription</div>
					<div class="mt-2 flex items-center gap-3">
						<span class="text-2xl font-bold text-zinc-950">{planLabel}</span>
						<span
							class={[
								'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
								sub?.status === 'active' && 'bg-emerald-100 text-emerald-800',
								sub?.status === 'trialing' && 'bg-blue-100 text-blue-800',
								sub?.status === 'past_due' && 'bg-amber-100 text-amber-800',
								sub?.status === 'canceled' && 'bg-zinc-100 text-zinc-700',
								(!sub || sub.status === 'incomplete') && 'bg-zinc-100 text-zinc-700'
							]}>{statusLabel}</span
						>
					</div>

					{#if sub?.trial_ends_at && sub.status === 'trialing'}
						<div class="mt-3 text-sm text-zinc-600">Trial ends on {fmtDate(sub.trial_ends_at)}</div>
					{:else if sub?.current_period_end}
						<div class="mt-3 text-sm text-zinc-600">Renews on {fmtDate(sub.current_period_end)}</div>
					{/if}
				</div>

				<div class="flex flex-col gap-3">
					{#if sub?.stripe_customer_id}
						<button
							type="button"
							onclick={openPortal}
							disabled={loading}
							class="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800 disabled:opacity-60 cursor-pointer"
						>
							{loading ? 'Opening…' : 'Manage billing'}
						</button>
					{:else}
						<button
							type="button"
							onclick={() => upgrade('pro')}
							disabled={loading}
							class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
						>
							{loading ? 'Redirecting…' : 'Upgrade to Pro'}
						</button>
						<button
							type="button"
							onclick={() => upgrade('business')}
							disabled={loading}
							class="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition-all hover:bg-zinc-50 disabled:opacity-60 cursor-pointer"
						>
							Upgrade to Business
						</button>
					{/if}
				</div>
			</div>

			{#if error}
				<div class="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					{error}
				</div>
			{/if}
		</div>

		<p class="mt-8 text-xs text-zinc-500">
			Soflution LTD · Made in Europe · GDPR compliant · No CLOUD Act exposure on EU plans.
		</p>
	</div>
</div>
