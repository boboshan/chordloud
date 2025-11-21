/**
 * PCSet Module
 * Represents a collection of pitch classes for set-theoretic analysis
 * @module core/PCSet
 */

import Note from "./note.js";
import PitchClass from "./pitch-class.js";
import { isValidChroma } from "../utils/validation.js";
import { rotate } from "../utils/helpers.js";

/**
 * Represents a pitch class set with set-theoretic operations
 * Extends Array to provide collection behavior
 */
export default class PCSet extends Array<number> {
	/**
	 * Gets the binary representation of the pitch class set
	 * Each bit represents the presence (1) or absence (0) of a pitch class
	 */
	get binary(): number {
		return this.reduce((acc, chroma) => acc + 2 ** chroma, 0);
	}

	/**
	 * Calculates the interval vector (interval class content)
	 * Returns an array of 6 numbers representing the count of each interval class
	 */
	get intervalVector(): readonly number[] {
		const vector = Array(6).fill(0);
		if (this.length < 2) {
			return Object.freeze(vector);
		}

		for (let i = 0; i < this.length; i++) {
			for (let j = i + 1; j < this.length; j++) {
				let diff = (this[j] - this[i] + 12) % 12;
				if (diff > 6) {
					diff = 12 - diff;
				}
				vector[diff - 1]++;
			}
		}

		return Object.freeze(vector);
	}

	/**
	 * Returns a binary string representation (12 bits, one per pitch class)
	 */
	toString(): string {
		return this.reduce((acc, cur) => {
			acc[cur] = "1";
			return acc;
		}, Array(12).fill("0")).join("");
	}

	/**
	 * Transposes all pitch classes by n semitones
	 * @param n - Number of semitones to transpose
	 * @returns A new transposed PCSet
	 */
	transpose(n: number): PCSet {
		const transposed = this.map((p) => (((p + n) % 12) + 12) % 12);
		return PCSet.create(transposed);
	}

	/**
	 * Transposes the set so the first element is 0
	 * @returns A new zero-based PCSet
	 */
	zero(): PCSet {
		return this.transpose(-this[0]);
	}

	/**
	 * Rotates the pitch class set
	 * @param n - Number of positions to rotate
	 * @returns A new rotated PCSet
	 */
	rotate(n: number): PCSet {
		return PCSet.create(rotate(n, this));
	}

	/**
	 * Inverts the pitch class set (reflection)
	 * @returns A new inverted PCSet
	 */
	invert(): PCSet {
		const inverted = this.map((p) => (12 - p) % 12);
		return PCSet.create(inverted);
	}

	/**
	 * Reverses the order of pitch classes
	 * @returns A new reversed PCSet
	 */
	reverse(): PCSet {
		return PCSet.create(this.toReversed());
	}

	/**
	 * Returns the complement set (all pitch classes not in this set)
	 * @returns A new PCSet containing the complement
	 */
	complement(): PCSet {
		const complementSet: number[] = [];
		for (let i = 0; i < 12; i++) {
			if (!this.includes(i)) {
				complementSet.push(i);
			}
		}
		return PCSet.create(complementSet);
	}

	/**
	 * Calculates the normal form (most compact ordering)
	 * @returns A new PCSet in normal form
	 */
	normal(): PCSet {
		const sorted = this.toSorted((a, b) => a - b);
		const rotations: PCSet[] = [];
		for (let i = 0; i < sorted.length; i++) {
			const rotated = PCSet.create(rotate(i, sorted));
			rotations.push(rotated.zero());
		}

		return mostLeftCompact(rotations);
	}

	/**
	 * Calculates the prime form (normal form starting from 0)
	 * @returns A new PCSet in prime form
	 */
	prime(): PCSet {
		const originalReduced = this.normal().zero();
		const invertedReduced = this.invert().normal().zero();
		return mostLeftCompact([originalReduced, invertedReduced]);
	}

	/**
	 * Creates a new PCSet from an array, removing duplicates
	 * @param arr - Array of chromas
	 * @returns A new PCSet
	 */
	static create(arr: readonly number[]): PCSet {
		const pcset = new PCSet();
		const unique = new Set(arr);
		pcset.push(...unique);
		return pcset;
	}

	/**
	 * Creates a PCSet from a binary string representation
	 * @param str - 12-character binary string (e.g., "101010101010")
	 * @returns A new PCSet
	 * @throws TypeError if input is not a string
	 * @throws RangeError if string length is not 12
	 */
	static fromString(str?: string): PCSet {
		if (str === undefined) {
			return new PCSet();
		}
		if (typeof str !== "string") {
			throw new TypeError(
				`Invalid input type: ${typeof str}. Expected a string.`,
			);
		}
		if (str.length !== 12) {
			throw new RangeError(
				`Invalid string length: ${str.length}. Expected a string of length 12.`,
			);
		}
		return str.split("").reduce((acc, cur, i) => {
			if (cur === "1") {
				acc.push(i);
			}
			return acc;
		}, new PCSet());
	}

	/**
	 * Creates a PCSet from an array of pitch representations
	 * @param arr - Array of Notes, PitchClasses, strings, or numbers
	 * @returns A new PCSet
	 * @throws TypeError if input is not an array
	 */
	static fromArray(arr?: readonly unknown[]): PCSet {
		if (arr === undefined) {
			return new PCSet();
		}
		if (!Array.isArray(arr)) {
			throw new TypeError(`Invalid input type: ${typeof arr}. Expected an array.`);
		}
		const chromas = arr.map((cur) => getChroma(cur));
		return PCSet.create(chromas);
	}

	/**
	 * Flexible factory method to create a PCSet from various inputs
	 * @param args - Can be: PCSet, binary string, array, Note, PitchClass, or multiple arguments
	 * @returns A new PCSet
	 */
	static from(...args: unknown[]): PCSet {
		if (args.length === 1) {
			const [arg] = args;
			if (typeof arg === "string") {
				return PCSet.fromString(arg);
			}
			if (Array.isArray(arg)) {
				return PCSet.fromArray(arg);
			}
			if (arg instanceof PCSet) {
				return PCSet.create(arg);
			}
			if (arg instanceof Note || arg instanceof PitchClass) {
				return PCSet.create([arg.chroma]);
			}
			if (typeof arg === "number") {
				return PCSet.create([arg]);
			}
			throw new TypeError(
				`Cannot create PCSet from: ${arg}. Expected PCSet, string, array, Note, PitchClass, or number.`,
			);
		}
		if (args.length > 1) {
			return PCSet.fromArray(args);
		}
		return new PCSet();
	}

	/**
	 * Checks if two pitch class sets are Z-related (same interval vector but different prime forms)
	 * @param a - First pitch class set
	 * @param b - Second pitch class set
	 * @returns True if the sets are Z-related
	 */
	static isZRelated(a: PCSet | readonly number[], b: PCSet | readonly number[]): boolean {
		const pc1 = a instanceof PCSet ? a : PCSet.create([...a]);
		const pc2 = b instanceof PCSet ? b : PCSet.create([...b]);
		return pc1.intervalVector.every((v, i) => v === pc2.intervalVector[i]);
	}
}

/**
 * Helper function to find the most left-compact (smallest binary value) pitch class set
 * @param sets - Array of pitch class sets
 * @returns The most compact set
 */
function mostLeftCompact(sets: readonly PCSet[]): PCSet {
	if (sets.length === 0) {
		return new PCSet();
	}
	return sets.reduce((acc, cur) => {
		return acc.binary < cur.binary ? acc : cur;
	}, sets[0]);
}

/**
 * Helper function to extract chroma from various pitch representations
 * @param p - A Note, PitchClass, string, or number
 * @returns The chroma value (0-11)
 * @throws Error if the input cannot be converted to a chroma
 */
function getChroma(p: unknown): number {
	if (p instanceof Note || p instanceof PitchClass) {
		return p.chroma;
	}
	if (typeof p === "number") {
		if (isValidChroma(p)) {
			return p;
		}
		throw new RangeError(
			`Invalid chroma number: ${p}. Must be an integer between 0 and 11.`,
		);
	}
	if (typeof p === "string") {
		return getChromaFromString(p);
	}
	throw new TypeError(`Cannot extract chroma from: ${p}`);
}

/**
 * Helper function to get chroma from a string representation
 * @param str - A string that can be a number or pitch name
 * @returns The chroma value (0-11)
 * @throws Error if the string cannot be parsed
 */
function getChromaFromString(str: string): number {
	const parsed = Number(str);
	if (!Number.isNaN(parsed)) {
		if (isValidChroma(parsed)) {
			return parsed;
		}
		throw new RangeError(
			`Invalid chroma number: ${parsed}. Must be between 0 and 11.`,
		);
	}
	try {
		return PitchClass.fromName(str).chroma;
	} catch {
		try {
			const note = Note.fromName(str);
			return note instanceof Note ? note.chroma : note.chroma;
		} catch {
			throw new Error(
				`Invalid pitch class name: ${str}. Cannot parse as pitch class or note.`,
			);
		}
	}
}
