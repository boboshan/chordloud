/**
 * Audio Utilities Module
 * Provides helper functions for working with Web Audio API and frequencies
 * @module utils/audio
 */

import Note from "../core/note.js";

const A4_FREQ = 440;
const A4_MIDI = 69;

/**
 * Converts a MIDI number to frequency in Hz
 * @param midi - The MIDI number
 * @returns The frequency in Hz
 * @example
 * ```typescript
 * midiToFrequency(69); // 440
 * ```
 */
export function midiToFrequency(midi: number): number {
	return Math.pow(2, (midi - A4_MIDI) / 12) * A4_FREQ;
}

/**
 * Converts a frequency in Hz to the nearest MIDI number
 * @param freq - The frequency in Hz
 * @returns The nearest MIDI number
 * @example
 * ```typescript
 * frequencyToMidi(440); // 69
 * ```
 */
export function frequencyToMidi(freq: number): number {
	return Math.round(12 * Math.log2(freq / A4_FREQ) + A4_MIDI);
}

/**
 * Converts a frequency in Hz to the nearest Note
 * @param freq - The frequency in Hz
 * @returns The nearest Note instance
 */
export function frequencyToNote(freq: number): Note {
	const midi = frequencyToMidi(freq);
	return Note.fromMidi(midi);
}

/**
 * Creates an oscillator node for a given note
 * @param ctx - The AudioContext
 * @param note - The note to play
 * @param type - The oscillator type (sine, square, sawtooth, triangle)
 * @returns A configured OscillatorNode
 */
export function createOscillator(
	ctx: AudioContext,
	note: Note | number,
	type: OscillatorType = "sine",
): OscillatorNode {
	const osc = ctx.createOscillator();
	osc.type = type;
	
	const freq = typeof note === "number" ? note : note.frequency;
	osc.frequency.setValueAtTime(freq, ctx.currentTime);
	
	return osc;
}
