import { WebMidi, type Input } from 'webmidi';

export class MidiManager {
	activeNotes = $state<string[]>([]);
	inputs = $state<Input[]>([]);
	selectedInputName = $state<string>('');
	currentInput: Input | undefined;

	async init() {
		try {
			await WebMidi.enable();
			this.inputs = WebMidi.inputs;
			WebMidi.addListener('connected', () => {
				this.inputs = WebMidi.inputs;
			});
			WebMidi.addListener('disconnected', () => {
				this.inputs = WebMidi.inputs;
			});
		} catch (err) {
			console.error(err);
		}
	}

	selectInput(name: string) {
		this.selectedInputName = name;

		if (this.currentInput) {
			this.currentInput.removeListener('noteon', this.onNoteOn);
			this.currentInput.removeListener('noteoff', this.onNoteOff);
			this.currentInput = undefined;
		}

		if (!name) return;

		const input = WebMidi.getInputByName(name);
		if (input) {
			this.currentInput = input;
			input.addListener('noteon', this.onNoteOn);
			input.addListener('noteoff', this.onNoteOff);
		}
	}

	onNoteOn = (e: any) => {
		const noteName = e.note.identifier;
		if (!this.activeNotes.includes(noteName)) {
			this.activeNotes = [...this.activeNotes, noteName];
		}
	};

	onNoteOff = (e: any) => {
		const noteName = e.note.identifier;
		this.activeNotes = this.activeNotes.filter((n) => n !== noteName);
	};

	cleanup() {
		if (this.currentInput) {
			this.currentInput.removeListener('noteon', this.onNoteOn);
			this.currentInput.removeListener('noteoff', this.onNoteOff);
		}
		WebMidi.disable();
		WebMidi.removeListener('connected');
		WebMidi.removeListener('disconnected');
	}
}

export const midiManager = new MidiManager();
