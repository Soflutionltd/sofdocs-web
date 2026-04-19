<script lang="ts">
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();

	let scrolled = $state(false);

	onMount(() => {
		const onScroll = () => {
			scrolled = window.scrollY > 16;
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();
		return () => window.removeEventListener('scroll', onScroll);
	});

	const nav = [
		{ href: '/#features', label: 'Features' },
		{ href: '/pricing', label: 'Pricing' },
		{ href: '/download', label: 'Download' }
	];
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="marketing min-h-screen bg-[#0a0a0b] text-white selection:bg-[#2563eb] selection:text-white">
	<header
		class="fixed top-0 inset-x-0 z-50 transition-all duration-300"
		class:scrolled
	>
		<div class="mx-auto max-w-7xl px-6 lg:px-10">
			<nav
				class="flex items-center justify-between h-16 lg:h-20 transition-all duration-300"
			>
				<a href="/" class="flex items-center gap-2.5 group">
					<span class="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#0a0a0b] font-extrabold text-[15px] tracking-tight transition-transform duration-200 group-hover:scale-105">A</span>
					<span class="text-[17px] font-semibold tracking-tight">Alto</span>
				</a>

				<div class="hidden md:flex items-center gap-8">
					{#each nav as item}
						<a
							href={item.href}
							class="text-sm text-white/70 hover:text-white transition-colors"
						>
							{item.label}
						</a>
					{/each}
				</div>

				<div class="flex items-center gap-3">
					{#if data.user}
						<span class="hidden md:inline text-sm text-white/60">{data.user.email}</span>
						<a
							href="/app"
							class="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full bg-white text-[#0a0a0b] hover:bg-white/90 transition-all hover:scale-[1.02]"
						>
							Open Alto
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
						</a>
					{:else}
						<a
							href="/login"
							class="hidden sm:inline-flex text-sm text-white/80 hover:text-white px-4 py-2 transition-colors"
						>
							Sign in
						</a>
						<a
							href="/register"
							class="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full bg-white text-[#0a0a0b] hover:bg-white/90 transition-all hover:scale-[1.02]"
						>
							Start free trial
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
						</a>
					{/if}
				</div>
			</nav>
		</div>
	</header>

	<main class="pt-16 lg:pt-20">
		{@render children()}
	</main>

	<footer class="border-t border-white/[0.08] mt-32">
		<div class="mx-auto max-w-7xl px-6 lg:px-10 py-16 lg:py-20">
			<div class="grid grid-cols-2 md:grid-cols-5 gap-12">
				<div class="col-span-2 md:col-span-2">
					<div class="flex items-center gap-2.5 mb-5">
						<span class="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#0a0a0b] font-extrabold text-[15px]">A</span>
						<span class="text-[17px] font-semibold tracking-tight">Alto</span>
					</div>
					<p class="text-sm text-white/60 max-w-xs leading-relaxed">
						The European office suite. Built in Europe, hosted in Europe, owned by no one but you.
					</p>
				</div>

				<div>
					<h4 class="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">Product</h4>
					<ul class="space-y-3 text-sm">
						<li><a href="/#features" class="text-white/70 hover:text-white transition-colors">Features</a></li>
						<li><a href="/pricing" class="text-white/70 hover:text-white transition-colors">Pricing</a></li>
						<li><a href="/download" class="text-white/70 hover:text-white transition-colors">Download</a></li>
					</ul>
				</div>

				<div>
					<h4 class="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">Company</h4>
					<ul class="space-y-3 text-sm">
						<li><a href="/#sovereignty" class="text-white/70 hover:text-white transition-colors">Sovereignty</a></li>
						<li><a href="mailto:hello@alto.eu" class="text-white/70 hover:text-white transition-colors">Contact</a></li>
					</ul>
				</div>

				<div>
					<h4 class="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">Legal</h4>
					<ul class="space-y-3 text-sm">
						<li><a href="/legal/terms" class="text-white/70 hover:text-white transition-colors">Terms</a></li>
						<li><a href="/legal/privacy" class="text-white/70 hover:text-white transition-colors">Privacy</a></li>
					</ul>
				</div>
			</div>

			<div class="mt-16 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
				<p class="text-xs text-white/40">© 2026 Soflution LTD. Made in Europe.</p>
				<div class="flex items-center gap-2 text-xs text-white/40">
					<span class="inline-flex items-center gap-1.5">
						<span class="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
						All systems operational
					</span>
				</div>
			</div>
		</div>
	</footer>
</div>

<style>
	:global(.marketing) {
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
		font-feature-settings: 'kern' 1, 'liga' 1, 'cv11' 1;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		font-size: 16px;
		line-height: 1.5;
		letter-spacing: -0.01em;
	}

	header {
		background: transparent;
	}

	header.scrolled {
		background: rgba(10, 10, 11, 0.72);
		backdrop-filter: saturate(180%) blur(20px);
		-webkit-backdrop-filter: saturate(180%) blur(20px);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	header.scrolled nav {
		height: 60px;
	}
</style>
