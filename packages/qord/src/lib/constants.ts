/**
 * Music Theory Constants
 * Provides comprehensive constants for pitch classes, notes, intervals, and chords
 * @module constants
 */

// ============================================================================
// Pitch Class Constants
// ============================================================================

/**
 * Regular expression for validating pitch letters (A-G, case-insensitive)
 */
export const PITCH_LETTER_REGEX = /^[A-Ga-g]$/;

/**
 * Regular expression for validating accidentals (#, b, x, n, or empty)
 */
export const PITCH_ACCIDENTAL_REGEX = /^(?:#+|b+|x+|n)?$/;

/**
 * Regular expression for parsing pitch class names
 */
export const PITCH_CLASS_REGEX = /^([A-Ga-g])(#+|b+|x+|n)?$/;

/** The seven letter names of pitch classes in Western music */
export const LETTERS = ["C", "D", "E", "F", "G", "A", "B"] as const;
export type Letter = (typeof LETTERS)[number];

/** Chromatic scale using sharps */
export const SHARP_PITCH_CLASSES = [
	"C",
	"C#",
	"D",
	"D#",
	"E",
	"F",
	"F#",
	"G",
	"G#",
	"A",
	"A#",
	"B",
] as const;

/** Chromatic scale using flats */
export const FLAT_PITCH_CLASSES = [
	"C",
	"Db",
	"D",
	"Eb",
	"E",
	"F",
	"Gb",
	"G",
	"Ab",
	"A",
	"Bb",
	"B",
] as const;

export type PitchClassName =
	| (typeof SHARP_PITCH_CLASSES)[number]
	| (typeof FLAT_PITCH_CLASSES)[number];

// ============================================================================
// Note Constants
// ============================================================================

/**
 * Semitone distance from C for each scale degree (C=0, D=2, E=4, etc.)
 */
export const STEP_SIZES = [0, 2, 4, 5, 7, 9, 11] as const;

/**
 * Distance in the circle of fifths from C for each pitch class
 * (C-D-E-F-G-A-B) -> (0, 2, 4, -1, 1, 3, 5)
 */
export const STEP_TO_FIFTH_DISTANCE = [0, 2, 4, -1, 1, 3, 5] as const;

/** Octave adjustment for each step in the circle of fifths */
export const STEP_TO_OCTAVE = STEP_TO_FIFTH_DISTANCE.map((n) =>
	Math.floor((n * 7) / 12),
) as readonly number[];

// ============================================================================
// Chord Constants
// ============================================================================

/**
 * Special case tokens for chord type parsing
 */
export const CHORD_TYPE_SPECIALCASE_TOKEN =
	"7|9|11|13|6/9|6/11|6/13|no[0-9]{1,2}|quartal" as const;
export const CHORD_TYPE_ALTERATIONS_TOKEN = "(add)?(b|#)?[0-9]{1,2}" as const;
export const CHORD_TYPE_QUALITY_TOKEN =
	"(min|maj|Maj|m/maj?|M|m|-|\\+|aug|dim|dom|sus|o|Δ|^|°|ø|q)(7|9|11|13|6/9|6/11|6/13|[0-9]{1,2})?" as const;

export const CHORD_TYPE_REGEX = new RegExp(
	`^(${CHORD_TYPE_SPECIALCASE_TOKEN}|${CHORD_TYPE_ALTERATIONS_TOKEN}|${CHORD_TYPE_QUALITY_TOKEN})`,
);

// ============================================================================
// Interval Constants
// ============================================================================

/**
 * Regular expression for validating interval qualities
 */
export const INTERVAL_QUALITY_REGEX = /^d{1,4}|m|M|P|A{1,4}$/;
export const INTERVAL_REGEX =
	/^([+-]?\d+)(d{1,4}|m|M|P|A{1,4})$|^(d{1,4}|m|M|P|A{1,4})([+-]?\d+)$/;

/** Interval quality abbreviations and their full names */
export const INTERVAL_QUALITY_MAP = new Map([
	["dddd", "Quadruply Diminished"],
	["ddd", "Triply Diminished"],
	["dd", "Doubly Diminished"],
	["d", "Diminished"],
	["m", "Minor"],
	["P", "Perfect"],
	["M", "Major"],
	["A", "Augmented"],
	["AA", "Doubly Augmented"],
	["AAA", "Triply Augmented"],
	["AAAA", "Quadruply Augmented"],
] as const) as ReadonlyMap<string, string>;

export type IntervalQuality = "P" | "M" | "m" | "A" | "d";

/** Interval number for each chroma (0-11) */
export const INTERVAL_NUMBER = [1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7] as const;

/** Interval quality for each chroma (0-11) */
export const INTERVAL_QUALITY = [
	"P",
	"m",
	"M",
	"m",
	"M",
	"P",
	"d",
	"P",
	"m",
	"M",
	"m",
	"M",
] as const;

// ============================================================================
// Key and Scale Constants
// ============================================================================

/** All major keys in order around the circle of fifths */
export const MAJOR_KEYS = [
	"C#",
	"F#",
	"B",
	"E",
	"A",
	"D",
	"G",
	"C",
	"F",
	"Bb",
	"Eb",
	"Ab",
	"Db",
	"Gb",
	"Cb",
] as const;

export type MajorKey = (typeof MAJOR_KEYS)[number];

/** Chromatic scale spelling for each major key */
export const MAJOR_KEY_SCALES: Readonly<Record<MajorKey, readonly string[]>> = {
	"C#": ["B#", "C#", "Dn", "D#", "En", "E#", "F#", "Gn", "G#", "An", "A#", "Bn"],
	"F#": ["B#", "C#", "Dn", "D#", "En", "E#", "F#", "Gn", "G#", "An", "A#", "B"],
	B: ["Cn", "C#", "Dn", "D#", "E", "Fn", "F#", "Gn", "G#", "An", "A#", "B"],
	E: ["Cn", "C#", "Dn", "D#", "E", "Fn", "F#", "Gn", "G#", "A", "A#", "B"],
	A: ["Cn", "C#", "D", "D#", "E", "Fn", "F#", "Gn", "G#", "A", "Bb", "B"],
	D: ["Cn", "C#", "D", "Eb", "E", "Fn", "F#", "G", "G#", "A", "Bb", "B"],
	G: ["C", "C#", "D", "Eb", "E", "Fn", "F#", "G", "Ab", "A", "Bb", "B"],
	C: ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"],
	F: ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "Bn"],
	Bb: ["C", "C#", "D", "Eb", "En", "F", "Gb", "G", "Ab", "A", "Bb", "Bn"],
	Eb: ["C", "Db", "D", "Eb", "En", "F", "F#", "G", "Ab", "An", "Bb", "Cb"],
	Ab: ["C", "Db", "Dn", "Eb", "En", "F", "Gb", "G", "Ab", "An", "Bb", "Bn"],
	Db: ["C", "Db", "Dn", "Eb", "En", "F", "Gb", "Gn", "Ab", "An", "Bb", "Cb"],
	Gb: ["Cn", "Db", "Dn", "Eb", "Fb", "F", "Gb", "Gn", "Ab", "An", "Bb", "Cb"],
	Cb: ["Cn", "Db", "Dn", "Eb", "Fb", "Fn", "Gb", "Gn", "Ab", "An", "Bb", "Cb"],
} as const;
