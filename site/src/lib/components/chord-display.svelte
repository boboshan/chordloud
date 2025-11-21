<script lang="ts">
	import ChordName from '$lib/components/chord-name.svelte';

	let {
		detectedChords = [],
		showAltChords = false
	}: { detectedChords: any[]; showAltChords: boolean } = $props();
</script>

<div class="text-center">
	{#if detectedChords.length > 0}
		{@const primary = detectedChords[0]}
		<ChordName chord={primary.chord} class="text-10 md:text-16 lg:text-18" />

		{#if showAltChords && detectedChords.length > 1}
			<div class="opacity-70">
				{#each detectedChords.slice(1, 5) as { chord }}
					<ChordName {chord} class="px-2 text-4 sm:text-4 md:text-6" />
				{/each}
			</div>
		{/if}
	{:else}
		<p class="text-10 md:text-16 lg:text-18">- - -</p>
	{/if}
</div>
