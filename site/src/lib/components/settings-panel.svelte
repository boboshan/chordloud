<script lang="ts">
	import { MAJOR_KEYS } from 'qord';
	import { uiManager } from '$lib/ui.svelte';
	import { midiManager } from '$lib/midi.svelte';

	let {
		userSettings = $bindable(),
		selectedKey = $bindable()
	}: {
		userSettings: {
			sortNotes: boolean;
			allowSlash: boolean;
			allowInversions: boolean;
			allowOmissions: boolean;
			showStave: boolean;
			showKeyboard: boolean;
			showAltChords: boolean;
		};
		selectedKey: string;
	} = $props();

	function handleInputSelection(event: Event) {
		const select = event.target as HTMLSelectElement;
		midiManager.selectInput(select.value);
	}
</script>

<div
	class={[
		'absolute top-0 flex flex-col justify-center w-full px-6 h-screen z-5 bg-brand-coal bg-opacity-95 transition-all duration-300 ease-in-out sm:(static h-auto w-auto bg-transparent border-none)',
		uiManager.isMenuOpen ? 'left-0' : 'left--100%'
	]}
>
	<div class="flex flex-col flex-wrap gap-4 justify-center sm:flex-row">
		<label>
			<input type="checkbox" bind:checked={userSettings.sortNotes} />
			Sort Notes
		</label>
		<label>
			<input type="checkbox" bind:checked={userSettings.allowSlash} />
			Allow Slash
		</label>
		<label class:opacity-50={!userSettings.allowSlash}>
			<input
				type="checkbox"
				bind:checked={userSettings.allowInversions}
				disabled={!userSettings.allowSlash}
			/>
			Allow Inversions
		</label>
		<label>
			<input type="checkbox" bind:checked={userSettings.allowOmissions} />
			Allow Omissions
		</label>
		<label>
			<input type="checkbox" bind:checked={userSettings.showStave} />
			Show Stave
		</label>
		<label>
			<input type="checkbox" bind:checked={userSettings.showKeyboard} />
			Show Keyboard
		</label>
		<label>
			<input type="checkbox" bind:checked={userSettings.showAltChords} />
			Show Alternative Chords
		</label>
	</div>

	<div class="py-4 flex flex-col gap-4 w-full justify-between sm:py-6 sm:flex-row">
		<select
			id="midiInputSelect"
			name="Select MIDI input port"
			title="Select MIDI input port"
			class="text-brand-beige p-1 rounded bg-[#231f20]"
			value={midiManager.selectedInputName}
			onchange={handleInputSelection}
		>
			<option value="">-- Select a MIDI input --</option>
			{#each midiManager.inputs as midiInput (midiInput.id)}
				<option value={midiInput.name}>{midiInput.name}</option>
			{/each}
		</select>

		<label
			>Key:
			<select
				id="keySelect"
				name="Select a key"
				title="Select a key"
				class="text-brand-beige p-1 rounded bg-[#231f20]"
				bind:value={selectedKey}
			>
				{#each MAJOR_KEYS as key (key)}
					<option value={key}>{key}</option>
				{/each}
			</select>
		</label>
	</div>
</div>
