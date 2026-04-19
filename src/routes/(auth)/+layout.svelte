<script lang="ts">
	let { children } = $props();
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="auth-shell min-h-screen bg-[#0a0a0b] text-white selection:bg-[#2563eb] selection:text-white">
	<header class="absolute top-0 inset-x-0 z-10">
		<div class="mx-auto max-w-7xl px-6 lg:px-10">
			<nav class="flex items-center justify-between h-20">
				<a href="/" class="flex items-center gap-2.5 group">
					<span class="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#0a0a0b] font-extrabold text-[15px] tracking-tight transition-transform duration-200 group-hover:scale-105">A</span>
					<span class="text-[17px] font-semibold tracking-tight">Alto</span>
				</a>
				<a href="/" class="text-sm text-white/60 hover:text-white transition-colors">← Back to home</a>
			</nav>
		</div>
	</header>

	<main class="relative min-h-screen flex items-center justify-center px-6 py-24">
		<!-- Subtle grid bg -->
		<div class="pointer-events-none absolute inset-0 opacity-[0.05]"
			style="background-image: linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px); background-size: 56px 56px; mask-image: radial-gradient(ellipse 60% 50% at 50% 50%, black, transparent);">
		</div>

		<div class="relative w-full max-w-[420px]">
			{@render children()}
		</div>
	</main>
</div>

<style>
	:global(.auth-shell) {
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
		font-feature-settings: 'kern' 1, 'liga' 1, 'cv11' 1;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		font-size: 16px;
		line-height: 1.5;
		letter-spacing: -0.01em;
	}
</style>
