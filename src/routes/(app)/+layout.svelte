<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
	/>
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-zinc-100" style="font-family: 'Inter', system-ui, sans-serif;">
	<header class="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
		<div class="mx-auto max-w-7xl px-6 lg:px-10 h-16 flex items-center justify-between">
			<a href="/app" class="flex items-center gap-2.5">
				<span class="grid h-8 w-8 place-items-center rounded-lg bg-white text-zinc-950 font-bold">A</span>
				<span class="font-semibold tracking-tight">Alto</span>
			</a>

			<nav class="flex items-center gap-2 text-sm">
				{#if data.subscription}
					<span
						class={[
							'hidden sm:inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium',
							data.subscription.plan === 'free'
								? 'border-white/15 text-white/60'
								: data.subscription.status === 'trialing'
									? 'border-amber-400/40 bg-amber-400/10 text-amber-200'
									: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200'
						]}
					>
						{data.subscription.plan.toUpperCase()}{data.subscription.status === 'trialing'
							? ' · Trial'
							: ''}
					</span>
				{/if}
				<a
					href="/app/account"
					class="rounded-lg px-3 py-1.5 text-white/70 hover:bg-white/5 hover:text-white transition-colors"
				>
					Account
				</a>
			</nav>
		</div>
	</header>

	{@render children()}
</div>
