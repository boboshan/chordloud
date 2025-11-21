/**
 * MIDI Utilities Module
 * Provides helper functions for working with MIDI messages and data
 * @module utils/midi
 */

import Note from "../core/note.js";

/**
 * MIDI Command Bytes
 */
export const MIDI_COMMANDS = {
	NOTE_OFF: 0x80,
	NOTE_ON: 0x90,
	POLYPHONIC_AFTERTOUCH: 0xa0,
	CONTROL_CHANGE: 0xb0,
	PROGRAM_CHANGE: 0xc0,
	CHANNEL_AFTERTOUCH: 0xd0,
	PITCH_BEND: 0xe0,
} as const;

/**
 * Creates a MIDI Note On message
 * @param note - The note to play
 * @param velocity - The velocity (0-127)
 * @param channel - The MIDI channel (1-16)
 * @returns A 3-byte MIDI message array
 * @example
 * ```typescript
 * const note = Note.from('C4');
 * const msg = createNoteOn(note, 100, 1); // [0x90, 60, 100]
 * ```
 */
export function createNoteOn(
	note: Note | number,
	velocity = 64,
	channel = 1,
): [number, number, number] {
	const midiNumber = typeof note === "number" ? note : note.midiNumber;
	if (midiNumber === null) {
		throw new Error("Invalid note for MIDI conversion");
	}
	const cmd = MIDI_COMMANDS.NOTE_ON | (channel - 1);
	return [cmd, midiNumber, velocity];
}

/**
 * Creates a MIDI Note Off message
 * @param note - The note to stop
 * @param velocity - The release velocity (0-127)
 * @param channel - The MIDI channel (1-16)
 * @returns A 3-byte MIDI message array
 */
export function createNoteOff(
	note: Note | number,
	velocity = 0,
	channel = 1,
): [number, number, number] {
	const midiNumber = typeof note === "number" ? note : note.midiNumber;
	if (midiNumber === null) {
		throw new Error("Invalid note for MIDI conversion");
	}
	const cmd = MIDI_COMMANDS.NOTE_OFF | (channel - 1);
	return [cmd, midiNumber, velocity];
}

/**
 * Parses a MIDI message
 * @param message - The 3-byte MIDI message
 * @returns Object containing parsed data
 */
export function parseMidiMessage(message: [number, number, number] | Uint8Array) {
	const [status, data1, data2] = message;
	const command = status & 0xf0;
	const channel = (status & 0x0f) + 1;

	switch (command) {
		case MIDI_COMMANDS.NOTE_ON:
			return {
				type: "noteOn",
				channel,
				note: Note.fromMidi(data1),
				velocity: data2,
			};
		case MIDI_COMMANDS.NOTE_OFF:
			return {
				type: "noteOff",
				channel,
				note: Note.fromMidi(data1),
				velocity: data2,
			};
		default:
			return { type: "other", channel, data1, data2 };
	}
}
