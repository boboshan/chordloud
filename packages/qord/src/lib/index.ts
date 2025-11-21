/**
 * Qord - Music Theory Library
 * A comprehensive TypeScript library for music theory operations
 */

// Core classes
export { default as PitchClass } from "./core/pitch-class.js";
export { default as Note } from "./core/note.js";
export { default as PCSet } from "./core/pcset.js";
export { default as Interval } from "./core/interval.js";
export { default as Scale, SCALE_MODES, type ScaleMode } from "./core/scale.js";
export { default as Key, type KeyMode } from "./core/key.js";
export { default as Progression, COMMON_PROGRESSIONS, type ProgressionTemplate } from "./core/progression.js";
export {
	default as Chord,
	ChordType,
	ChordTypeNode,
	ChordTypeTree,
	type GuessOptions,
	type ChordGuessResult,
} from "./core/chord/chord.js";

// Import classes for type guards
import PitchClass from "./core/pitch-class.js";
import Note from "./core/note.js";
import PCSet from "./core/pcset.js";
import Interval from "./core/interval.js";
import Chord from "./core/chord/chord.js";
import Scale from "./core/scale.js";

// Constants
export {
	PITCH_LETTER_REGEX,
	PITCH_ACCIDENTAL_REGEX,
	PITCH_CLASS_REGEX,
	LETTERS,
	SHARP_PITCH_CLASSES,
	FLAT_PITCH_CLASSES,
	STEP_SIZES,
	STEP_TO_FIFTH_DISTANCE,
	STEP_TO_OCTAVE,
	CHORD_TYPE_REGEX,
	INTERVAL_QUALITY_REGEX,
	INTERVAL_REGEX,
	INTERVAL_QUALITY_MAP,
	INTERVAL_NUMBER,
	INTERVAL_QUALITY,
	MAJOR_KEYS,
	MAJOR_KEY_SCALES,
	type Letter,
	type PitchClassName,
	type IntervalQuality,
	type MajorKey,
} from "./constants.js";

// Utilities
export { numberToOrdinal, capitalize } from "./utils/formatting.js";

export {
	isValidLetter,
	isValidAccidental,
	isValidChroma,
	isValidMidiNumber,
	isValidOctave,
	isValidIntervalQuality,
	isValidIntervalNumber,
} from "./utils/validation.js";

export {
	calculateCoordinate,
	rotate,
	generateRotations,
	type Coordinate,
} from "./utils/helpers.js";

export * as Midi from "./utils/midi.js";
export * as Audio from "./utils/audio.js";

// Chord database
export { CHORD_TYPE_DATABASE } from "./core/chord/data.js";

// Type guards
/**
 * Type guard to check if a value is a PitchClass instance
 * 
 * @example
 * ```typescript
 * if (isPitchClass(value)) {
 *   console.log(value.chroma); // TypeScript knows it's a PitchClass
 * }
 * ```
 */
export function isPitchClass(value: unknown): value is PitchClass {
	return value instanceof PitchClass;
}

/**
 * Type guard to check if a value is a Note instance
 * 
 * @example
 * ```typescript
 * if (isNote(value)) {
 *   console.log(value.frequency); // TypeScript knows it's a Note
 * }
 * ```
 */
export function isNote(value: unknown): value is Note {
	return value instanceof Note;
}

/**
 * Type guard to check if a value is an Interval instance
 * 
 * @example
 * ```typescript
 * if (isInterval(value)) {
 *   console.log(value.semitones); // TypeScript knows it's an Interval
 * }
 * ```
 */
export function isInterval(value: unknown): value is Interval {
	return value instanceof Interval;
}

/**
 * Type guard to check if a value is a Chord instance
 * 
 * @example
 * ```typescript
 * if (isChord(value)) {
 *   console.log(value.root); // TypeScript knows it's a Chord
 * }
 * ```
 */
export function isChord(value: unknown): value is Chord {
	return value instanceof Chord;
}

/**
 * Type guard to check if a value is a PCSet instance
 * 
 * @example
 * ```typescript
 * if (isPCSet(value)) {
 *   console.log(value.intervalVector); // TypeScript knows it's a PCSet
 * }
 * ```
 */
export function isPCSet(value: unknown): value is PCSet {
	return value instanceof PCSet;
}

/**
 * Type guard to check if a value is a Scale instance
 * 
 * @example
 * ```typescript
 * if (isScale(value)) {
 *   console.log(value.notes); // TypeScript knows it's a Scale
 * }
 * ```
 */
export function isScale(value: unknown): value is Scale {
	return value instanceof Scale;
}
