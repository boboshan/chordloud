/**
 * Chord Module
 * Represents musical chords with root, type, and bass notes
 * @module core/chord/Chord
 */

import Note from "../note.js";
import PitchClass from "../pitch-class.js";
import PCSet from "../pcset.js";
import Interval from "../interval.js";
import { CHORD_TYPE_DATABASE } from "./data.js";
import { generateRotations } from "../../utils/helpers.js";
import { CHORD_TYPE_REGEX } from "../../constants.js";

const DETECT_INVERSION_SCORE = 0.5;
const DETECT_OMISSION_SCORE = 0.75;

/**
 * Options for chord guessing algorithm
 */
export interface GuessOptions {
	/** Allow chords with omitted notes */
	allowOmissions?: boolean;
	/** Allow inverted chords */
	allowInversions?: boolean;
	/** Allow slash chords (different bass note) */
	allowSlash?: boolean;
}

/**
 * Result of chord guessing with confidence weight
 */
export interface ChordGuessResult {
	chord: Chord;
	weight: number;
}

/**
 * Represents a musical chord
 */
export default class Chord {
	readonly #root: PitchClass;
	readonly #type: ChordType;
	readonly #bass: PitchClass;

	constructor(root: PitchClass, type: ChordType, bass: PitchClass | null = null) {
		this.#root = root;
		this.#type = type;
		this.#bass = bass ?? root;
	}

	/**
	 * Gets the root pitch class of the chord
	 */
	get root(): PitchClass {
		return this.#root;
	}

	/**
	 * Gets the chord type
	 */
	get type(): ChordType {
		return this.#type;
	}

	/**
	 * Gets the bass note (null if same as root)
	 */
	get bass(): PitchClass | null {
		if (this.#bass.chroma === this.root.chroma) {
			return null;
		}
		return this.#bass;
	}

	/**
	 * Gets the pitch class set of the chord
	 */
	get pcset(): PCSet {
		return this.type.pcset;
	}

	/**
	 * Gets the inversion number (0 = root position, null if bass not in chord)
	 */
	get inversion(): number | null {
		const { root, type, bass } = this;
		const bassNote = bass ?? root;
		const inversion = type.pcset.transpose(root.chroma).indexOf(bassNote.chroma);
		return inversion === -1 ? null : inversion;
	}

	/**
	 * Gets the omitted intervals (if any)
	 */
	get omission(): readonly Interval[] | null {
		return this.type instanceof ChordTypeNode ? this.type.omission : null;
	}

	/**
	 * Gets the full chord name (e.g., "Cmaj7", "G7/B")
	 */
	get name(): string {
		const root = this.root.name;
		const type = this.type.name ?? this.type.symbols[0];
		const bass = this.bass ? this.bass.name : "";
		return `${root}${type ? " " : ""}${type}${bass ? " over " : ""}${bass}`;
	}

	/**
	 * Gets all possible symbol representations of the chord
	 */
	get symbols(): string[] {
		const root = this.root.name;
		const symbols = this.type.symbols;
		const bass = this.bass ? this.bass.name : "";
		return symbols.map((s) => `${root}${s ? " " : ""}${s}${bass ? " / " : ""}${bass}`);
	}

	/**
	 * Checks if this chord equals another chord
	 */
	equalTo(chord: Chord): boolean {
		const { root, type, bass } = chord;
		return (
			this.root.chroma === root.chroma &&
			this.type === type &&
			(this.bass?.chroma ?? this.root.chroma) === (bass?.chroma ?? root.chroma)
		);
	}

	/**
	 * Guesses possible chords from a collection of notes
	 * @param noteArr - Array of notes or note names
	 * @param options - Options for the guessing algorithm
	 * @returns Array of chord guesses sorted by confidence (highest first)
	 */
	static guess(
		noteArr: readonly (Note | string | number)[],
		options?: GuessOptions,
	): ChordGuessResult[] {
		const notes = noteArr
			.map((n) => {
				if (n instanceof Note) return n;
				// If string without octave, add default octave 4
				if (typeof n === 'string' && !/\d/.test(n)) {
					return Note.from(n + '4');
				}
				return Note.from(n);
			})
			.filter((note): note is Note => note instanceof Note)
			.filter(
				(note, index, self) =>
					!self.slice(0, index).some((other) => other.chroma === note.chroma),
			);
		return guessChord(notes, options);
	}

	/**
	 * Tokenizes a chord symbol into parts
	 * @param symbol - The chord symbol to tokenize
	 * @returns Array of tokens
	 */
	static tokenizeSymbol(symbol: string): string[] {
		let remains = symbol;
		const tokens: string[] = [];

		if (
			remains.startsWith("o") ||
			remains.startsWith("ø") ||
			remains.startsWith("add")
		) {
			tokens.push("");
		}

		while (remains.length) {
			const match = remains.match(CHORD_TYPE_REGEX);

			if (match?.[1]?.length) {
				tokens.push(match[1]);
				remains = remains.slice(match[1].length);
			} else {
				tokens.push(remains[0]);
				remains = remains.slice(1);
			}
		}

		return tokens;
	}

	/**
	 * Returns a string representation of the chord
	 */
	toString(): string {
		return this.symbols[0] ?? this.name;
	}

	/**
	 * Converts to JSON-serializable object
	 */
	toJSON(): {
		type: 'Chord';
		root: ReturnType<PitchClass['toJSON']>;
		intervals: ReturnType<Interval['toJSON']>[];
		bass: ReturnType<PitchClass['toJSON']> | null;
	} {
		return {
			type: 'Chord',
			root: this.root.toJSON(),
			intervals: this.type.intervals.map((i) => i.toJSON()),
			bass: this.bass ? this.bass.toJSON() : null,
		};
	}

	/**
	 * Creates a Chord from JSON
	 */
	static fromJSON(json: {
		root: ReturnType<PitchClass['toJSON']>;
		intervals: ReturnType<Interval['toJSON']>[];
		bass: ReturnType<PitchClass['toJSON']> | null;
	}): Chord {
		const root = PitchClass.fromJSON(json.root);
		const intervals = json.intervals.map((i) => Interval.fromJSON(i));
		const bass = json.bass ? PitchClass.fromJSON(json.bass) : null;

		// Try to find existing chord type to preserve name/symbols
		const pcset = PCSet.from(intervals.map((i) => i.chroma));
		const knownType = ChordType.find(pcset.binary);

		let type: ChordType;
		// If we found a type and it has the same number of intervals, use it
		// (This is a heuristic; exact interval matching would be better but binary check is robust for pitch classes)
		if (knownType && knownType.intervals.length === intervals.length) {
			type = knownType;
		} else {
			type = new ChordType(intervals);
		}

		return new Chord(root, type, bass);
	}
}

/**
 * Represents a chord type with intervals and symbols
 */
export class ChordType {
	readonly #intervals: readonly Interval[];
	readonly #name: string | null;
	readonly #symbols: readonly string[];

	constructor(
		intervals: readonly Interval[],
		name: string | null = null,
		symbols: readonly string[] | null = null,
	) {
		this.#intervals = intervals;
		this.#name = name;
		this.#symbols = symbols ?? [];
	}

	/**
	 * Gets the intervals that define this chord type
	 */
	get intervals(): readonly Interval[] {
		return this.#intervals;
	}

	/**
	 * Gets the full name of the chord type
	 */
	get name(): string | null {
		return this.#name;
	}

	/**
	 * Gets the symbol representations of the chord type
	 */
	get symbols(): readonly string[] {
		return this.#symbols;
	}

	/**
	 * Gets the pitch class set representation
	 */
	get pcset(): PCSet {
		return PCSet.from(this.intervals.map((i) => i.chroma));
	}

	/**
	 * Gets the chord type tree (lazy loaded)
	 */
	static tree(): ChordTypeTree {
		return useTree();
	}

	/**
	 * Searches for chord types matching a key
	 * @param key - The search key (name, symbol, or binary)
	 * @returns Array of matching chord types
	 */
	static search(key: string | number): ChordTypeNode[] {
		const tree = useTree();
		return tree.search(key);
	}

	/**
	 * Finds a chord type by key
	 * @param key - The search key
	 * @param allowOmissions - Whether to allow chords with omissions
	 * @returns The chord type or null if not found
	 */
	static find(key: string | number, allowOmissions = true): ChordTypeNode | null {
		const tree = useTree();
		return tree.find(key, allowOmissions);
	}
}

/**
 * Node in the chord type tree
 */
export class ChordTypeNode extends ChordType {
	readonly intervalToNext: number;
	readonly children: Map<number, ChordTypeNode>;
	readonly omission: readonly Interval[] | null;

	constructor(params: {
		intervals: readonly Interval[];
		name?: string | null;
		symbols?: readonly string[] | null;
		intervalToNext: number;
		omission?: readonly Interval[] | null;
	}) {
		super(params.intervals, params.name ?? null, params.symbols ?? null);
		this.intervalToNext = params.intervalToNext;
		this.children = new Map();
		this.omission = params.omission ?? null;
	}

	/**
	 * Gets the binary representation of this chord type
	 */
	get binary(): number {
		return this.pcset.binary;
	}

	/**
	 * Adds a child node
	 */
	addChild(node: ChordTypeNode): void {
		this.children.set(node.intervalToNext, node);
	}
}

/**
 * Tree data structure for efficient chord type lookup
 */
export class ChordTypeTree {
	#root: ChordTypeNode;
	#intervalMap: Map<string, ChordTypeNode>;
	#nameMap: Map<string, ChordTypeNode>;
	#symbolMap: Map<string, ChordTypeNode>;
	#binaryMap: Map<number, ChordTypeNode>;

	constructor(rootNode: ChordTypeNode) {
		this.#root = rootNode;
		this.#intervalMap = new Map();
		this.#nameMap = new Map();
		this.#symbolMap = new Map();
		this.#binaryMap = new Map();
	}

	get root(): ChordTypeNode {
		return this.#root;
	}

	set root(value: ChordTypeNode) {
		this.#root = value;
	}

	get intervalMap(): Map<string, ChordTypeNode> {
		return this.#intervalMap;
	}

	set intervalMap(value: Map<string, ChordTypeNode>) {
		this.#intervalMap = value;
	}

	get nameMap(): Map<string, ChordTypeNode> {
		return this.#nameMap;
	}

	set nameMap(value: Map<string, ChordTypeNode>) {
		this.#nameMap = value;
	}

	get symbolMap(): Map<string, ChordTypeNode> {
		return this.#symbolMap;
	}

	set symbolMap(value: Map<string, ChordTypeNode>) {
		this.#symbolMap = value;
	}

	get binaryMap(): Map<number, ChordTypeNode> {
		return this.#binaryMap;
	}

	set binaryMap(value: Map<number, ChordTypeNode>) {
		this.#binaryMap = value;
	}

	/**
	 * Searches for chord types matching a key
	 */
	search(key: string | number): ChordTypeNode[] {
		const queue: ChordTypeNode[] = [this.#root];
		const results: ChordTypeNode[] = [];

		while (queue.length > 0) {
			const node = queue.shift()!;
			if (
				node.name === key ||
				node.binary === key ||
				node.symbols?.includes(String(key))
			) {
				results.push(node);
			}
			queue.push(...node.children.values());
		}
		return results;
	}

	/**
	 * Finds a chord type by symbol
	 */
	findBySymbol(symbol: string): ChordTypeNode | null {
		return this.symbolMap.get(symbol) ?? null;
	}

	/**
	 * Finds a chord type by binary representation
	 */
	findByBinary(binary: number): ChordTypeNode | null {
		return this.binaryMap.get(binary) ?? null;
	}

	/**
	 * Finds a chord type by name
	 */
	findByName(name: string): ChordTypeNode | null {
		return this.nameMap.get(name) ?? null;
	}

	/**
	 * Finds a chord type by any key
	 */
	find(key: string | number, allowOmissions = true): ChordTypeNode | null {
		const byIntervals = this.findByIntervals(String(key), allowOmissions);
		if (byIntervals) return byIntervals;

		if (typeof key === "string") {
			return this.findBySymbol(key) ?? this.findByName(key) ?? null;
		}
		if (typeof key === "number") {
			return this.findByBinary(key);
		}
		return null;
	}

	/**
	 * Finds a chord type by interval string
	 */
	findByIntervals(intervalString: string, allowOmissions = true): ChordTypeNode | null {
		const chord = this.intervalMap.get(intervalString) ?? null;
		if (chord && (allowOmissions || !chord.omission)) {
			return chord;
		}
		return null;
	}
}

/**
 * Generates all combinations of intervals with optional notes
 */
function generateCombinations(
	arr: readonly string[],
): Array<{ omit: string[]; intervals: string[] }> {
	const mandatory: string[] = [];
	const optional: string[] = [];
	const combinations: Array<{ omit: string[]; intervals: string[] }> = [];

	for (const i of arr) {
		if (i.includes("*")) {
			optional.push(i.replace("*", ""));
		} else {
			mandatory.push(i);
		}
	}

	const generate = (prefix: Set<string>, i: number): void => {
		if (i === optional.length) {
			combinations.push({
				omit: optional.filter((x) => !prefix.has(x)),
				intervals: mandatory.concat(Array.from(prefix)),
			});
			return;
		}
		generate(new Set(prefix), i + 1);
		prefix.add(optional[i]);
		generate(prefix, i + 1);
	};

	generate(new Set(), 0);
	return combinations;
}

let tree: ChordTypeTree | null = null;

/**
 * Builds the chord type tree from the database
 */
function buildTree(data: typeof CHORD_TYPE_DATABASE): ChordTypeTree {
	const root = new ChordTypeNode({
		intervals: [],
		name: "root",
		symbols: [],
		intervalToNext: 0,
	});

	const newTree = new ChordTypeTree(root);

	for (const [intervalString, name, symbolString] of data) {
		const combinations = generateCombinations(intervalString.split(" "));
		const symbols = symbolString.split(" ");

		for (const { omit, intervals } of combinations) {
			const sortedIntervals = intervals
				.map((i) => Interval.from(i))
				.sort((a, b) => a.semitones - b.semitones);

			const sortedOmissions =
				omit.length > 0
					? omit
							.map((i) => Interval.from(i))
							.sort((a, b) => a.semitones - b.semitones)
					: null;

			let currentNode = newTree.root;

			for (let i = 0; i < sortedIntervals.length; i++) {
				const interval = sortedIntervals[i];
				const isLast = i === sortedIntervals.length - 1;
				const intervalToNext = interval.semitones;

				let childNode = currentNode.children.get(intervalToNext);

				if (!childNode) {
					if (isLast) {
						childNode = new ChordTypeNode({
							intervals: sortedIntervals,
							name,
							symbols,
							intervalToNext,
							omission: sortedOmissions,
						});

						newTree.intervalMap.set(
							sortedIntervals.map((i) => i.semitones).join(","),
							childNode,
						);

						newTree.nameMap.set(name, childNode);
						newTree.binaryMap.set(childNode.binary, childNode);

						for (const symbol of symbols) {
							newTree.symbolMap.set(symbol, childNode);
						}
					} else {
						childNode = new ChordTypeNode({
							intervals: sortedIntervals.slice(0, i + 1),
							intervalToNext,
						});
					}
					currentNode.addChild(childNode);
				}
				currentNode = childNode;
			}
		}
	}
	return newTree;
}

/**
 * Gets or builds the chord type tree (singleton)
 */
function useTree(): ChordTypeTree {
	if (!tree) {
		tree = buildTree(CHORD_TYPE_DATABASE);
	}
	return tree;
}

/**
 * Chord guessing algorithm
 */
function guessChord(
	notes: readonly Note[],
	options: GuessOptions = {},
): ChordGuessResult[] {
	const {
		allowOmissions = true,
		allowInversions = true,
		allowSlash = true,
	} = options;

	const bass = notes[0];
	const found: ChordGuessResult[] = [];
	const rotations = generateRotations(notes);

	const processRotations = (rotations: readonly (readonly Note[])[]): void => {
		for (const rotation of rotations) {
			const root = rotation[0];
			const zeroedSet = PCSet.fromArray(rotation).zero();
			const type = ChordType.find(zeroedSet.binary);

			if (type) {
				if (!allowSlash && root.chroma !== bass.chroma) continue;
				// Convert Note to PitchClass for chord construction
				const rootPc = PitchClass.from(root.chroma);
				const bassPc = PitchClass.from(bass.chroma);
				const chord = new Chord(rootPc, type, bassPc);
				const inversion = chord.inversion ?? 0;
				if (!allowInversions && inversion > 0) continue;
				const hasOmission = type.omission !== null;
				if (!allowOmissions && hasOmission) continue;

				const weight1 = allowOmissions && hasOmission ? DETECT_OMISSION_SCORE : 1;
				const weight2 = chord.bass ? DETECT_INVERSION_SCORE : 1;
				const isExisting = found.find((f) => f.chord.equalTo(chord));

				if (!isExisting) {
					found.push({ chord, weight: weight1 * weight2 });
				}
			}
		}
	};

	processRotations(rotations);

	if (notes.length > 3) {
		const remain = notes.slice(1);
		const remainRotations = generateRotations(remain);
		processRotations(remainRotations);
	}

	return found.sort((a, b) => b.weight - a.weight);
}
