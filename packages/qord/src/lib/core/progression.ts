/**
 * Progression Module
 * Generates chord progressions based on scales and degrees
 * @module core/Progression
 */

import Scale from "./scale.js";
import Chord from "./chord/chord.js";
import Key from "./key.js";

/**
 * Common chord progressions (Roman numeral analysis)
 */
export const COMMON_PROGRESSIONS = {
	"ii-V-I": [2, 5, 1],
	"I-IV-V": [1, 4, 5],
	"I-vi-IV-V": [1, 6, 4, 5], // 50s progression
	"I-V-vi-IV": [1, 5, 6, 4], // Pop punk progression
	"i-bVI-bIII-bVII": [1, 6, 3, 7], // Axis of Awesome (minor)
	"12-bar-blues": [1, 1, 1, 1, 4, 4, 1, 1, 5, 4, 1, 5],
} as const;

export type ProgressionTemplate = readonly number[];

/**
 * Represents a chord progression
 */
export default class Progression {
	/**
	 * Generates a chord progression from a scale and degree list
	 * @param scale - The scale to derive chords from
	 * @param degrees - Array of scale degrees (1-indexed)
	 * @returns Array of Chords
	 * @example
	 * ```typescript
	 * const cMajor = Scale.from('C', 'major');
	 * const chords = Progression.fromDegrees(cMajor, [2, 5, 1]);
	 * // [Dm, G, C]
	 * ```
	 */
	static fromDegrees(scale: Scale, degrees: ProgressionTemplate): Chord[] {
		const diatonicChords = scale.getDiatonicChords();
		// Map degrees to chords (1-based index to 0-based array)
		return degrees.map((d) => {
			const chordData = diatonicChords.find((c) => c.degree === d);
			if (!chordData || !chordData.chord) {
				// Fallback: try to construct a basic triad if not found
				// This happens if the scale doesn't support a standard triad at that degree
				throw new Error(`Could not generate chord for degree ${d} in ${scale.name}`);
			}
			return chordData.chord;
		});
	}

	/**
	 * Generates a chord progression from a key and Roman numerals
	 * @param key - The musical key
	 * @param numerals - Array of Roman numerals (e.g., ["ii", "V", "I"])
	 * @returns Array of Chords
	 * @example
	 * ```typescript
	 * const key = new Key(PitchClass.from('C'), 'major');
	 * const chords = Progression.fromRomanNumerals(key, ['ii', 'V', 'I']);
	 * ```
	 */
	static fromRomanNumerals(key: Key, numerals: string[]): Chord[] {
		// This is a simplified implementation. 
		// A full implementation would parse Roman numerals (iv, V7, etc.)
		// For now, we'll map common ones or rely on degrees if possible.
		
		// TODO: Implement robust Roman numeral parser
		// For now, let's use the scale degrees method which is more reliable with the current infrastructure
		// Using variables to avoid unused warning
		const _k = key;
		const _n = numerals;
		throw new Error(`Roman numeral parsing not yet implemented. Use fromDegrees instead. (${_k.name}, ${_n.length})`);
	}
}
