<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let heroEl: HTMLElement | undefined = $state();
	let featuresEl: HTMLElement | undefined = $state();
	let sovereigntyEl: HTMLElement | undefined = $state();
	let ctaEl: HTMLElement | undefined = $state();

	let triggers: any[] = [];

	const apps = [
		{
			id: 'docs',
			name: 'Docs',
			tagline: 'Word processor',
			description: 'Native .docx editing engine written in Rust. Open, edit, save — pixel-perfect roundtrip.',
			color: '#2563eb',
			available: true,
			icon: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6"/><path d="M9 17h4"/>`
		},
		{
			id: 'sheets',
			name: 'Sheets',
			tagline: 'Spreadsheets',
			description: 'A blazing-fast spreadsheet engine. Formulas, pivots, charts.',
			color: '#10b981',
			available: false,
			icon: `<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/>`
		},
		{
			id: 'slides',
			name: 'Slides',
			tagline: 'Presentations',
			description: 'Beautiful presentations with smooth transitions and live collaboration.',
			color: '#f97316',
			available: false,
			icon: `<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>`
		},
		{
			id: 'mail',
			name: 'Mail',
			tagline: 'Email client',
			description: 'A privacy-first inbox. End-to-end encrypted, no AI training on your data.',
			color: '#a855f7',
			available: false,
			icon: `<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>`
		},
		{
			id: 'pdf',
			name: 'PDF',
			tagline: 'Reader & editor',
			description: 'Open, annotate, fill, sign. The PDF reader that respects your files.',
			color: '#ef4444',
			available: false,
			icon: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M10 13v4"/><path d="M10 13h2a1.5 1.5 0 0 1 0 3h-2"/>`
		}
	];

	onMount(async () => {
		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		if (heroEl) {
			const tl = gsap.timeline();
			tl.from('.hero-eyebrow', { y: 20, opacity: 0, duration: 0.7, ease: 'expo.out' })
				.from('.hero-title-line', { y: 60, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08 }, '-=0.4')
				.from('.hero-sub', { y: 30, opacity: 0, duration: 0.8, ease: 'expo.out' }, '-=0.6')
				.from('.hero-cta', { y: 20, opacity: 0, duration: 0.7, ease: 'expo.out', stagger: 0.1 }, '-=0.5')
				.from('.hero-visual', { y: 80, opacity: 0, duration: 1.2, ease: 'expo.out' }, '-=0.8');
		}

		if (featuresEl) {
			triggers.push(
				ScrollTrigger.create({
					trigger: featuresEl,
					start: 'top 80%',
					onEnter: () => {
						gsap.from('.feature-card', {
							y: 50,
							opacity: 0,
							duration: 0.8,
							stagger: 0.08,
							ease: 'power3.out'
						});
					}
				})
			);
		}

		if (sovereigntyEl) {
			triggers.push(
				ScrollTrigger.create({
					trigger: sovereigntyEl,
					start: 'top 75%',
					onEnter: () => {
						gsap.from('.sov-stat', {
							y: 30,
							opacity: 0,
							duration: 0.7,
							stagger: 0.1,
							ease: 'power3.out'
						});
					}
				})
			);
		}

		if (ctaEl) {
			triggers.push(
				ScrollTrigger.create({
					trigger: ctaEl,
					start: 'top 80%',
					onEnter: () => {
						gsap.from('.cta-inner > *', {
							y: 30,
							opacity: 0,
							duration: 0.8,
							stagger: 0.1,
							ease: 'power3.out'
						});
					}
				})
			);
		}
	});

	onDestroy(() => {
		triggers.forEach((t) => t.kill());
		triggers = [];
	});
</script>

<svelte:head>
	<title>Alto — The European Office Suite</title>
	<meta name="description" content="A premium office suite built in Europe. Docs, Sheets, Slides, Mail and PDF. Native .docx, no CLOUD Act, no AI training on your data." />
</svelte:head>

<!-- HERO -->
<section
	bind:this={heroEl}
	class="relative overflow-hidden"
>
	<!-- Subtle grid background, no AI gradients -->
	<div class="pointer-events-none absolute inset-0 opacity-[0.06]"
		style="background-image: linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px); background-size: 56px 56px; mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent);">
	</div>

	<div class="relative mx-auto max-w-7xl px-6 lg:px-10 pt-20 lg:pt-32 pb-24 lg:pb-40">
		<div class="hero-eyebrow inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-[12px] font-medium text-white/70 mb-8">
			<span class="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
			Now available — Alto Docs 1.0
		</div>

		<h1 class="text-[44px] leading-[1.05] sm:text-6xl lg:text-[88px] lg:leading-[0.98] font-extrabold tracking-[-0.04em] max-w-5xl">
			<span class="hero-title-line block">The European</span>
			<span class="hero-title-line block">office suite.</span>
			<span class="hero-title-line block text-white/40">Built for what's next.</span>
		</h1>

		<p class="hero-sub mt-8 max-w-xl text-lg lg:text-xl text-white/60 leading-relaxed">
			Docs, Sheets, Slides, Mail and PDF — designed in Europe, hosted in Europe, owned by you. No CLOUD Act. No data harvesting. Just your work.
		</p>

		<div class="mt-10 flex flex-wrap items-center gap-3">
			<a
				href="/register"
				class="hero-cta group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#0a0a0b] transition-all duration-200 hover:scale-[1.02] hover:bg-white/95"
			>
				Start free trial
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
			</a>
			<a
				href="/app/document"
				class="hero-cta inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/[0.06] hover:border-white/[0.2]"
			>
				Try Alto Docs in browser
			</a>
		</div>

		<p class="mt-5 text-xs text-white/40">14-day free trial · no credit card · cancel anytime</p>
	</div>

	<!-- Hero visual: app preview frame -->
	<div class="hero-visual relative mx-auto max-w-6xl px-6 lg:px-10 pb-20 lg:pb-28">
		<div class="relative rounded-2xl border border-white/[0.08] bg-[#0f0f12] p-2 shadow-[0_30px_80px_-20px_rgba(37,99,235,0.25)]">
			<div class="flex items-center gap-1.5 px-3 py-2.5">
				<span class="h-3 w-3 rounded-full bg-white/[0.08]"></span>
				<span class="h-3 w-3 rounded-full bg-white/[0.08]"></span>
				<span class="h-3 w-3 rounded-full bg-white/[0.08]"></span>
				<div class="ml-3 inline-flex items-center gap-2 text-[11px] text-white/40">
					<span class="inline-flex h-4 w-4 items-center justify-center rounded bg-[#2563eb] text-white text-[8px] font-bold">A</span>
					Untitled — Alto Docs
				</div>
			</div>
			<div class="aspect-[16/9] rounded-xl bg-white overflow-hidden relative">
				<!-- Mock document content -->
				<div class="absolute inset-0 p-10 lg:p-14 text-[#1a1a1d]">
					<div class="max-w-[42rem] mx-auto">
						<div class="h-3 w-32 bg-[#1a1a1d] rounded-sm mb-6"></div>
						<div class="h-7 w-3/4 bg-[#1a1a1d] rounded-sm mb-8"></div>
						<div class="space-y-2.5">
							<div class="h-2.5 w-full bg-[#1a1a1d]/15 rounded-sm"></div>
							<div class="h-2.5 w-[92%] bg-[#1a1a1d]/15 rounded-sm"></div>
							<div class="h-2.5 w-[97%] bg-[#1a1a1d]/15 rounded-sm"></div>
							<div class="h-2.5 w-[85%] bg-[#1a1a1d]/15 rounded-sm"></div>
							<div class="h-2.5 w-[78%] bg-[#1a1a1d]/15 rounded-sm"></div>
						</div>
						<div class="mt-8 h-5 w-40 bg-[#2563eb] rounded-sm"></div>
						<div class="mt-4 space-y-2.5">
							<div class="h-2.5 w-full bg-[#1a1a1d]/15 rounded-sm"></div>
							<div class="h-2.5 w-[88%] bg-[#1a1a1d]/15 rounded-sm"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- FEATURES -->
<section
	id="features"
	bind:this={featuresEl}
	class="relative py-24 lg:py-32"
>
	<div class="mx-auto max-w-7xl px-6 lg:px-10">
		<div class="max-w-2xl">
			<p class="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#2563eb] mb-5">The suite</p>
			<h2 class="text-4xl lg:text-6xl font-extrabold tracking-[-0.03em] leading-[1.05]">
				Five apps.<br/>
				<span class="text-white/40">One opinionated suite.</span>
			</h2>
			<p class="mt-6 text-lg text-white/60 max-w-xl leading-relaxed">
				Each app is built ground-up in Rust for performance, with native file formats and zero lock-in.
			</p>
		</div>

		<div class="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
			{#each apps as app}
				<div
					class="feature-card group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.04] hover:-translate-y-1"
				>
					<div
						class="inline-flex h-11 w-11 items-center justify-center rounded-xl mb-6"
						style="background: {app.color}1a; color: {app.color};"
					>
						<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{@html app.icon}</svg>
					</div>

					<div class="flex items-baseline gap-2 mb-2">
						<h3 class="text-xl font-semibold tracking-tight">Alto {app.name}</h3>
						{#if app.available}
							<span class="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">Live</span>
						{:else}
							<span class="text-[10px] font-semibold uppercase tracking-wider text-white/30">Soon</span>
						{/if}
					</div>
					<p class="text-sm text-white/50 mb-1">{app.tagline}</p>
					<p class="text-sm text-white/70 leading-relaxed mt-4">{app.description}</p>

					{#if app.available}
						<a
							href="/app/document"
							class="inline-flex items-center gap-1.5 mt-6 text-sm font-medium text-white hover:text-[#2563eb] transition-colors"
						>
							Open
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
						</a>
					{:else}
						<span class="inline-flex items-center gap-1.5 mt-6 text-sm font-medium text-white/30">
							Coming Q4 2026
						</span>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- SOVEREIGNTY -->
<section
	id="sovereignty"
	bind:this={sovereigntyEl}
	class="relative py-24 lg:py-32 border-t border-white/[0.06]"
>
	<div class="mx-auto max-w-7xl px-6 lg:px-10">
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
			<div class="lg:col-span-5">
				<p class="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#2563eb] mb-5">Sovereignty</p>
				<h2 class="text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05]">
					Your data stays<br/>in Europe.
				</h2>
				<p class="mt-6 text-lg text-white/60 leading-relaxed">
					Microsoft 365 is a US-based service. Even when "hosted" in the EU, it remains exposed to the CLOUD Act, allowing US authorities to access European data. Alto is a different bet.
				</p>
			</div>

			<div class="lg:col-span-7 grid grid-cols-2 gap-px bg-white/[0.06] rounded-2xl overflow-hidden">
				<div class="sov-stat p-8 bg-[#0a0a0b]">
					<div class="text-4xl font-extrabold tracking-tight text-white">100%</div>
					<div class="mt-2 text-sm text-white/50">EU infrastructure</div>
				</div>
				<div class="sov-stat p-8 bg-[#0a0a0b]">
					<div class="text-4xl font-extrabold tracking-tight text-white">0</div>
					<div class="mt-2 text-sm text-white/50">CLOUD Act exposure</div>
				</div>
				<div class="sov-stat p-8 bg-[#0a0a0b]">
					<div class="text-4xl font-extrabold tracking-tight text-white">GDPR</div>
					<div class="mt-2 text-sm text-white/50">Compliant by design</div>
				</div>
				<div class="sov-stat p-8 bg-[#0a0a0b]">
					<div class="text-4xl font-extrabold tracking-tight text-white">No AI</div>
					<div class="mt-2 text-sm text-white/50">Training on your data</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- FINAL CTA -->
<section
	bind:this={ctaEl}
	class="relative py-24 lg:py-40"
>
	<div class="mx-auto max-w-4xl px-6 lg:px-10 text-center cta-inner">
		<h2 class="text-4xl lg:text-6xl font-extrabold tracking-[-0.03em] leading-[1.05]">
			Switch to Alto<br/>in 3 minutes.
		</h2>
		<p class="mt-6 text-lg text-white/60 max-w-xl mx-auto leading-relaxed">
			Open your existing .docx files. No migration. No relearning. Just better.
		</p>
		<div class="mt-10 flex flex-wrap items-center justify-center gap-3">
			<a
				href="/register"
				class="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-semibold text-[#0a0a0b] transition-all duration-200 hover:scale-[1.02] hover:bg-white/95"
			>
				Start your free trial
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
			</a>
			<a
				href="/pricing"
				class="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.03] px-7 py-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/[0.06] hover:border-white/[0.2]"
			>
				See pricing
			</a>
		</div>
	</div>
</section>
