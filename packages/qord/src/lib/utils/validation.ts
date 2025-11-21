/**
 * Validation Utilities
 * Type guards and validation functions for music theory primitives
 * @module utils/validation
 */

import {
	PITCH_LETTER_REGEX,
	PITCH_ACCIDENTAL_REGEX,
	INTERVAL_QUALITY_REGEX,
} from "../constants.js";

/**
 * Type guard to check if a value is a valid pitch letter (A-G, case-insensitive)
 * @param letter - The value to check
 * @returns True if the value is a valid pitch letter
 */
export function isValidLetter(letter: unknown): letter is string {
	return typeof letter === "string" && PITCH_LETTER_REGEX.test(letter);
}

/**
 * Type guard to check if a value is a valid accidental (#, b, x, n, or empty)
 * @param accidental - The value to check
 * @returns True if the value is a valid accidental
 */
export function isValidAccidental(
	accidental: unknown,
): accidental is string | null | undefined {
	return (
		!accidental ||
		(typeof accidental === "string" && PITCH_ACCIDENTAL_REGEX.test(accidental))
	);
}

/**
 * Type guard to check if a value is a valid chroma (0-11)
 * @param chroma - The value to check
 * @returns True if the value is a valid chroma
 */
export function isValidChroma(chroma: unknown): chroma is number {
	return (
		typeof chroma === "number" &&
		Number.isInteger(chroma) &&
		chroma >= 0 &&
		chroma < 12
	);
}

/**
 * Type guard to check if a value is a valid MIDI number (0-127)
 * @param midiNumber - The value to check
 * @returns True if the value is a valid MIDI number
 */
export function isValidMidiNumber(midiNumber: unknown): midiNumber is number {
	return (
		typeof midiNumber === "number" &&
		Number.isInteger(midiNumber) &&
		midiNumber >= 0 &&
		midiNumber <= 127
	);
}

/**
 * Type guard to check if a value is a valid octave (0-9)
 * @param octave - The value to check
 * @returns True if the value is a valid octave
 */
export function isValidOctave(octave: unknown): octave is number {
	return (
		typeof octave === "number" &&
		Number.isInteger(octave) &&
		octave >= 0 &&
		octave <= 9
	);
}

/**
 * Type guard to check if a value is a valid interval quality (P, M, m, A, d, etc.)
 * @param quality - The value to check
 * @returns True if the value is a valid interval quality
 */
export function isValidIntervalQuality(quality: unknown): quality is string {
	return typeof quality === "string" && INTERVAL_QUALITY_REGEX.test(quality);
}

/**
 * Type guard to check if a value is a valid interval number (non-zero integer)
 * @param number - The value to check
 * @returns True if the value is a valid interval number
 */
export function isValidIntervalNumber(number: unknown): number is number {
	return Number.isInteger(number) && number !== 0;
}
