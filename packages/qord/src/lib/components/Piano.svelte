<script lang="ts">
	import { Note } from '$lib/index.js';
	import * as AudioUtils from '$lib/utils/audio.js';

	let { selected = $bindable([]) }: { selected: string[] } = $props();

	const START_OCTAVE = 3;
	const OCTAVES = 2;

	// Helper to create an octave of keys
	function createOctave(octaveIndex: number) {
		const octaveNumber = START_OCTAVE + octaveIndex;
		const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
		const blackKeys = [
			{ name: 'C#', left: '14.28%' },
			{ name: 'D#', left: '28.57%' },
			{ name: 'F#', left: '57.14%' },
			{ name: 'G#', left: '71.43%' },
			{ name: 'A#', left: '85.71%' }
		];

		return {
			number: octaveNumber,
			whites: whiteKeys.map(letter => {
				const name = `${letter}${octaveNumber}`;
				return { name, midi: (Note.from(name) as Note).midiNumber! };
			}),
			blacks: blackKeys.map(k => {
				const name = `${k.name}${octaveNumber}`;
				return { ...k, name, midi: (Note.from(name) as Note).midiNumber! };
			})
		};
	}

	const octaves = $derived(Array.from({ length: OCTAVES }, (_, i) => createOctave(i)));

	let ctx: AudioContext | null = null;

	function toggleNote(noteStr: string, midi: number) {
		if (selected.includes(noteStr)) {
			selected = selected.filter(n => n !== noteStr);
		} else {
			selected = [...selected, noteStr];
			playNote(midi);
		}
	}

	function playNote(midi: number) {
		if (typeof window === 'undefined') return;
		if (!ctx) ctx = new AudioContext();
		
		const osc = AudioUtils.createOscillator(ctx, midi, 'triangle');
		const gain = ctx.createGain();
		gain.gain.value = 0.15;
		
		osc.connect(gain);
		gain.connect(ctx.destination);
		osc.start();
		
		gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
		osc.stop(ctx.currentTime + 0.5);
	}
</script>

<div class="piano-scroll">
	<div class="piano">
		{#each octaves as octave}
			<div class="octave">
				<!-- White Keys -->
				{#each octave.whites as key}
					<button
						class="white-key {selected.includes(key.name) ? 'active' : ''}"
						onclick={() => toggleNote(key.name, key.midi)}
						aria-label={key.name}
					>
						<span class="label">{key.name}</span>
					</button>
				{/each}
				
				<!-- Black Keys -->
				{#each octave.blacks as key}
					<button
						class="black-key {selected.includes(key.name) ? 'active' : ''}"
						style="left: {key.left}"
						onclick={() => toggleNote(key.name, key.midi)}
						aria-label={key.name}
					></button>
				{/each}
			</div>
		{/each}
		<!-- Final C -->
		<div class="octave" style="width: 40px; flex: 0 0 40px;">
			<button
				class="white-key {selected.includes(`C${START_OCTAVE + OCTAVES}`) ? 'active' : ''}"
				onclick={() => toggleNote(`C${START_OCTAVE + OCTAVES}`, (Note.from(`C${START_OCTAVE + OCTAVES}`) as Note).midiNumber!)}
				aria-label={`C${START_OCTAVE + OCTAVES}`}
			>
				<span class="label">C{START_OCTAVE + OCTAVES}</span>
			</button>
		</div>
	</div>
</div>

<style>
	.piano-scroll {
		width: 100%;
		overflow-x: auto;
		background: #222;
		padding: 20px;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0,0,0,0.3);
	}

	.piano {
		display: flex;
		height: 180px;
		width: max-content;
		margin: 0 auto;
	}

	.octave {
		position: relative;
		display: flex;
		width: 280px; /* 40px * 7 keys */
		flex-shrink: 0;
	}

	.white-key {
		flex: 1;
		background: white;
		border: 1px solid #ccc;
		border-radius: 0 0 4px 4px;
		position: relative;
		z-index: 1;
		cursor: pointer;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding-bottom: 10px;
		font-size: 12px;
		color: #555;
		transition: background 0.1s;
	}

	.white-key:hover {
		background: #f0f0f0;
	}

	.white-key.active {
		background: #4caf50;
		color: white;
		box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
	}

	.black-key {
		position: absolute;
		top: 0;
		width: 24px;
		height: 60%;
		background: #000;
		border: 1px solid #000;
		border-radius: 0 0 4px 4px;
		z-index: 2;
		cursor: pointer;
		transform: translateX(-50%);
		transition: background 0.1s;
	}

	.black-key:hover {
		background: #333;
	}

	.black-key.active {
		background: #2e7d32; /* Darker green */
		border-color: #2e7d32;
	}
</style>
