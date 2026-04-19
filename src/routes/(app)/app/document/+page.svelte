<script lang="ts">
	let fileInput: HTMLInputElement | undefined = $state();
	let dragOver = $state(false);
	let pickedName = $state<string | null>(null);

	function pickFile(file: File) {
		if (!file.name.endsWith('.docx')) {
			alert('Only .docx files are supported.');
			return;
		}
		pickedName = file.name;
	}

	function onFileSelected(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) pickFile(file);
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
		const file = e.dataTransfer?.files[0];
		if (file) pickFile(file);
	}

	function onDragOver(e: DragEvent) {
		e.preventDefault();
		dragOver = true;
	}

	function onDragLeave() {
		dragOver = false;
	}
</script>

<svelte:head>
	<title>Alto Docs · Document</title>
</svelte:head>

<div
	class="min-h-[calc(100vh-4rem)] bg-zinc-100 text-zinc-900"
	ondrop={onDrop}
	ondragover={onDragOver}
	ondragleave={onDragLeave}
	role="application"
>
	<div class="mx-auto max-w-3xl px-6 py-24 text-center">
		<div class="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-600 text-white text-xl font-bold">
			D
		</div>
		<h1 class="mt-6 text-4xl font-bold tracking-tight text-zinc-950">Alto Docs</h1>
		<p class="mt-3 text-zinc-600">The native .docx editor. Open a file to start editing.</p>

		<div
			class={[
				'mt-10 rounded-3xl border-2 bg-white p-12 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)]',
				dragOver ? 'border-blue-600 bg-blue-50/50' : 'border-dashed border-zinc-200'
			]}
		>
			<div class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-zinc-100">
				<svg class="h-6 w-6 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
				</svg>
			</div>

			<p class="mt-5 text-zinc-700 font-medium">
				{pickedName ?? 'Drop a .docx file here, or open one'}
			</p>
			<p class="mt-1 text-sm text-zinc-500">
				The full editor (toolbar, formatting, autosave, export) is being wired in.
			</p>

			<input
				bind:this={fileInput}
				type="file"
				accept=".docx"
				onchange={onFileSelected}
				class="hidden"
			/>

			<div class="mt-8 flex items-center justify-center gap-3 flex-wrap">
				<button
					type="button"
					onclick={() => fileInput?.click()}
					class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 cursor-pointer"
				>
					Open .docx
				</button>
				<a
					href="/app"
					class="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition-all hover:bg-zinc-50"
				>
					← Back to apps
				</a>
			</div>
		</div>

		<p class="mt-8 text-xs text-zinc-500">
			Documents are processed locally in your browser via WebAssembly. They never leave your device.
		</p>
	</div>
</div>
