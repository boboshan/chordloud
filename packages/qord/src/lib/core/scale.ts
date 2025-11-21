/**
 * Scale Module
 * Represents musical scales with modes and diatonic chord generation
 * @module core/Scale
 */

import PitchClass from "./pitch-class.js";
import Chord from "./chord/chord.js";
import PCSet from "./pcset.js";

/**
 * Scale mode definitions (interval patterns in semitones from root)
 */
export const SCALE_MODES = {
	// Major modes (modes of major scale)
	ionian: [0, 2, 4, 5, 7, 9, 11],       // Major
	dorian: [0, 2, 3, 5, 7, 9, 10],
	phrygian: [0, 1, 3, 5, 7, 8, 10],
	lydian: [0, 2, 4, 6, 7, 9, 11],
	mixolydian: [0, 2, 4, 5, 7, 9, 10],
	aeolian: [0, 2, 3, 5, 7, 8, 10],      // Natural minor
	locrian: [0, 1, 3, 5, 6, 8, 10],
	
	// Other common scales
	major: [0, 2, 4, 5, 7, 9, 11],
	minor: [0, 2, 3, 5, 7, 8, 10],
	harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
	melodicMinor: [0, 2, 3, 5, 7, 9, 11],
	
	// Pentatonic scales
	majorPentatonic: [0, 2, 4, 7, 9],
	minorPentatonic: [0, 3, 5, 7, 10],
	
	// Blues scales
	blues: [0, 3, 5, 6, 7, 10],
	majorBlues: [0, 2, 3, 4, 7, 9],
	
	// Exotic scales
	chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
	wholeTone: [0, 2, 4, 6, 8, 10],
	diminished: [0, 2, 3, 5, 6, 8, 9, 11],
	augmented: [0, 3, 4, 7, 8, 11],
	
	// Other useful scales
	phrygianDominant: [0, 1, 4, 5, 7, 8, 10],
	lydianDominant: [0, 2, 4, 6, 7, 9, 10],
	superLocrian: [0, 1, 3, 4, 6, 8, 10],
	bebopMajor: [0, 2, 4, 5, 7, 8, 9, 11],
	bebopDominant: [0, 2, 4, 5, 7, 9, 10, 11],
} as const;

export type ScaleMode = keyof typeof SCALE_MODES;

/**
 * Represents a musical scale
 * 
 * @example
 * ```typescript
 * // Create C major scale
 * const cMajor = Scale.from('C', 'major');
 * cMajor.notes; // [C, D, E, F, G, A, B]
 * 
 * // Get diatonic chords
 * const chords = cMajor.getDiatonicChords();
 * // [C major, D minor, E minor, F major, G major, A minor, B diminished]
 * 
 * // Create with custom intervals
 * const custom = new Scale(PitchClass.from('C'), [0, 3, 6, 9]);
 * ```
 */
export default class Scale {
	readonly #root: PitchClass;
	readonly #intervals: readonly number[];
	readonly #mode: ScaleMode | null;

	/**
	 * Creates a new Scale instance
	 * @param root - The root pitch class
	 * @param intervals - Array of intervals in semitones from the root
	 * @param mode - Optional mode name
	 */
	constructor(
		root: PitchClass,
		intervals: readonly number[],
		mode: ScaleMode | null = null,
	) {
		this.#root = root;
		this.#intervals = intervals;
		this.#mode = mode;
	}

	/**
	 * Gets the root pitch class of the scale
	 */
	get root(): PitchClass {
		return this.#root;
	}

	/**
	 * Gets the intervals that define this scale
	 */
	get intervals(): readonly number[] {
		return this.#intervals;
	}

	/**
	 * Gets the mode name if specified
	 */
	get mode(): ScaleMode | null {
		return this.#mode;
	}

	/**
	 * Gets the scale name
	 * 
	 * @example
	 * ```typescript
	 * const scale = Scale.from('C', 'major');
	 * scale.name; // "C major"
	 * ```
	 */
	get name(): string {
		const modeName = this.#mode ? this.#mode : 'scale';
		return `${this.#root.name} ${modeName}`;
	}

	/**
	 * Gets all pitch classes in the scale
	 * 
	 * @example
	 * ```typescript
	 * const scale = Scale.from('C', 'major');
	 * scale.notes; // [C, D, E, F, G, A, B]
	 * ```
	 */
	get notes(): PitchClass[] {
		return this.#intervals.map((semitones) =>
			PitchClass.from((this.#root.chroma + semitones) % 12)
		);
	}

	/**
	 * Gets the pitch class set representation
	 */
	get pcset(): PCSet {
		return PCSet.from(this.#intervals.map((i) => (this.#root.chroma + i) % 12));
	}

	/**
	 * Creates a Scale from a root and mode name
	 * 
	 * @example
	 * ```typescript
	 * const cMajor = Scale.from('C', 'major');
	 * const dDorian = Scale.from('D', 'dorian');
	 * const gMixolydian = Scale.from('G', 'mixolydian');
	 * ```
	 */
	static from(root: string | PitchClass, mode: ScaleMode): Scale {
		const rootPc = typeof root === 'string' ? PitchClass.from(root) : root;
		const intervals = SCALE_MODES[mode];
		return new Scale(rootPc, intervals, mode);
	}

	/**
	 * Gets the scale degree at a given position (1-indexed)
	 * 
	 * @example
	 * ```typescript
	 * const scale = Scale.from('C', 'major');
	 * scale.degree(1); // C (tonic)
	 * scale.degree(5); // G (dominant)
	 * ```
	 */
	degree(n: number): PitchClass | null {
		if (n < 1 || n > this.notes.length) {
			return null;
		}
		return this.notes[n - 1];
	}

	/**
	 * Generates diatonic triads for each scale degree
	 * 
	 * @example
	 * ```typescript
	 * const cMajor = Scale.from('C', 'major');
	 * const chords = cMajor.getDiatonicChords();
	 * // Returns: I (C major), ii (D minor), iii (E minor), 
	 * //          IV (F major), V (G major), vi (A minor), vii° (B diminished)
	 * ```
	 */
	getDiatonicChords(): Array<{ degree: number; chord: Chord | null }> {
		const notes = this.notes;
		const chords: Array<{ degree: number; chord: Chord | null }> = [];

		for (let i = 0; i < notes.length; i++) {
			const root = notes[i];
			const third = notes[(i + 2) % notes.length];
			const fifth = notes[(i + 4) % notes.length];

			// Try to recognize the chord
			const results = Chord.guess([root.name, third.name, fifth.name]);
			chords.push({
				degree: i + 1,
				chord: results.length > 0 ? results[0].chord : null,
			});
		}

		return chords;
	}

	/**
	 * Generates diatonic seventh chords for each scale degree
	 * 
	 * @example
	 * ```typescript
	 * const cMajor = Scale.from('C', 'major');
	 * const sevenths = cMajor.getDiatonicSevenths();
	 * // Returns: Imaj7, ii7, iii7, IVmaj7, V7, vi7, viiø7
	 * ```
	 */
	getDiatonicSevenths(): Array<{ degree: number; chord: Chord | null }> {
		const notes = this.notes;
		const chords: Array<{ degree: number; chord: Chord | null }> = [];

		for (let i = 0; i < notes.length; i++) {
			const root = notes[i];
			const third = notes[(i + 2) % notes.length];
			const fifth = notes[(i + 4) % notes.length];
			const seventh = notes[(i + 6) % notes.length];

			// Try to recognize the chord
			const results = Chord.guess([root.name, third.name, fifth.name, seventh.name]);
			chords.push({
				degree: i + 1,
				chord: results.length > 0 ? results[0].chord : null,
			});
		}

		return chords;
	}

	/**
	 * Checks if a pitch class is in the scale
	 * 
	 * @example
	 * ```typescript
	 * const cMajor = Scale.from('C', 'major');
	 * cMajor.contains(PitchClass.from('E')); // true
	 * cMajor.contains(PitchClass.from('F#')); // false
	 * ```
	 */
	contains(pc: PitchClass): boolean {
		return this.notes.some((note) => note.chroma === pc.chroma);
	}

	/**
	 * Transposes the scale by a number of semitones
	 * 
	 * @example
	 * ```typescript
	 * const cMajor = Scale.from('C', 'major');
	 * const dMajor = cMajor.transpose(2);
	 * dMajor.name; // "D major"
	 * ```
	 */
	transpose(semitones: number): Scale {
		const newRoot = PitchClass.from((this.#root.chroma + semitones) % 12);
		return new Scale(newRoot, this.#intervals, this.#mode);
	}

	/**
	 * Gets the relative minor/major scale
	 * 
	 * @example
	 * ```typescript
	 * const cMajor = Scale.from('C', 'major');
	 * const aMinor = cMajor.getRelative();
	 * aMinor.name; // "A aeolian"
	 * ```
	 */
	getRelative(): Scale | null {
		if (this.#mode === 'major' || this.#mode === 'ionian') {
			// Relative minor is 3 semitones down
			return Scale.from(PitchClass.from((this.#root.chroma + 9) % 12), 'aeolian');
		}
		if (this.#mode === 'minor' || this.#mode === 'aeolian') {
			// Relative major is 3 semitones up
			return Scale.from(PitchClass.from((this.#root.chroma + 3) % 12), 'ionian');
		}
		return null;
	}

	/**
	 * Converts to JSON-serializable object
	 */
	toJSON(): { type: 'Scale'; root: ReturnType<PitchClass['toJSON']>; intervals: readonly number[]; mode: ScaleMode | null } {
		return {
			type: 'Scale',
			root: this.#root.toJSON(),
			intervals: this.#intervals,
			mode: this.#mode,
		};
	}

	/**
	 * Creates a Scale from JSON
	 */
	static fromJSON(json: { root: ReturnType<PitchClass['toJSON']>; intervals: readonly number[]; mode: ScaleMode | null }): Scale {
		return new Scale(PitchClass.fromJSON(json.root), json.intervals, json.mode);
	}

	/**
	 * Returns string representation
	 */
	toString(): string {
		return this.name;
	}
}
