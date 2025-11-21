<script lang="ts">
	import { Note } from 'qord';

	let {
		activeNotes = $bindable([]),
		startOctave = 3,
		minOctaves = 1,
		maxOctaves = 8,
		octaves
	}: {
		activeNotes?: string[];
		startOctave?: number;
		minOctaves?: number;
		maxOctaves?: number;
		octaves?: number;
	} = $props();

	let width = $state(0);

	const MIN_KEY_WIDTH = 28; // Minimum width for a white key in pixels
	const KEY_ASPECT_RATIO = 4; // Height / Width
	const KEYS_PER_OCTAVE = 7;

	// Calculate how many octaves fit based on width and minimum key width
	let octaveCount = $derived.by(() => {
		if (octaves) return octaves;
		if (!width) return minOctaves;

		// How many octaves can we fit if each key is at least MIN_KEY_WIDTH?
		// width / (octaves * 7) >= MIN_KEY_WIDTH
		// width / (7 * MIN_KEY_WIDTH) >= octaves
		const calculated = Math.floor(width / (KEYS_PER_OCTAVE * MIN_KEY_WIDTH));
		return Math.max(minOctaves, Math.min(maxOctaves, calculated));
	});

	// Calculate the height based on the actual key width we will use
	let containerHeight = $derived.by(() => {
		if (!width || !octaveCount) return 0;
		const keyWidth = width / (octaveCount * KEYS_PER_OCTAVE);
		return keyWidth * KEY_ASPECT_RATIO;
	});

	// Generate all keys in a flat structure
	let keys = $derived.by(() => {
		const whites: { name: string; midi: number }[] = [];
		const blacks: { name: string; midi: number; left: number }[] = [];

		for (let i = 0; i < octaveCount; i++) {
			const octaveNumber = startOctave + i;
			const whiteLetters = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

			// Add white keys
			whiteLetters.forEach((letter) => {
				const name = `${letter}${octaveNumber}`;
				const midi = getMidiNumber(name);
				whites.push({ name, midi });
			});

			// Add black keys
			const blackDefs = [
				{ name: 'C#', offset: 1 },
				{ name: 'D#', offset: 2 },
				{ name: 'F#', offset: 4 },
				{ name: 'G#', offset: 5 },
				{ name: 'A#', offset: 6 }
			];

			blackDefs.forEach((def) => {
				const name = `${def.name}${octaveNumber}`;
				const midi = getMidiNumber(name);
				// Calculate position as percentage of the total width
				// Each octave is 100 / octaveCount percent
				// Within octave, each white key slot is 1/7th
				// Black keys are centered on the grid lines between white keys
				// C# is between 1st and 2nd white key (index 0 and 1) -> offset 1
				// Position = (i * 7 + def.offset) * (100 / (octaveCount * 7))
				// But we need to subtract half the black key width to center it
				// Let's just store the center position in % relative to the whole board
				const centerPos = ((i * 7 + def.offset) / (octaveCount * 7)) * 100;
				blacks.push({ name, midi, left: centerPos });
			});
		}
		return { whites, blacks };
	});

	// Cache active MIDI numbers for efficient lookup and enharmonic support
	let activeMidiNumbers = $derived(
		new Set(
			activeNotes.map((n) => {
				const note = Note.from(n);
				return note instanceof Note ? note.midiNumber : -1;
			})
		)
	);

	function getMidiNumber(name: string): number {
		const note = Note.from(name);
		return note instanceof Note ? (note.midiNumber ?? 0) : 0;
	}

	function toggleNote(noteName: string) {
		// Check if note is already active (by MIDI number to handle enharmonics)
		const midi = getMidiNumber(noteName);

		// Find if any active note matches this MIDI number
		const existingNote = activeNotes.find((n) => getMidiNumber(n) === midi);

		if (existingNote) {
			activeNotes = activeNotes.filter((n) => n !== existingNote);
		} else {
			activeNotes = [...activeNotes, noteName];
		}
	}

	function isNoteActive(midi: number) {
		return activeMidiNumbers.has(midi);
	}
</script>

<div
	class="w-full flex justify-center items-center select-none overflow-hidden"
	bind:clientWidth={width}
>
	<div class="relative w-full" style="height: {containerHeight}px;">
		<div class="flex h-full gap-[1px]">
			{#each keys.whites as key}
				<button
					class={[
						'flex-1 bg-[#f9f4da] rounded-b-sm flex items-end justify-center pb-2 transition-colors duration-75 relative',
						isNoteActive(key.midi) ? 'bg-[#fcba28] hover:bg-[#e6a925]' : 'hover:bg-[#e6e1ca]'
					]}
					onmousedown={() => toggleNote(key.name)}
				>
					<span class="text-[10px] text-gray-700 pointer-events-none mb-1">{key.name}</span>
				</button>
			{/each}
		</div>

		<!-- Black Keys Container -->
		<div class="absolute inset-0 pointer-events-none">
			{#each keys.blacks as key}
				<button
					title={key.name}
					class={[
						'absolute h-[60%] bg-[#231f20] border-b border-x border-[#231f20] rounded-b-sm transition-colors duration-75 pointer-events-auto',
						isNoteActive(key.midi) ? 'bg-[#fcba28] hover:bg-[#e6a925]' : 'hover:bg-[#242122]'
					]}
					style="left: {key.left}%; width: {0.6 *
						(100 / (octaveCount * 7))}%; transform: translateX(-50%);"
					onmousedown={() => toggleNote(key.name)}
				>
				</button>
			{/each}
		</div>
	</div>
</div>
