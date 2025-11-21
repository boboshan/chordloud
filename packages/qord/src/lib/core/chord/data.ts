/**
 * Chord Type Database
 * Comprehensive database of chord types with intervals and symbols
 * @module core/chord/data
 *
 * Source: https://en.wikibooks.org/wiki/Music_Theory/Complete_List_of_Chord_Patterns
 *
 * @remarks
 * Format: [intervals, full name, abbreviations]
 * - Wildcard intervals: * indicates possible omissions in voicing
 * - Abbreviations order: Long notation, Short notation, Symbolic notation, Alternative names
 */

/**
 * Complete database of chord types
 * Each entry contains: [interval pattern, full name, space-separated symbols]
 */
export const CHORD_TYPE_DATABASE: readonly (readonly [string, string, string])[] = [
	// ==Intervals==
	["P1", "perfect unison", "P1"],
	["P1 m2", "minor second", "m2"],
	["P1 M2", "major second", "M2"],
	["P1 m3", "minor third", "m3"],
	["P1 M3", "major third", "M3"],
	["P1 P4", "perfect fourth", "P4"],
	["P1 A4", "tritone", "T"],
	["P1 P5", "perfect fifth", "P5"],
	["P1 m6", "minor sixth", "m6"],
	["P1 M6", "major sixth", "M6"],
	["P1 m7", "minor seventh", "m7"],
	["P1 M7", "major seventh", "M7"],
	["P1 P8", "octave", "P8"],

	// ==Major==
	["1P 3M 5P", "major", "maj  M"],
	["1P 3M* 5P* 7M", "major seventh", "maj7 M7 Δ7 Δ"],
	["1P 3M 5P* 7M 9M", "major ninth", "maj9 M9 Δ9"],
	["1P 3M 5P* 7M 9M 11M", "major eleventh", "maj11 M11 Δ11"],
	["1P 3M 5P* 7M 9M 11M 13M", "major thirteenth", "maj13 M13 Δ13"],

	["1P 2M 3M", "major second", "majadd2 add2 2 Madd2"],
	["1P 2M 3M 5P", "major added ninth", "majadd9 Madd9 Madd9"],
	[
		"1P 2m 3M 5P",
		"major added flat ninth",
		"majaddb9 Maddb9 Maddb9 Maddb9 majaddb2 addb2 addb2 Maddb2",
	],
	[
		"1P 3M 4P 5P",
		"major added eleventh",
		"majadd11 Madd11 add11 Madd11 majadd4 add4 add4 Madd4",
	],
	[
		"1P 3M 4A 5P",
		"major added flat fifth",
		"majaddb5 Maddb5 addb5 Maddb5 majadd#11 Madd#11 add#11",
	],

	["1P 3M 5P 6M", "major sixth", "maj6 6 6 M6 add6 majadd13 Madd13 add13"],
	["1P 3M 5P* 6M 9M", "major sixth ninth", "maj6/9 6/9 69 6add9 M69"],
	[
		"1P 3M 5P* 6M 9M* 11P",
		"major sixth eleventh",
		"maj6/11 6/11 6/11 maj6/13 6/13 6/13",
	],
	[
		"1P 3M 5P* 6M 11A",
		"major sixth added sharp eleventh",
		"maj6#11 6#11 6#11 M6#11 6b5 M6b5 6#4",
	],
	[
		"1P 3M 5P* 6M 9M 11A",
		"sixth ninth added sharp eleventh",
		"maj6/9add#11 6/9#11 69#11",
	],

	["1P 3M 5P* 7M 11P", "major seventh added eleventh", "maj7add11 M711 Δ711 Δ11"],
	[
		"1P 3M 5P* 7M 11A",
		"major seventh added sharp eleventh",
		"maj7add#11 M7#11 Δ#11 maj7add#4 M7add#4 Δadd#4",
	],
	["1P 3M 5P* 7M 13M", "major seventh added thirteenth", "maj7add13 M713 Δ713"],
	[
		"1P 3M 5P* 7M 13m",
		"major seventh added flat thirteenth",
		"maj7addb13 M7b13 Δ7b13",
	],

	[
		"1P 3M 5P* 7M 9M 13M",
		"major ninth added thirteenth",
		"maj9add13 M913 Δ9add13",
	],
	[
		"1P 3M 5P* 7M 9M 13m",
		"major ninth added flat thirteenth",
		"maj9addb13 M9b13 Δ9addb13",
	],

	["1P 3M 5d", "major diminished fifth", "majb5 Mb5"],
	["1P 3M 5d 7M", "major seventh diminished fifth", "maj7b5 M7b5 Δ7b5 Δb5"],
	["1P 3M 5d 7M 9M", "major ninth diminished fifth", "maj9b5 M9b5 Δ9b5"],

	["1P 3M 5P* 7M 9m", "major seventh flat ninth", "maj7b9 M7b9 Δ7b9"],
	[
		"1P 3M 5P* 7M 9M 11A",
		"major ninth added sharp eleventh",
		"maj9#11 M9#11 Δ9#11",
	],
	[
		"1P 3M 5P* 7M 9A 11A",
		"major seventh added sharp ninth added sharp eleventh",
		"maj7#9#11 M7#9#11 Δ7#9#11 Δ#9#11",
	],
	[
		"1P 3M 5P* 7M 9M* 11A 13M",
		"major thirteenth sharp eleventh",
		"maj13#11 M13#11 Δ13#11 maj13#4 M13#4 Δ13#4",
	],

	// ==Minor==
	["1P 3m 5P", "minor", "min m -"],
	["1P 3m 5P 6M", "minor sixth", "min6 m6 -6"],
	["1P 3m 5P* 7m", "minor seventh", "min7 m7 -7"],
	["1P 3m 5P* 7m 9M", "minor ninth", "min9 m9 -9"],
	["1P 3m 5P* 7m 9M 11P", "minor eleventh", "min11 m11 -11"],
	["1P 3m 5P* 7m 9M 11P 13M", "minor thirteenth", "min13 m13 -13"],

	[
		"1P 3m 5P* 9M",
		"minor added ninth",
		"minadd9 madd9 -add9 minadd2 madd2 -add2",
	],
	["1P 3m 5P* 6M 9M", "minor sixth ninth", "min6/9 m6/9 -6/9 min69 m69 -69"],
	[
		"1P 3m 4P 5P",
		"minor added fourth",
		"minadd4 madd4 -add4 minadd11 madd11 -add11 sus4addb3",
	],
	[
		"1P 3m 5P* 7m 11P",
		"minor seventh added eleventh",
		"min7add11 m711 -711 min7add4 m7add4 -7add4",
	],
	[
		"1P 3m 5P* 7m 9M 13M",
		"minor ninth added thirteenth",
		"min9add13 m913 -913",
	],

	["1P 3m 5A 7m", "minor seventh augmented fifth", "min7#5 m7#5 -7#5"],
	["1P 3m 5A 7m 9M", "minor ninth augmented fifth", "min9#5 m9#5 -9#5"],
	[
		"1P 3m 5A 7m 9M* 11P",
		"minor eleventh augmented fifth",
		"min11#5 m11#5 -11#5",
	],
	[
		"1P 3m 5A 7m 9M* 11P* 13M",
		"minor thirteenth augmented fifth",
		"min13#5 m13#5 -13#5",
	],

	["1P 3m 5P* 7m 9m", "minor seventh flat ninth", "min7b9 m7b9 -7b9 minb9 mb9 -b9"],
	[
		"1P 3m 5P* 7m 11A",
		"minor seventh sharp eleventh",
		"min7#11 m7#11 -7#11",
	],

	// ==Minor/Major==
	[
		"1P 3m 5P* 7M",
		"minor/major seventh",
		"minmaj7 mM7 -Δ7 -Δ -M7 mΔ mΔ7 mMaj7 m/ma7 m/maj7 m/M7",
	],
	[
		"1P 3m 5P* 7M 9M",
		"minor/major ninth",
		"minmaj9 mM9 -Δ9 -M9 mΔ9 mMaj9 m/ma9 m/maj9 m/M9",
	],
	[
		"1P 3m 5P* 7M 9M 11P",
		"minor/major eleventh",
		"minmaj11 mM11 -Δ11 -M11 mΔ11 mMaj11 m/ma11 m/maj11 m/M11",
	],
	[
		"1P 3m 5P* 7M 9M 11P 13M",
		"minor/major thirteenth",
		"minmaj13 mM13 -Δ13 -M13 mΔ13 mMaj13 m/ma13 m/maj13 m/M13",
	],

	[
		"1P 3m 5A 7M",
		"minor/major seventh augmented fifth",
		"minmaj7#5 mM7#5 -Δ7#5",
	],
	[
		"1P 3m 5P* 7M 13m",
		"minor/major seventh added flat thirteenth",
		"minmaj7addb13 mM7b13 -Δ7b13 minmaj7addb6 mM7addb6 -Δ7addb6",
	],
	[
		"1P 3m 5P* 7M 9M 13m",
		"minor/major ninth added flat thirteenth",
		"minmaj9addb13 mM9b13 -Δ9b13 minmaj9addb6 mM9addb6 -Δ9addb6",
	],
	[
		"1P 3m 5P* 7M 9M* 11P 13m",
		"minor/major eleventh added flat thirteenth",
		"minmaj11b13 mM11b13 -Δ11b13 minmaj11addb6 mM11addb6 -Δ11addb6",
	],

	// ==Diminished==
	["1P 3m 5d", "diminished", "dim dim o °"],
	["1P 3m 5d 7d", "diminished seventh", "dim7 dim7 o7 °7"],
	[
		"1P 3m 5d 7M",
		"diminished major seventh",
		"dimmaj7 dimM7 oM7 minmaj7b5 mM7b5",
	],
	[
		"1P 3m 5d 7d 7M",
		"diminished seventh major seventh",
		"dim7maj7 dim7M7 o7M7 °7M7",
	],

	["1P 3m 5d 7m", "half-diminished", "min7b5 m7b5 ø ø7 -7b5 -7o5 min7dim5"],
	["1P 3m 5d 7m 9M", "half-diminished ninth", "min9b5 m9b5 ø9 -9b5 -9o5 min9dim5"],
	[
		"1P 3m 5d 7m 9m",
		"half-diminished flat ninth",
		"min7b5b9 m7b5b9 øb9 -b9b5 -b9o5 minb9dim5",
	],
	[
		"1P 3m 5d 7m 9M* 11P",
		"half-diminished eleventh",
		"min11b5 m11b5 ø11 -11b5 -11o5 min11dim5",
	],

	// ==Dominant==
	["1P 3M* 5P* 7m", "dominant seventh", "dom7 7 7 dom"],
	["1P 3M 5P* 7m 9M", "dominant ninth", "dom9 9 9"],
	["1P 3M 5P* 7m 9M* 11P", "dominant eleventh", "dom11 11 11"],
	["1P 3M 5P* 7m 9M* 11P* 13M", "dominant thirteenth", "dom13 13 13"],

	["1P 3M 5d 7m", "dominant seventh flat fifth", "dom7b5 7b5"],
	["1P 3M 5d 7m 9M", "dominant ninth flat fifth", "dom9b5 9b5"],

	[
		"1P 3M 5P* 7m 11P",
		"dominant seventh added eleventh",
		"dom7add11 711 711 dom7add4 7add4",
	],
	[
		"1P 3M 5P* 7m 11A",
		"dominant seventh sharp eleventh",
		"dom7add#11 7#11 7#11 dom7add#4 7add#4 7#4",
	],
	[
		"1P 3M 5P* 7m 13m",
		"dominant seventh added flat thirteenth",
		"dom7addb13 7b13 7b13 dom7addb6 7addb6 7b6",
	],
	[
		"1P 3M 5P* 7m 9M 11A",
		"dominant ninth added sharp eleventh",
		"dom9#11 9#11 9#11 dom9#4 9#4",
	],
	[
		"1P 3M 5P* 7m 9M 13m",
		"dominant ninth added flat thirteenth ",
		"dom9addb13 9b13 9b13 dom9addb6 9addb6 9b6",
	],

	["1P 3M 5P* 7m 9m", "dominant flat ninth", "dom7b9 7b9"],
	["1P 3M 5P* 7m 9A", "dominant sharp ninth", "dom7#9 7#9"],
	[
		"1P 3M 5P* 7m 9m 9A",
		"dominant flat ninth added sharp ninth ",
		"dom7b9#9 7b9#9 7b9#9 dom7b9add#9",
	],

	[
		"1P 3M 5P* 7m 9m 11A",
		"dominant flat ninth sharp eleventh",
		"dom7b9#11 7b9#11 7b9#11 7b5b9 7b9b5",
	],
	[
		"1P 3M 5P* 7m 9m 13m",
		"dominant flat ninth added flat thirteenth",
		"dom7b9b13 7b9b13",
	],
	[
		"1P 3M 5P* 7m 9m 11A 13m",
		"dominant flat ninth sharp eleventh flat thirteenth",
		"dom7b9#11b13 7b9#11b13 7#11b9b13 dom7#11b9b13 7b5b9b13",
	],
	[
		"1P 3M 5P* 7m 9A 11A",
		"dominant sharp ninth sharp eleventh",
		"dom7#9#11 7#9#11 7b5#9 7#9b5 dom7#9addb5",
	],
	[
		"1P 3M 5P* 7m 9A 13m",
		"dominant sharp ninth flat thirteenth",
		"dom7#9b13 7#9b13",
	],
	[
		"1P 3M 5P* 7m 11A 13m",
		"dominant seventh sharp eleventh flat thirteenth",
		"dom7#11b13 7#11b13 7#11b13 7b5b13",
	],
	[
		"1P 3M 5P* 7m 9M 11A 13m",
		"dominant ninth sharp eleventh flat thirteenth",
		"dom9#11b13 9#11b13 9#11b13 dom9add#11addb13 9b5b13",
	],

	["1P 3M 5P* 7m 9m 11P* 13M", "dominant thirteenth flat ninth", "dom13b9 13b9"],
	["1P 3M 5P* 7m 9A 11P* 13M", "dominant thirteenth sharp ninth", "dom13#9 13#9"],
	[
		"1P 3M 5P* 7m 9M 11A 13M",
		"dominant thirteenth sharp eleventh",
		"dom13#11 13#11 13#11 13#4",
	],
	[
		"1P 3M 5P* 7m 9m 11A 13M",
		"dominant thirteenth flat ninth sharp eleventh",
		"dom13b9#11 13b9#11",
	],
	[
		"1P 3M 5P* 7m 9A 11A 13M",
		"dominant thirteenth sharp ninth sharp eleventh",
		"dom13#9#11 13#9#11",
	],

	// ==Suspended==
	["1P 4P 5P", "suspended fourth", "sus4 sus4 sus4 sus"],
	["1P 2M 5P", "suspended second", "sus2 sus2 sus2"],
	[
		"1P 2M 4P 5P",
		"suspended second suspended fourth",
		"sus2sus4 sus24 sus24 sus4add9",
	],

	[
		"1P 2M 5P* 7M",
		"major seventh suspended second",
		"maj7sus2 M7sus2 Δ7sus2 maj9sus2 M9sus2 Δ9sus2",
	],
	[
		"1P 4P 5P* 7M",
		"major seventh suspended fourth",
		"maj7sus4 M7sus4 Δsus4 sus7 Δ7sus4 sus4add7",
	],
	[
		"1P 2M 5P* 7M 11P",
		"major ninth suspended fourth",
		"maj9sus4 M9sus4 Δ9sus4 maj11sus2 M11sus2 Δ11sus2",
	],

	[
		"1P 2M 5P* 7m",
		"dominant seventh suspended second",
		"dom7sus2 7sus2 7sus2 sus2dom7",
	],
	[
		"1P 4P 5P* 7m",
		"dominant seventh suspended fourth",
		"dom7sus4 7sus4 7sus4 7sus sus4dom7",
	],
	["1P 4P 5P* 7m 9M", "dominant ninth suspended fourth", "dom9sus4 9sus4 9sus4 9sus"],
	[
		"1P 4P 5P* 7m 9m",
		"dominant seventh suspended fourth flat ninth",
		"dom7sus4b9 7sus4b9 7sus4b9 7susb9 7b9sus4 7b9sus",
	],
	[
		"1P 4P 5P* 7m 9m 13m",
		"dominant seventh suspended fourth flat ninth added flat thirteenth",
		"dom7sus4b9b13 7sus4b9b13 7sus4b9b13 7b9b13sus4",
	],
	[
		"1P 3M 5P* 7m 9A 11A 13m",
		"dominant seventh added sharp ninth sharp eleventh flat thirteenth",
		"dom7#9#11b13 7#9#11b13",
	],
	[
		"1P 4P 5P* 7m 9M 13M",
		"dominant thirteenth suspended fourth",
		"dom13sus4 13sus4 13sus sus4dom13",
	],

	// ==Augmented==
	["1P 3M 5A", "augmented", "aug aug + +5 M#5"],

	["1P 3M 5A 7m", "augmented dominant seventh", "aug7 aug7 +7 7+ 7aug 7#5"],

	["1P 3M 5A 7M", "augmented major seventh", "augmaj7 augM7 +Δ7 maj7#5 M7#5 M7+5 +M7"],
	["1P 3M 5A 7M 9M", "augmented major ninth", "augmaj9 augM9 +Δ9 maj9#5 M9#5"],
] as const;
