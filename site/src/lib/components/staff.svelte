<script lang="ts">
	import {
		Renderer,
		Stave,
		StaveNote,
		Voice,
		Formatter,
		Accidental,
		BarlineType,
		Modifier,
		StaveText
	} from 'vexflow';
	import { Note } from 'qord';

	let {
		notes = [],
		key = 'C',
		width = $bindable(500),
		height = $bindable(250),
		scaleFactor = 1.4,
		noteColor = '#f9f4da',
		staveColor = ' grey',
		symbolColor = '#f9f4da'
	}: {
		notes?: string[];
		key?: string;
		width?: number;
		height?: number;
		scaleFactor?: number;
		noteColor?: string;
		staveColor?: string;
		symbolColor?: string;
	} = $props();

	function renderStaff(container: HTMLDivElement) {
		if (!width || !height) return;

		container.innerHTML = ''; // Clear previous render

		const renderer = new Renderer(container, Renderer.Backends.SVG);
		renderer.resize(width, height);
		const context = renderer.getContext();
		context
			.scale(scaleFactor, scaleFactor)
			.setFillStyle(symbolColor)
			.setStrokeStyle(staveColor)
			.setLineWidth(1 / scaleFactor);

		const staveWidth = width / scaleFactor;
		const staveX = 0;
		const staveY = 10;
		const bassStaveY = staveY + 60; // Distance between staves

		// --- Treble Stave ---
		const trebleStave = new Stave(staveX, staveY, staveWidth);
		trebleStave
			.addClef('treble')
			.addKeySignature(key)
			.setBegBarType(BarlineType.NONE)
			.setEndBarType(BarlineType.NONE)
			.setContext(context);

		const staveText = new StaveText(`Key: ${key}`, Modifier.Position.ABOVE, {
			justification: 0
		});
		// staveText.setFont('Arial', 14, '');
		trebleStave.addModifier(staveText);
		trebleStave.draw();

		// --- Bass Stave ---
		const bassStave = new Stave(staveX, bassStaveY, staveWidth);
		bassStave
			.addClef('bass')
			.addKeySignature(key)
			.setBegBarType(BarlineType.NONE)
			.setEndBarType(BarlineType.NONE)
			.setContext(context)
			.draw();

		// Redraw staves with new style
		trebleStave.draw();
		bassStave.draw();

		if (notes.length === 0) return;

		try {
			const trebleNotes: string[] = [];
			const bassNotes: string[] = [];

			// Split notes into treble and bass
			notes.forEach((n) => {
				const note = Note.from(n);
				if (note instanceof Note) {
					// Middle C (C4) is 60. Typically split around there.
					if ((note.midiNumber ?? 0) >= 60) {
						trebleNotes.push(n);
					} else {
						bassNotes.push(n);
					}
				}
			});

			const voices: Voice[] = [];

			// --- Process Treble Voice ---
			if (trebleNotes.length > 0) {
				const keys = trebleNotes.map((n) => {
					const note = Note.from(n);
					if (note instanceof Note) {
						return `${note.letter.toLowerCase()}${note.accidental ?? ''}/${note.octave}`;
					}
					return '';
				});

				const staveNote = new StaveNote({
					keys: keys,
					clef: 'treble',
					duration: 'w',
					alignCenter: true
				});

				staveNote.setStyle({ fillStyle: noteColor, strokeStyle: noteColor });
				staveNote.setLedgerLineStyle({ strokeStyle: noteColor, lineWidth: 1 / scaleFactor });

				trebleNotes.forEach((n, i) => {
					const note = Note.from(n);
					if (note.accidental) {
						const acc = new Accidental(note.accidental);
						// Set style for accidentals
						acc.setStyle({ fillStyle: noteColor, strokeStyle: noteColor });
						staveNote.addModifier(acc, i);
					}
				});

				const voice = new Voice({ numBeats: 4, beatValue: 4 });
				voice.addTickables([staveNote]);
				voices.push(voice);
			}

			// --- Process Bass Voice ---
			if (bassNotes.length > 0) {
				const keys = bassNotes.map((n) => {
					const note = Note.from(n);
					if (note instanceof Note) {
						return `${note.letter.toLowerCase()}${note.accidental ?? ''}/${note.octave}`;
					}
					return '';
				});

				const staveNote = new StaveNote({
					keys: keys,
					clef: 'bass',
					duration: 'w',
					alignCenter: true
				});

				// Set style for notes
				staveNote.setStyle({ fillStyle: noteColor, strokeStyle: noteColor });
				staveNote.setLedgerLineStyle({ strokeStyle: noteColor, lineWidth: 1 / scaleFactor });

				bassNotes.forEach((n, i) => {
					const note = Note.from(n);
					if (note.accidental) {
						const acc = new Accidental(note.accidental);
						// Set style for accidentals
						acc.setStyle({ fillStyle: noteColor, strokeStyle: noteColor });
						staveNote.addModifier(acc, i);
					}
				});

				const voice = new Voice({ numBeats: 4, beatValue: 4 });
				voice.addTickables([staveNote]);
				voices.push(voice);
			}

			// --- Format and Draw ---
			if (voices.length > 0) {
				const formatter = new Formatter();
				formatter.joinVoices(voices).format(voices, staveWidth - 50);

				let voiceIndex = 0;
				if (trebleNotes.length > 0) {
					voices[voiceIndex].draw(context, trebleStave);
					voiceIndex++;
				}
				if (bassNotes.length > 0) {
					voices[voiceIndex].draw(context, bassStave);
				}
			}
		} catch (e) {
			console.error('Error rendering notes:', e);
		}
	}
</script>

<div class="w-full h-full" bind:clientWidth={width} bind:clientHeight={height}>
	<div {@attach renderStaff}></div>
</div>
