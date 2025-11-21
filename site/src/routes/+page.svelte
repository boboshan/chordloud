<script lang="ts">
	import { onMount } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import { Note, Chord } from 'qord';
	import { midiManager } from '$lib/midi.svelte';

	import Staff from '$lib/components/staff.svelte';
	import Keyboard from '$lib/components/keyboard.svelte';
	import SettingsPanel from '$lib/components/settings-panel.svelte';
	import ChordDisplay from '$lib/components/chord-display.svelte';

	let selectedKey = $state<string>('C');

	const mobile = new MediaQuery('(max-width: 640px)');
	let staffScaleFactor = $derived(mobile.current ? 1 : 1.3);
	let staffHeight = $derived(mobile.current ? 180 : 250);

	let userSettings = $state({
		sortNotes: true,
		allowSlash: true,
		allowInversions: true,
		allowOmissions: true,
		showStave: true,
		showKeyboard: true,
		showAltChords: true
	});

	onMount(() => {
		midiManager.init();
		return () => {
			midiManager.cleanup();
		};
	});

	let sortedNotes = $derived.by(() => {
		if (userSettings.sortNotes) {
			return [...midiManager.activeNotes].sort((a, b) => {
				const noteA = Note.from(a);
				const noteB = Note.from(b);
				if (noteA instanceof Note && noteB instanceof Note) {
					return (noteA.midiNumber ?? 0) - (noteB.midiNumber ?? 0);
				}
				return 0;
			});
		}
		return midiManager.activeNotes;
	});

	/**
	 * Chord detection
	 */
	let detectedChords = $derived.by(() => {
		if (sortedNotes.length >= 2) {
			return Chord.guess(sortedNotes, {
				allowOmissions: userSettings.allowOmissions,
				allowInversions: userSettings.allowInversions,
				allowSlash: userSettings.allowSlash
			});
		}
		return [];
	});
</script>

<SettingsPanel bind:userSettings bind:selectedKey />

<div class="gap-4 grid grid-cols-1 w-full md:gap-6 lg:grid-cols-5">
	{#if userSettings.showStave}
		<div class="card lg:(col-span-2 h-300px)">
			<Staff
				notes={sortedNotes}
				key={selectedKey}
				scaleFactor={staffScaleFactor}
				height={staffHeight}
			/>
		</div>
	{/if}

	<div
		class={[
			'card relative lg:col-span-3 font-erode h-150px md:h-220px lg:h-300px flex justify-center items-center gap-0 overflow-hidden',
			userSettings.showStave ? 'lg:col-span-3' : 'lg:col-span-5'
		]}
	>
		<ChordDisplay {detectedChords} showAltChords={userSettings.showAltChords} />
	</div>

	{#if userSettings.showKeyboard}
		<div class="card lg:col-span-5">
			<Keyboard bind:activeNotes={midiManager.activeNotes} minOctaves={2} maxOctaves={3} />
		</div>
	{/if}
</div>
