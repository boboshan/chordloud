/**
 * Key Module
 * Represents a musical key with signature and relationships
 * @module core/Key
 */

import PitchClass from "./pitch-class.js";
import Scale from "./scale.js";

/**
 * Key modes (Major or Minor)
 */
export type KeyMode = "major" | "minor";

/**
 * Represents a musical key
 */
export default class Key {
	readonly #root: PitchClass;
	readonly #mode: KeyMode;

	/**
	 * Creates a new Key instance
	 * @param root - The root pitch class
	 * @param mode - The mode (major or minor)
	 */
	constructor(root: PitchClass, mode: KeyMode = "major") {
		this.#root = root;
		this.#mode = mode;
	}

	/**
	 * Gets the root pitch class
	 */
	get root(): PitchClass {
		return this.#root;
	}

	/**
	 * Gets the mode
	 */
	get mode(): KeyMode {
		return this.#mode;
	}

	/**
	 * Gets the key name (e.g., "C major", "A minor")
	 */
	get name(): string {
		return `${this.#root.name} ${this.#mode}`;
	}

	/**
	 * Gets the corresponding scale
	 */
	get scale(): Scale {
		return Scale.from(this.#root, this.#mode);
	}

	/**
	 * Gets the number of accidentals in the key signature
	 * Positive for sharps, negative for flats
	 */
	get signature(): number {
		// Circle of fifths calculation
		// C=0, G=1, D=2, A=3, E=4, B=5, F#=6, C#=7
		// F=-1, Bb=-2, Eb=-3, Ab=-4, Db=-5, Gb=-6, Cb=-7
		
		// Convert to major relative if minor
		let root = this.#root;
		if (this.#mode === "minor") {
			// Relative major is minor third up (3 semitones)
			root = PitchClass.fromChroma((root.chroma + 3) % 12);
		}

		// Map of major keys to signature count
		const signatures: Record<string, number> = {
			"C": 0,
			"G": 1, "D": 2, "A": 3, "E": 4, "B": 5, "F#": 6, "C#": 7,
			"F": -1, "Bb": -2, "Eb": -3, "Ab": -4, "Db": -5, "Gb": -6, "Cb": -7
		};

		// Handle enharmonic equivalents if not found directly
		if (root.name in signatures) {
			return signatures[root.name];
		}
		
		// Try enharmonic
		// e.g. D# major is not standard (9 sharps), usually Eb major (3 flats)
		// But if user asks for D# major, we should probably return theoretical signature or convert?
		// For now, let's try to find enharmonic equivalent in the map
		for (const [key, sig] of Object.entries(signatures)) {
			if (PitchClass.from(key).chroma === root.chroma) {
				return sig;
			}
		}
		
		return 0; // Fallback
	}

	/**
	 * Gets the relative key
	 */
	get relative(): Key {
		if (this.#mode === "major") {
			const newRoot = PitchClass.fromChroma((this.#root.chroma + 9) % 12);
			return new Key(newRoot, "minor");
		} else {
			const newRoot = PitchClass.fromChroma((this.#root.chroma + 3) % 12);
			return new Key(newRoot, "major");
		}
	}

	/**
	 * Gets the parallel key
	 */
	get parallel(): Key {
		return new Key(this.#root, this.#mode === "major" ? "minor" : "major");
	}

	/**
	 * Creates a Key from a name string
	 * @param name - The key name (e.g., "C major", "Am")
	 */
	static fromName(name: string): Key {
		const parts = name.split(" ");
		let rootStr = parts[0];
		let modeStr = parts[1] || "major";

		// Handle "Am", "Cmaj" notation
		if (rootStr.endsWith("m") && !rootStr.endsWith("dim")) {
			rootStr = rootStr.slice(0, -1);
			modeStr = "minor";
		} else if (rootStr.endsWith("maj")) {
			rootStr = rootStr.slice(0, -3);
			modeStr = "major";
		}

		const root = PitchClass.from(rootStr);
		const mode = modeStr.toLowerCase().includes("minor") ? "minor" : "major";
		
		return new Key(root, mode);
	}
}
