/**
 * PitchClass Module
 * Represents a pitch class (note without octave information) in Western music theory
 * @module core/PitchClass
 */

import {
	LETTERS,
	FLAT_PITCH_CLASSES,
	SHARP_PITCH_CLASSES,
	STEP_SIZES,
	PITCH_CLASS_REGEX,
	type Letter,
} from "../constants.js";
import { calculateCoordinate, type Coordinate } from "../utils/helpers.js";
import {
	isValidLetter,
	isValidAccidental,
	isValidChroma,
} from "../utils/validation.js";

/**
 * Represents a pitch class with letter name and optional accidental
 */
export default class PitchClass {
	readonly #letter: Letter;
	readonly #accidental: string | null;

	/**
	 * Creates a new PitchClass instance
	 * @param letter - The letter name (A-G)
	 * @param accidental - Optional accidental (#, b, x, n, or null)
	 */
	protected constructor(letter: string, accidental: string | null = null) {
		this.#letter = letter.toUpperCase() as Letter;
		this.#accidental = accidental ? accidental.replace("x", "##") : null;
	}

	/**
	 * Gets the letter name of the pitch class
	 */
	get letter(): Letter {
		return this.#letter;
	}

	/**
	 * Gets the accidental of the pitch class
	 */
	get accidental(): string | null {
		return this.#accidental;
	}

	/**
	 * Gets the full name of the pitch class (e.g., "C#", "Bb")
	 */
	get name(): string {
		return `${this.#letter}${this.#accidental ?? ""}`;
	}

	/**
	 * Gets the scale degree step (0-6) for C=0, D=1, etc.
	 */
	get step(): number {
		return LETTERS.indexOf(this.#letter);
	}

	/**
	 * Gets the alteration in semitones (# = 1, b = -1, x = 2, etc.)
	 */
	get alteration(): number {
		if (!this.#accidental || this.#accidental === "n") {
			return 0;
		}
		const sign = this.#accidental.startsWith("#") ? 1 : -1;
		return this.#accidental.length * sign;
	}

	/**
	 * Gets the chroma (0-11) where C=0, C#/Db=1, etc.
	 */
	get chroma(): number {
		return (STEP_SIZES[this.step] + this.alteration + 12) % 12;
	}

	/**
	 * Gets the coordinate representation in pitch space [fifth]
	 */
	get coordinate(): Coordinate {
		return calculateCoordinate(this.step, this.alteration)();
	}

	/**
	 * Creates a new PitchClass with validation
	 * @param letter - The letter name (A-G)
	 * @param accidental - Optional accidental
	 * @returns A new PitchClass instance
	 * @throws Error if the letter or accidental is invalid
	 */
	static create(letter: string, accidental?: string | null): PitchClass {
		if (!isValidLetter(letter)) {
			throw new Error(
				`Invalid pitch class letter: ${letter}. Must be A-G (case-insensitive).`,
			);
		}

		if (!isValidAccidental(accidental)) {
			throw new Error(
				`Invalid pitch class accidental: ${accidental}. Must be #, b, x, n, or empty.`,
			);
		}

		return new PitchClass(letter, accidental ?? null);
	}

	/**
	 * Parses a pitch class name into letter and accidental
	 * @param name - The pitch class name (e.g., "C#", "Bb")
	 * @returns A tuple of [letter, accidental]
	 * @throws Error if the name is invalid
	 */
	static parseName(name: string): [string, string | null] {
		const match = name.match(PITCH_CLASS_REGEX);
		if (!match) {
			throw new Error(
				`Invalid pitch class name: ${name}. Expected format: [A-G][#/b/x/n]`,
			);
		}
		const [, letter, accidental] = match;
		return [letter, accidental ?? null];
	}

	/**
	 * Creates a PitchClass from a name string
	 * @param name - The pitch class name (e.g., "C#", "Bb")
	 * @returns A new PitchClass instance
	 * @throws Error if the name is invalid
	 */
	static fromName(name: string): PitchClass {
		if (typeof name !== "string") {
			throw new TypeError(
				`Invalid pitch class name: ${name}. Name must be a string.`,
			);
		}
		const [letter, accidental] = PitchClass.parseName(name);
		return new PitchClass(letter, accidental);
	}

	/**
	 * Creates a PitchClass from a chroma value (0-11)
	 * @param chroma - The chroma value
	 * @param useSharps - Whether to use sharps (true) or flats (false)
	 * @returns A new PitchClass instance
	 * @throws Error if the chroma is invalid
	 */
	static fromChroma(chroma: number, useSharps = true): PitchClass {
		if (!isValidChroma(chroma)) {
			throw new RangeError(
				`Invalid chroma: ${chroma}. Chroma must be an integer between 0 and 11.`,
			);
		}
		const pitchClasses = useSharps ? SHARP_PITCH_CLASSES : FLAT_PITCH_CLASSES;
		return PitchClass.fromName(pitchClasses[chroma]);
	}

	/**
	 * Flexible factory method to create a PitchClass from various inputs
	 * @param args - Can be: PitchClass instance, name string, chroma number, or (letter, accidental) pair
	 * @returns A new PitchClass instance
	 */
	static from(...args: unknown[]): PitchClass {
		if (args.length === 1) {
			const [arg] = args;
			if (arg instanceof PitchClass) {
				return arg;
			}
			if (typeof arg === "string") {
				return PitchClass.fromName(arg);
			}
			if (typeof arg === "number") {
				return PitchClass.fromChroma(arg);
			}
			throw new TypeError(
				`Cannot create PitchClass from: ${arg}. Expected PitchClass, string, or number.`,
			);
		}
		if (args.length >= 2) {
			const [letter, accidental] = args;
			if (typeof letter !== "string") {
				throw new TypeError(`Letter must be a string, got: ${typeof letter}`);
			}
			if (accidental !== null && accidental !== undefined && typeof accidental !== "string") {
				throw new TypeError(
					`Accidental must be a string, null, or undefined, got: ${typeof accidental}`,
				);
			}
			return PitchClass.create(
				letter,
				accidental as string | null | undefined,
			);
		}
		throw new Error(
			"Invalid arguments for PitchClass.from(). Expected 1-2 arguments.",
		);
	}

	/**
	 * Returns a string representation of the pitch class
	 */
	toString(): string {
		return this.name;
	}

	/**
	 * Checks if two pitch classes are enharmonically equivalent
	 * @param other - The other pitch class to compare
	 * @returns True if the pitch classes have the same chroma
	 */
	enharmonicEquals(other: PitchClass): boolean {
		return this.chroma === other.chroma;
	}
}
