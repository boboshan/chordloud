/**
 * Note Module
 * Represents a musical note with pitch class and octave information
 * @module core/Note
 */

import PitchClass from "./pitch-class.js";
import { calculateCoordinate, type Coordinate } from "../utils/helpers.js";
import {
	isValidLetter,
	isValidAccidental,
	isValidOctave,
	isValidMidiNumber,
} from "../utils/validation.js";

/**
 * Reference frequency for A4 in Hz
 */
const A4_FREQUENCY = 440;

/**
 * MIDI number for A4
 */
const A4_MIDI = 69;

/**
 * Represents a musical note with a specific octave
 */
export default class Note extends PitchClass {
	readonly #octave: number;

	/**
	 * Creates a new Note instance
	 * @param letter - The letter name (A-G)
	 * @param accidental - Optional accidental (#, b, x, n, or null)
	 * @param octave - The octave number (0-9)
	 */
	protected constructor(
		letter: string,
		accidental: string | null,
		octave: number,
	) {
		super(letter, accidental);
		this.#octave = octave;
	}

	/**
	 * Gets the pitch class name (letter + accidental without octave)
	 * @example
	 * ```typescript
	 * Note.from('C#4').pc; // 'C#'
	 * ```
	 */
	get pc(): string {
		return super.name;
	}

	/**
	 * Gets the octave number
	 * @example
	 * ```typescript
	 * Note.from('C4').octave; // 4
	 * ```
	 */
	get octave(): number {
		return this.#octave;
	}

	/**
	 * Gets the full note name including octave (e.g., "C#4", "Bb5")
	 * @example
	 * ```typescript
	 * Note.from('C4').name; // 'C4'
	 * ```
	 */
	get name(): string {
		return `${super.name}${this.#octave}`;
	}

	/**
	 * Gets the absolute height (distance in semitones from C-1)
	 * @example
	 * ```typescript
	 * Note.from('C-1').height; // 0
	 * Note.from('C4').height; // 60
	 * ```
	 */
	get height(): number {
		return this.chroma + (this.#octave + 1) * 12;
	}

	/**
	 * Gets the MIDI number (0-127) or null if out of range
	 * @example
	 * ```typescript
	 * Note.from('C4').midiNumber; // 60
	 * Note.from('A4').midiNumber; // 69
	 * ```
	 */
	get midiNumber(): number | null {
		return isValidMidiNumber(this.height) ? this.height : null;
	}

	/**
	 * Gets the frequency in Hz using equal temperament tuning (A4 = 440 Hz)
	 * @example
	 * ```typescript
	 * Note.from('A4').frequency; // 440
	 * ```
	 */
	get frequency(): number {
		return 2 ** ((this.height - A4_MIDI) / 12) * A4_FREQUENCY;
	}

	/**
	 * Gets the coordinate representation in pitch space [fifth, octave]
	 */
	get coordinate(): Coordinate {
		return calculateCoordinate(this.step, this.alteration)(this.#octave);
	}

	/**
	 * Creates a new Note with validation
	 * @param letter - The letter name (A-G)
	 * @param accidental - Optional accidental
	 * @param octave - The octave number (0-9)
	 * @returns A new Note instance
	 * @throws Error if any parameter is invalid
	 * @internal Use Note.from() for flexible creation
	 */
	static createNote(
		letter: string,
		accidental: string | null,
		octave: number,
	): Note {
		if (!isValidLetter(letter)) {
			throw new Error(
				`Invalid note letter: ${letter}. Must be A-G (case-insensitive).`,
			);
		}
		if (!isValidAccidental(accidental)) {
			throw new Error(
				`Invalid note accidental: ${accidental}. Must be #, b, x, n, or empty.`,
			);
		}
		if (!isValidOctave(octave)) {
			throw new RangeError(
				`Invalid note octave: ${octave}. Must be an integer between 0 and 9.`,
			);
		}

		return new Note(letter, accidental, octave);
	}

	/**
	 * Creates a Note from a MIDI number (0-127)
	 * @param midiNumber - The MIDI number
	 * @param useSharps - Whether to use sharps (true) or flats (false) for accidentals
	 * @returns A new Note instance
	 * @throws RangeError if MIDI number is invalid
	 */
	static fromMidi(midiNumber: number, useSharps = true): Note {
		if (!isValidMidiNumber(midiNumber)) {
			throw new RangeError(
				`Invalid MIDI number: ${midiNumber}. Must be an integer between 0 and 127.`,
			);
		}
		const chroma = midiNumber % 12;
		const octave = Math.floor(midiNumber / 12) - 1;
		const pc = PitchClass.fromChroma(chroma, useSharps);
		return new Note(pc.letter, pc.accidental, octave);
	}

	/**
	 * Creates a Note from a name string
	 * @param name - The note name (e.g., "C#4", "Bb5")
	 * @returns A new Note or PitchClass if no octave is present
	 * @throws Error if the name is invalid
	 */
	static fromName(name: string): Note | PitchClass {
		const octaveMatch = name.match(/\d/);
		if (!octaveMatch) {
			return PitchClass.fromName(name);
		}

		const octave = Number.parseInt(octaveMatch[0], 10);
		if (!isValidOctave(octave)) {
			throw new RangeError(
				`Invalid note octave in name: ${octave}. Must be 0-9.`,
			);
		}

		const pcName = name.replace(String(octave), "");
		const [letter, accidental] = PitchClass.parseName(pcName);
		return Note.createNote(letter, accidental, octave);
	}

	/**
	 * Flexible factory method to create a Note from various inputs
	 * @param args - Can be: Note instance, name string, MIDI number, (pc, octave), or (letter, accidental, octave)
	 * @returns A new Note instance
	 */
	static from(...args: unknown[]): Note | PitchClass {
		if (args.length === 1) {
			const [arg] = args;
			if (arg instanceof Note) {
				return arg;
			}
			if (typeof arg === "string") {
				return Note.fromName(arg);
			}
			if (typeof arg === "number") {
				return Note.fromMidi(arg);
			}
			throw new TypeError(
				`Cannot create Note from: ${arg}. Expected Note, string, or number.`,
			);
		}
		if (args.length === 2) {
			const [pc, octave] = args;
			if (typeof pc !== "string" || typeof octave !== "number") {
				throw new TypeError(
					`Invalid arguments. Expected (string, number), got (${typeof pc}, ${typeof octave}).`,
				);
			}
			const [letter, accidental] = PitchClass.parseName(pc);
			return Note.createNote(letter, accidental, octave);
		}
		if (args.length === 3) {
			const [letter, accidental, octave] = args;
			if (typeof letter !== "string") {
				throw new TypeError(`Letter must be a string, got: ${typeof letter}`);
			}
			if (
				accidental !== null &&
				accidental !== undefined &&
				typeof accidental !== "string"
			) {
				throw new TypeError(
					`Accidental must be a string, null, or undefined, got: ${typeof accidental}`,
				);
			}
			if (typeof octave !== "number") {
				throw new TypeError(`Octave must be a number, got: ${typeof octave}`);
			}
			return Note.createNote(
				letter,
				accidental as string | null,
				Number.parseInt(String(octave), 10),
			);
		}
		throw new Error("Invalid arguments for Note.from(). Expected 1-3 arguments.");
	}

	/**
	 * Returns a string representation of the note
	 */
	toString(): string {
		return this.name;
	}

	/**
	 * Transposes the note by a given number of semitones
	 * @param semitones - The number of semitones to transpose
	 * @returns A new Note instance
	 */
	transpose(semitones: number): Note {
		const newMidi = this.height + semitones;
		if (!isValidMidiNumber(newMidi)) {
			throw new RangeError(
				`Transposition results in invalid MIDI number: ${newMidi}. Must be 0-127.`,
			);
		}
		return Note.fromMidi(newMidi);
	}

	/**
	 * Converts to JSON-serializable object
	 */
	toJSON(): { type: 'Note'; letter: string; accidental: string | null; octave: number } {
		return {
			type: 'Note',
			letter: this.letter,
			accidental: this.accidental,
			octave: this.octave,
		};
	}

	/**
	 * Creates a Note from JSON
	 */
	static fromJSON(json: { letter: string; accidental: string | null; octave: number }): Note {
		return Note.createNote(json.letter, json.accidental, json.octave);
	}
}
