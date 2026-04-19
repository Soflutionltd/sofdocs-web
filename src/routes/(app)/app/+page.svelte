<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	type AppCard = {
		id: string;
		name: string;
		tagline: string;
		href: string | null;
		accent: string;
		live: boolean;
		icon: string;
	};

	const apps: AppCard[] = [
		{
			id: 'docs',
			name: 'Docs',
			tagline: 'Create, edit and export .docx files.',
			href: '/app/document',
			accent: 'bg-blue-600',
			live: true,
			icon: 'D'
		},
		{
			id: 'sheets',
			name: 'Sheets',
			tagline: 'Spreadsheets, formulas, charts.',
			href: null,
			accent: 'bg-emerald-600',
			live: false,
			icon: 'S'
		},
		{
			id: 'slides',
			name: 'Slides',
			tagline: 'Presentations and decks.',
			href: null,
			accent: 'bg-amber-600',
			live: false,
			icon: 'P'
		},
		{
			id: 'pdf',
			name: 'PDF',
			tagline: 'Read, annotate and sign PDFs.',
			href: null,
			accent: 'bg-rose-600',
			live: false,
			icon: 'F'
		},
		{
			id: 'mail',
			name: 'Mail',
			tagline: 'Sovereign EU email client.',
			href: null,
			accent: 'bg-violet-600',
			live: false,
			icon: 'M'
		}
	];

	const sub = $derived(data.subscription);
	const trialDaysLeft = $derived.by(() => {
		if (!sub || sub.status !== 'trialing' || !sub.trial_ends_at) return null;
		const ms = sub.trial_ends_at * 1000 - Date.now();
		return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
	});

	const firstName = $derived((data.user?.name ?? '').split(' ')[0] || 'there');
</script>

<svelte:head>
	<title>Apps · Alto</title>
</svelte:head>

<main class="min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100" style="font-family: 'Inter', system-ui, sans-serif;">
	<div class="mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-24">
		<header class="flex items-end justify-between gap-6 flex-wrap">
			<div>
				<div class="text-sm uppercase tracking-[0.2em] text-white/40">Welcome back</div>
				<h1 class="mt-2 text-5xl lg:text-6xl font-bold tracking-tight">Hi, {firstName}.</h1>
				<p class="mt-3 max-w-xl text-lg text-white/60">
					Your office suite, made in Europe. Pick an app to get started.
				</p>
			</div>

			{#if trialDaysLeft !== null}
				<div class="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-5 py-4">
					<div class="text-xs uppercase tracking-wider text-amber-200/80">Trial</div>
					<div class="mt-1 font-semibold text-amber-100">
						{trialDaysLeft} day{trialDaysLeft === 1 ? '' : 's'} left on {sub?.plan?.toUpperCase()}
					</div>
					<a href="/app/account" class="mt-1 inline-block text-xs text-amber-200/80 hover:text-amber-100 underline underline-offset-4">
						Manage subscription →
					</a>
				</div>
			{:else if sub?.plan === 'free'}
				<a
					href="/pricing"
					class="rounded-full bg-white text-zinc-950 px-5 py-3 text-sm font-semibold transition-all hover:scale-[1.02]"
				>
					Upgrade — 14-day free trial
				</a>
			{/if}
		</header>

		<!-- Apps grid -->
		<section class="mt-16">
			<div class="flex items-end justify-between gap-4 mb-6">
				<h2 class="text-xl font-semibold tracking-tight">Apps</h2>
				<span class="text-xs text-white/40">{apps.filter((a) => a.live).length} of {apps.length} available</span>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
				{#each apps as app (app.id)}
					{#if app.live && app.href}
						<a
							href={app.href}
							class="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20 hover:-translate-y-0.5"
						>
							<div class="flex items-start justify-between">
								<div class={['grid h-12 w-12 place-items-center rounded-2xl text-white font-bold text-lg', app.accent]}>
									{app.icon}
								</div>
								<span class="inline-flex items-center rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
									Live
								</span>
							</div>
							<div class="mt-6">
								<div class="text-xl font-semibold tracking-tight">Alto {app.name}</div>
								<p class="mt-1 text-sm text-white/60 leading-relaxed">{app.tagline}</p>
							</div>
							<div class="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-white/80 group-hover:text-white transition-colors">
								Open
								<svg class="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 0 1 .02-1.06L10.94 10 7.23 6.29a.75.75 0 1 1 1.06-1.06l4.24 4.24a.75.75 0 0 1 0 1.06l-4.24 4.24a.75.75 0 0 1-1.08.0z" clip-rule="evenodd" />
								</svg>
							</div>
						</a>
					{:else}
						<div class="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-6 opacity-70">
							<div class="flex items-start justify-between">
								<div class={['grid h-12 w-12 place-items-center rounded-2xl text-white font-bold text-lg opacity-60', app.accent]}>
									{app.icon}
								</div>
								<span class="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/60">
									Soon
								</span>
							</div>
							<div class="mt-6">
								<div class="text-xl font-semibold tracking-tight text-white/80">Alto {app.name}</div>
								<p class="mt-1 text-sm text-white/50 leading-relaxed">{app.tagline}</p>
							</div>
							<div class="mt-6 text-sm text-white/40">In development</div>
						</div>
					{/if}
				{/each}
			</div>
		</section>

		<!-- Recent documents stub -->
		<section class="mt-20">
			<div class="flex items-end justify-between gap-4 mb-6">
				<h2 class="text-xl font-semibold tracking-tight">Recent documents</h2>
				<a href="/app/document" class="text-sm text-white/60 hover:text-white transition-colors">New document →</a>
			</div>

			<div class="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-12 text-center">
				<div class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/5">
					<svg class="h-6 w-6 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
					</svg>
				</div>
				<p class="mt-4 text-white/70">No documents yet.</p>
				<p class="mt-1 text-sm text-white/40">Open your first .docx in Alto Docs to get started.</p>
				<a
					href="/app/document"
					class="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition-all hover:scale-[1.02]"
				>
					Open Alto Docs
				</a>
			</div>
		</section>

		<!-- Sovereignty footer ribbon -->
		<section class="mt-20 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-8">
			<div class="flex items-center justify-between gap-6 flex-wrap">
				<div>
					<div class="text-xs uppercase tracking-[0.2em] text-white/40">Sovereign by design</div>
					<div class="mt-2 text-lg font-semibold tracking-tight">EU infrastructure · GDPR · No CLOUD Act exposure</div>
				</div>
				<a href="/app/account" class="text-sm text-white/70 hover:text-white transition-colors">
					Account & billing →
				</a>
			</div>
		</section>
	</div>
</main>
