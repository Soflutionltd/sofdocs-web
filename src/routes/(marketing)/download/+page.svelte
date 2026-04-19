<script lang="ts">
	import { onMount } from 'svelte';

	const platforms = [
		{
			id: 'macos',
			name: 'macOS',
			caption: 'Apple Silicon · macOS 12+',
			href: '/downloads/Alto-latest-macos.dmg',
			available: true,
			icon: `<path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.84-1.012 1.4-2.427 1.247-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>`
		},
		{
			id: 'windows',
			name: 'Windows',
			caption: 'Windows 11 · Coming Q3 2026',
			href: '#',
			available: false,
			icon: `<path d="M3 12V6.75l6-1.32v6.48L3 12zm17-9v8.75l-10 .15V5.21L20 3zM3 13l6 .09v6.81l-6-1.15V13zm17 .25V22l-10-1.91v-6.93l10 .09z"/>`
		},
		{
			id: 'linux',
			name: 'Linux',
			caption: 'AppImage · Coming Q4 2026',
			href: '#',
			available: false,
			icon: `<path d="M12.504 2c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.075 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.685-.287 2.489a.99.99 0 0 0-.265.59c-.05.747.301 1.483.776 2.094.408.539.97.929 1.624 1.097a3.5 3.5 0 0 0 1.842.06c.726-.166 1.348-.55 1.83-1.092a.4.4 0 0 1 .293-.099c.36.053.741.038 1.11-.06.343-.094.658-.275.91-.535.252-.26.43-.589.508-.951.094-.428.063-.875-.092-1.27-.072-.18-.179-.342-.317-.475a.5.5 0 0 1-.144-.422 1.5 1.5 0 0 1 .107-.366c.02-.045.043-.09.07-.131a3.4 3.4 0 0 0 .314-1.27c.018-.272-.013-.547-.097-.806a1.5 1.5 0 0 0-.395-.622 5.7 5.7 0 0 0-.78-.65c-.31-.224-.622-.46-.86-.717a3 3 0 0 1-.587-.83c-.142-.33-.2-.677-.2-1.04 0-.378.046-.737.094-1.078a8 8 0 0 0 .081-.57c.034-.31.025-.59.018-.85a13 13 0 0 1-.05-1.27c0-.46.02-.91.084-1.34.064-.43.17-.83.343-1.18.173-.35.413-.65.737-.87.324-.22.733-.36 1.226-.36"/>`
		}
	];

	let detected = $state<string | null>(null);

	onMount(() => {
		const ua = navigator.userAgent.toLowerCase();
		if (ua.includes('mac')) detected = 'macos';
		else if (ua.includes('win')) detected = 'windows';
		else if (ua.includes('linux')) detected = 'linux';
	});

	const primary = $derived(platforms.find((p) => p.id === detected) ?? platforms[0]);
</script>

<svelte:head>
	<title>Download — Alto</title>
	<meta name="description" content="Download Alto for macOS. Native desktop app with offline editing and auto-sync." />
</svelte:head>

<section class="relative py-20 lg:py-28">
	<div class="mx-auto max-w-5xl px-6 lg:px-10 text-center">
		<p class="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#2563eb] mb-5">Download</p>
		<h1 class="text-5xl lg:text-7xl font-extrabold tracking-[-0.04em] leading-[1.02]">
			Native. Offline.<br/>
			<span class="text-white/40">Yours.</span>
		</h1>
		<p class="mt-6 text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
			Install the Alto desktop app for a faster, distraction-free experience. Auto-syncs with your account when online, fully usable offline.
		</p>

		<!-- Primary download (auto-detected) -->
		<div class="mt-12 inline-block">
			<a
				href={primary.available ? primary.href : '#'}
				class="group inline-flex items-center gap-3 rounded-2xl bg-white px-7 py-5 text-left transition-all duration-200 hover:scale-[1.01] hover:shadow-[0_20px_60px_-15px_rgba(255,255,255,0.25)]"
				class:opacity-70={!primary.available}
				class:pointer-events-none={!primary.available}
			>
				<svg width="40" height="40" viewBox="0 0 24 24" fill="#0a0a0b" xmlns="http://www.w3.org/2000/svg">{@html primary.icon}</svg>
				<div>
					<div class="text-xs font-semibold uppercase tracking-wider text-black/50">
						{primary.available ? 'Download for' : 'Coming soon for'}
					</div>
					<div class="text-xl font-bold text-black tracking-tight">Alto for {primary.name}</div>
					<div class="text-xs text-black/50 mt-0.5">{primary.caption}</div>
				</div>
				{#if primary.available}
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="ml-3 transition-transform group-hover:translate-y-0.5"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
				{/if}
			</a>
		</div>

		<p class="mt-4 text-xs text-white/40">
			Free forever for trial accounts. Auto-updates included.
		</p>

		<!-- Other platforms -->
		<div class="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
			{#each platforms as p}
				<a
					href={p.available ? p.href : '#'}
					class="rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-5 text-left transition-all duration-200 hover:bg-white/[0.04] hover:border-white/[0.15]"
					class:opacity-50={!p.available}
					class:pointer-events-none={!p.available}
				>
					<div class="flex items-center gap-3">
						<svg width="22" height="22" viewBox="0 0 24 24" fill="white">{@html p.icon}</svg>
						<div>
							<div class="text-sm font-semibold">{p.name}</div>
							<div class="text-[11px] text-white/50">{p.caption}</div>
						</div>
					</div>
				</a>
			{/each}
		</div>

		<!-- Web alternative -->
		<div class="mt-20 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 lg:p-12 max-w-3xl mx-auto">
			<h2 class="text-2xl lg:text-3xl font-bold tracking-tight">No install needed?</h2>
			<p class="mt-3 text-white/60 leading-relaxed">
				Alto Docs runs entirely in the browser. Open a .docx file with no setup, no signup. Try it now.
			</p>
			<a
				href="/app/document"
				class="mt-6 inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/[0.06] hover:border-white/[0.2]"
			>
				Open Alto in browser
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
			</a>
		</div>
	</div>
</section>
