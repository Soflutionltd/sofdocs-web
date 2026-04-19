<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let yearly = $state(false);
	let plansEl: HTMLElement | undefined = $state();
	let triggers: any[] = [];
	let pendingPlan = $state<string | null>(null);
	let checkoutError = $state<string | null>(null);

	const plans = [
		{
			id: 'free' as const,
			name: 'Free',
			description: 'For individual projects and quick edits.',
			priceMonthly: 0,
			priceYearly: 0,
			cta: 'Get started',
			featured: false,
			features: [
				'Alto Docs in browser',
				'5 documents stored',
				'Basic .docx editing',
				'No collaboration',
				'Community support'
			]
		},
		{
			id: 'pro' as const,
			name: 'Pro',
			description: 'For professionals who write every day.',
			priceMonthly: 9.99,
			priceYearly: 99,
			cta: 'Start 14-day trial',
			featured: true,
			features: [
				'Everything in Free',
				'Unlimited documents',
				'Native macOS & Windows app',
				'Auto-sync across devices',
				'Real-time collaboration',
				'Email support (24h)'
			]
		},
		{
			id: 'business' as const,
			name: 'Business',
			description: 'For teams and organizations.',
			priceMonthly: 19.99,
			priceYearly: 199,
			cta: 'Start 14-day trial',
			featured: false,
			features: [
				'Everything in Pro',
				'Team workspaces',
				'SSO (SAML, OIDC)',
				'Audit log & retention',
				'Priority support (4h)',
				'Sovereign EU hosting'
			]
		}
	];

	type PlanRow = (typeof plans)[number];

	async function selectPlan(plan: PlanRow) {
		checkoutError = null;
		if (plan.id === 'free') {
			await goto(data.user ? '/app' : '/register');
			return;
		}

		if (!data.user) {
			await goto(`/register?plan=${plan.id}`);
			return;
		}

		pendingPlan = plan.id;
		try {
			const res = await fetch('/api/stripe/checkout', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ plan: plan.id })
			});

			if (!res.ok) {
				const text = await res.text();
				checkoutError = text || `Checkout failed (${res.status})`;
				pendingPlan = null;
				return;
			}

			const { url } = (await res.json()) as { url?: string };
			if (url) {
				window.location.assign(url);
			} else {
				checkoutError = 'Stripe did not return a checkout URL';
				pendingPlan = null;
			}
		} catch (err) {
			checkoutError = err instanceof Error ? err.message : 'Checkout failed';
			pendingPlan = null;
		}
	}

	function priceLabel(plan: typeof plans[number]) {
		if (plan.priceMonthly === 0) return 'Free';
		const v = yearly ? plan.priceYearly : plan.priceMonthly;
		return `€${v}`;
	}

	function priceSuffix(plan: typeof plans[number]) {
		if (plan.priceMonthly === 0) return 'forever';
		return yearly ? '/ year, per user' : '/ month, per user';
	}

	onMount(async () => {
		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		gsap.from('.pricing-title', { y: 30, opacity: 0, duration: 0.8, ease: 'expo.out' });
		gsap.from('.pricing-sub', { y: 20, opacity: 0, duration: 0.7, delay: 0.15, ease: 'expo.out' });
		gsap.from('.pricing-toggle', { y: 20, opacity: 0, duration: 0.6, delay: 0.3, ease: 'expo.out' });

		if (plansEl) {
			triggers.push(
				ScrollTrigger.create({
					trigger: plansEl,
					start: 'top 85%',
					onEnter: () => {
						gsap.from('.plan-card', {
							y: 40,
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
	<title>Pricing — Alto</title>
	<meta name="description" content="Simple, transparent pricing. Free trial 14 days. Pro €9.99/mo, Business €19.99/mo." />
</svelte:head>

<section class="relative py-20 lg:py-28">
	<div class="mx-auto max-w-7xl px-6 lg:px-10">
		<div class="text-center max-w-3xl mx-auto">
			<p class="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#2563eb] mb-5">Pricing</p>
			<h1 class="pricing-title text-5xl lg:text-7xl font-extrabold tracking-[-0.04em] leading-[1.02]">
				Simple, honest<br/>pricing.
			</h1>
			<p class="pricing-sub mt-6 text-lg text-white/60 leading-relaxed">
				No hidden fees. No usage limits on the things that matter. Cancel anytime.
			</p>
		</div>

		<!-- Toggle -->
		<div class="pricing-toggle mt-12 flex items-center justify-center">
			<div class="inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] p-1">
				<button
					type="button"
					onclick={() => (yearly = false)}
					class="rounded-full px-5 py-2 text-sm font-medium transition-all"
					class:bg-white={!yearly}
					class:text-black={!yearly}
					class:text-white={yearly}
					class:opacity-60={yearly}
				>
					Monthly
				</button>
				<button
					type="button"
					onclick={() => (yearly = true)}
					class="rounded-full px-5 py-2 text-sm font-medium transition-all flex items-center gap-2"
					class:bg-white={yearly}
					class:text-black={yearly}
					class:text-white={!yearly}
					class:opacity-60={!yearly}
				>
					Yearly
					<span
						class={[
							'text-[10px] font-bold rounded-full px-1.5 py-0.5',
							yearly ? 'bg-emerald-500 text-white' : 'bg-emerald-500/20 text-emerald-400'
						]}
					>−17%</span>
				</button>
			</div>
		</div>

		<!-- Plans grid -->
		<div bind:this={plansEl} class="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
			{#each plans as plan}
				<div
					class={[
						'plan-card relative rounded-2xl p-8 flex flex-col transition-all duration-300',
						plan.featured
							? 'bg-white text-black'
							: 'border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.15]'
					]}
				>
					{#if plan.featured}
						<div class="absolute -top-3 left-1/2 -translate-x-1/2">
							<span class="inline-flex items-center gap-1 rounded-full bg-[#2563eb] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Most popular</span>
						</div>
					{/if}

					<h3 class="text-2xl font-bold tracking-tight">{plan.name}</h3>
					<p class={['mt-2 text-sm leading-relaxed', plan.featured ? 'text-black/60' : 'text-white/60']}>
						{plan.description}
					</p>

					<div class="mt-8 flex items-baseline gap-2">
						<span class="text-5xl font-extrabold tracking-[-0.03em]">{priceLabel(plan)}</span>
						<span class={['text-sm', plan.featured ? 'text-black/50' : 'text-white/50']}>{priceSuffix(plan)}</span>
					</div>

					<button
						type="button"
						onclick={() => selectPlan(plan)}
						disabled={pendingPlan === plan.id}
						class={[
							'mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] cursor-pointer disabled:opacity-60 disabled:cursor-wait',
							plan.featured
								? 'bg-black text-white hover:bg-black/90'
								: 'bg-white text-black hover:bg-white/95'
						]}
					>
						{pendingPlan === plan.id ? 'Redirecting…' : plan.cta}
					</button>

					<ul class="mt-8 space-y-3">
						{#each plan.features as feature}
							<li class={['flex items-start gap-3 text-sm', plan.featured ? 'text-black/80' : 'text-white/80']}>
								<svg
									width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
									class={['mt-0.5 shrink-0', plan.featured ? 'text-black' : 'text-[#2563eb]']}
								><path d="M20 6 9 17l-5-5"/></svg>
								<span>{feature}</span>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>

		{#if checkoutError}
			<div class="mt-6 mx-auto max-w-2xl rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 text-center">
				{checkoutError}
			</div>
		{/if}

		<!-- FAQ light -->
		<div class="mt-24 max-w-3xl mx-auto">
			<h2 class="text-2xl lg:text-3xl font-bold tracking-tight text-center mb-10">Common questions</h2>
			<div class="space-y-1 rounded-2xl border border-white/[0.08] bg-white/[0.02] divide-y divide-white/[0.06]">
				<details class="group p-6">
					<summary class="flex items-center justify-between cursor-pointer list-none text-base font-medium">
						Is there a free trial?
						<span class="text-white/40 group-open:rotate-45 transition-transform">+</span>
					</summary>
					<p class="mt-3 text-sm text-white/60 leading-relaxed">Yes. Every paid plan includes a 14-day free trial. No credit card required.</p>
				</details>
				<details class="group p-6">
					<summary class="flex items-center justify-between cursor-pointer list-none text-base font-medium">
						Where is my data stored?
						<span class="text-white/40 group-open:rotate-45 transition-transform">+</span>
					</summary>
					<p class="mt-3 text-sm text-white/60 leading-relaxed">All Alto data is stored on European infrastructure. The Business plan offers sovereign EU hosting with regional data residency.</p>
				</details>
				<details class="group p-6">
					<summary class="flex items-center justify-between cursor-pointer list-none text-base font-medium">
						Can I cancel anytime?
						<span class="text-white/40 group-open:rotate-45 transition-transform">+</span>
					</summary>
					<p class="mt-3 text-sm text-white/60 leading-relaxed">Yes, cancel from your account at any time. You keep access until the end of the billing period.</p>
				</details>
				<details class="group p-6">
					<summary class="flex items-center justify-between cursor-pointer list-none text-base font-medium">
						Do you train AI on my documents?
						<span class="text-white/40 group-open:rotate-45 transition-transform">+</span>
					</summary>
					<p class="mt-3 text-sm text-white/60 leading-relaxed">Never. Your documents belong to you and are never used for training, ever.</p>
				</details>
			</div>
		</div>
	</div>
</section>
