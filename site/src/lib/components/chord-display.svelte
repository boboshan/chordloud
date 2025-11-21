<script lang="ts">
	import ChordName from '$lib/components/chord-name.svelte';
	import type { ChordGuessResult } from 'qord';

	let {
		detectedChords = [],
		showAltChords = false
	}: { detectedChords: ChordGuessResult[]; showAltChords: boolean } = $props();
</script>

<div class="text-center">
	{#if detectedChords.length > 0}
		{@const primary = detectedChords[0]}
		<ChordName chord={primary.chord} class="text-10 lg:text-18 md:text-16" />

		{#if showAltChords && detectedChords.length > 1}
			<div class="opacity-70">
				{#each detectedChords.slice(1, 5) as { chord } (chord.toString())}
					<ChordName {chord} class="text-4 px-2 md:text-6 sm:text-4" />
				{/each}
			</div>
		{/if}
	{:else}
		<p class="text-10 lg:text-18 md:text-16">- - -</p>
	{/if}
</div>
