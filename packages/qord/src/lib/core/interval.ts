/**
 * Interval Module
 * Represents a musical interval with quality and number
 * @module core/Interval
 */

import Note from "./note.js";
import PitchClass from "./pitch-class.js";
import {
	STEP_SIZES,
	INTERVAL_QUALITY_MAP,
	INTERVAL_REGEX,
	INTERVAL_NUMBER,
	INTERVAL_QUALITY,
} from "../constants.js";
import { calculateCoordinate, type Coordinate } from "../utils/helpers.js";
import {
	isValidIntervalQuality,
	isValidIntervalNumber,
} from "../utils/validation.js";
import { numberToOrdinal } from "../utils/formatting.js";

/**
 * Represents a musical interval
 */
export default class Interval {
	readonly #quality: string;
	readonly #number: number;

	/**
	 * Creates a new Interval instance
	 * @param quality - The interval quality (P, M, m, A, d, etc.)
	 * @param number - The interval number (can be negative for descending intervals)
	 */
	protected constructor(quality: string, number: number) {
		this.#quality = quality;
		this.#number = number;
	}

	/**
	 * Gets the interval quality
	 */
	get quality(): string {
		return this.#quality;
	}

	/**
	 * Gets the interval number
	 */
	get number(): number {
		return this.#number;
	}

	/**
	 * Gets the short name of the interval (e.g., "M3", "P5")
	 * @example
	 * ```typescript
	 * Interval.from('M3').name; // 'M3'
	 * ```
	 */
	get name(): string {
		return `${this.#quality}${this.#number}`;
	}

	/**
	 * Gets the full name of the interval (e.g., "Major 3rd", "Perfect 5th")
	 * @example
	 * ```typescript
	 * Interval.from('M3').fullName; // 'Major 3rd'
	 * ```
	 */
	get fullName(): string {
		const qualityName = INTERVAL_QUALITY_MAP.get(this.#quality) ?? this.#quality;
		return `${qualityName} ${numberToOrdinal(Math.abs(this.#number))}`;
	}

	/**
	 * Gets the number of complete octaves in the interval
	 * @example
	 * ```typescript
	 * Interval.from('P8').octaves; // 1
	 * Interval.from('M10').octaves; // 1
	 * ```
	 */
	get octaves(): number {
		return Math.floor(Math.abs(this.#number) / 8);
	}

	/**
	 * Gets the direction of the interval (1 for ascending, -1 for descending)
	 * @example
	 * ```typescript
	 * Interval.from('M3').direction; // 1
	 * Interval.from('-M3').direction; // -1
	 * ```
	 */
	get direction(): number {
		return this.#number > 0 ? 1 : -1;
	}

	/**
	 * Gets the scale step (0-6) of the simple interval
	 * @example
	 * ```typescript
	 * Interval.from('M3').step; // 2 (Third step)
	 * ```
	 */
	get step(): number {
		return (Math.abs(this.#number) - 1) % 7;
	}

	/**
	 * Gets the alteration in semitones from the base interval
	 * @example
	 * ```typescript
	 * Interval.from('M3').alteration; // 0
	 * Interval.from('m3').alteration; // -1
	 * ```
	 */
	get alteration(): number {
		if (this.#quality === "P" || this.#quality === "M") {
			return 0;
		}
		if (this.#quality === "m") {
			return -1;
		}
		if (this.#quality.startsWith("A")) {
			return this.#quality.length;
		}
		if (this.#quality.startsWith("d")) {
			const isPerfect = [1, 4, 5].includes(this.step + 1);
			return isPerfect
				? -this.#quality.length
				: -(this.#quality.length + 1);
		}
		return 0;
	}

	/**
	 * Gets the total number of semitones in the interval
	 */
	get semitones(): number {
		return (
			this.direction *
			(STEP_SIZES[this.step] + this.alteration + 12 * this.octaves)
		);
	}

	/**
	 * Gets the chroma (0-11) of the interval
	 */
	get chroma(): number {
		const rawChroma =
			(this.direction * (STEP_SIZES[this.step] + this.alteration)) % 12;
		return ((rawChroma % 12) + 12) % 12;
	}

	/**
	 * Gets the coordinate representation in pitch space
	 */
	get coordinate(): Coordinate {
		return calculateCoordinate(
			this.step,
			this.alteration,
			this.direction,
		)(this.octaves);
	}

	/**
	 * Creates a new Interval with validation
	 * @param quality - The interval quality
	 * @param number - The interval number
	 * @returns A new Interval instance
	 * @throws Error if quality or number is invalid
	 */
	static create(quality: string, number: number): Interval {
		if (!isValidIntervalQuality(quality)) {
			throw new Error(
				`Invalid interval quality: ${quality}. Must be P, M, m, A, d, or variations.`,
			);
		}
		if (!isValidIntervalNumber(number)) {
			throw new Error(
				`Invalid interval number: ${number}. Must be a non-zero integer.`,
			);
		}

		return new Interval(quality, number);
	}

	/**
	 * Parses an interval name into quality and number
	 * @param name - The interval name (e.g., "M3", "P5", "3M", "5P")
	 * @returns A tuple of [quality, number]
	 * @throws Error if the name is invalid
	 */
	static parseName(name: string): [string, number] {
		const match = name.match(INTERVAL_REGEX);

		if (!match) {
			throw new Error(
				`Invalid interval name: ${name}. Expected format: [quality][number] or [number][quality].`,
			);
		}

		const [, number1, quality1, quality2, number2] = match;
		const quality = quality1 || quality2;
		const number = number1 || number2;

		return [quality, Number.parseInt(number, 10)];
	}

	/**
	 * Creates an Interval from a name string
	 * @param name - The interval name (e.g., "M3", "P5")
	 * @returns A new Interval instance
	 * @throws Error if the name is invalid
	 */
	static fromName(name: string): Interval {
		if (typeof name !== "string") {
			throw new TypeError(
				`Invalid interval name: ${name}. Name must be a string.`,
			);
		}
		const [quality, number] = Interval.parseName(name);
		return new Interval(quality, number);
	}

	/**
	 * Creates an Interval from a number of semitones
	 * @param semitones - The number of semitones (can be negative)
	 * @returns A new Interval instance
	 */
	static fromSemitones(semitones: number): Interval {
		const direction = semitones < 0 ? -1 : 1;
		const absSemitones = Math.abs(semitones);
		const octaves = Math.floor(absSemitones / 12);
		const simplified = absSemitones % 12;
		const quality = INTERVAL_QUALITY[simplified];
		const number = direction * (INTERVAL_NUMBER[simplified] + 7 * octaves);
		return new Interval(quality, number);
	}

	/**
	 * Calculates the interval between two pitch classes or notes
	 * @param from - The starting pitch class or note
	 * @param to - The ending pitch class or note
	 * @returns A new Interval instance
	 */
	static between(
		from: Note | PitchClass | string | number,
		to: Note | PitchClass | string | number,
	): Interval {
		const getChroma = (
			p: Note | PitchClass | string | number,
		): number => {
			if (p instanceof Note || p instanceof PitchClass) {
				return p.chroma;
			}
			if (typeof p === "string") {
				const parsed = Note.from(p);
				return parsed instanceof Note ? parsed.chroma : parsed.chroma;
			}
			if (typeof p === "number") {
				return Note.fromMidi(p).chroma;
			}
			throw new TypeError(`Cannot get chroma from: ${p}`);
		};

		const chroma1 = getChroma(from);
		const chroma2 = getChroma(to);
		const semitones = chroma2 - chroma1;
		return Interval.fromSemitones(semitones);
	}

	/**
	 * Flexible factory method to create an Interval from various inputs
	 * @param args - Can be: Interval instance, name string, semitones number, or (quality, number) pair
	 * @returns A new Interval instance
	 */
	static from(...args: unknown[]): Interval {
		if (args.length === 1) {
			const [arg] = args;
			if (arg instanceof Interval) {
				return arg;
			}
			if (typeof arg === "string") {
				return Interval.fromName(arg);
			}
			if (typeof arg === "number") {
				return Interval.fromSemitones(arg);
			}
			throw new TypeError(
				`Cannot create Interval from: ${arg}. Expected Interval, string, or number.`,
			);
		}
		if (args.length === 2) {
			const [quality, number] = args;
			if (typeof quality !== "string" || typeof number !== "number") {
				throw new TypeError(
					`Invalid arguments. Expected (string, number), got (${typeof quality}, ${typeof number}).`,
				);
			}
			return Interval.create(quality, number);
		}
		throw new Error(
			"Invalid arguments for Interval.from(). Expected 1-2 arguments.",
		);
	}

	/**
	 * Returns a string representation of the interval
	 */
	toString(): string {
		return this.name;
	}

	/**
	 * Inverts the interval
	 * @returns A new inverted Interval instance
	 */
	invert(): Interval {
		const simpleNumber = ((this.step + 1) % 7) || 7;
		const complementNumber = 9 - simpleNumber;
		const newNumber = this.direction * (complementNumber + 7 * this.octaves);

		let newQuality: string;
		if (this.#quality === "P") {
			newQuality = "P";
		} else if (this.#quality === "M") {
			newQuality = "m";
		} else if (this.#quality === "m") {
			newQuality = "M";
		} else if (this.#quality.startsWith("A")) {
			newQuality = "d".repeat(this.#quality.length);
		} else if (this.#quality.startsWith("d")) {
			newQuality = "A".repeat(this.#quality.length);
		} else {
			newQuality = this.#quality;
		}

		return new Interval(newQuality, newNumber);
	}

	/**
	 * Converts to JSON-serializable object
	 */
	toJSON(): { type: 'Interval'; quality: string; number: number } {
		return {
			type: 'Interval',
			quality: this.quality,
			number: this.number,
		};
	}

	/**
	 * Creates an Interval from JSON
	 */
	static fromJSON(json: { quality: string; number: number }): Interval {
		return Interval.create(json.quality, json.number);
	}
}
