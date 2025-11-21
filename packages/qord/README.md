# Qord

A comprehensive TypeScript music theory library for modern web applications. Provides classes and utilities for pitch classes, notes, intervals, chords, and pitch class sets with full type safety.

## Features

- 🎵 **PitchClass**: Represents pitch classes (notes without octave)
- 🎼 **Note**: Full note representation with octave, MIDI, and frequency
- 📏 **Interval**: Musical intervals with quality and number
- 🎹 **Chord**: Chord analysis and generation with 150+ chord types
- 🔢 **PCSet**: Pitch class set theory operations
- 🔒 **Type-Safe**: Full TypeScript support with strict type checking
- ⚡ **Modern**: ES modules, tree-shakeable, optimized for performance
- 📦 **Zero Dependencies**: Lightweight and self-contained
- 🏗️ **Production-Ready**: Factory patterns, immutability, comprehensive validation

## Installation

```bash
npm install qord
# or
pnpm add qord
# or
yarn add qord
```

## Quick Start

```typescript
import { Note, PitchClass, Interval, Chord, PCSet } from 'qord';

// Create notes
const note = Note.from('C4');
console.log(note.frequency);   // 261.63 Hz
console.log(note.midiNumber);  // 60

// Work with pitch classes
const pc = PitchClass.from('C#');
console.log(pc.chroma);        // 1

// Calculate intervals
const interval = Interval.between('C4', 'E4');
console.log(interval.name);     // "M3"
console.log(interval.fullName); // "Major 3rd"

// Analyze chords
const results = Chord.guess(['C4', 'E4', 'G4']);
console.log(results[0].chord.name);     // "C major"
console.log(results[0].chord.symbols);  // ["C", "Cmaj", "CM"]

// Set theory operations
const pcset = PCSet.from([0, 4, 7]);
console.log(pcset.prime());           // [0, 3, 7]
console.log(pcset.intervalVector);    // [0, 0, 1, 1, 1, 0]
```

## Project Structure

```
src/lib/
├── core/                  # Core music theory classes
│   ├── pitch-class.ts    # Pitch class representation
│   ├── note.ts           # Note with octave/MIDI
│   ├── interval.ts       # Musical intervals
│   ├── pcset.ts          # Pitch class set theory
│   └── chord/
│       ├── chord.ts      # Chord analysis
│       └── data.ts       # 150+ chord types
├── utils/                 # Utility functions
│   ├── formatting.ts     # String formatting
│   ├── validation.ts     # Type guards
│   └── helpers.ts        # Generic utilities
├── constants.ts           # Type-safe constants
└── index.ts              # Main entry point
```

## API Documentation

### PitchClass

Represents a pitch class (note without octave information).

```typescript
// Creation methods
const pc1 = PitchClass.from('C#');           // from string
const pc2 = PitchClass.from(1);              // from chroma
const pc3 = PitchClass.create('D', 'b');     // from parts

// Properties
pc1.letter;         // "C"
pc1.accidental;     // "#"
pc1.name;           // "C#"
pc1.chroma;         // 1 (0-11)
pc1.step;           // 0 (C=0, D=1, ...)
pc1.alteration;     // 1 (# = +1, b = -1)

// Methods
pc1.enharmonicEquals(pc2);  // Compare by chroma
```

### Note

Extends PitchClass with octave information.

```typescript
// Creation methods
const note1 = Note.from('C4');
const note2 = Note.fromMidi(60);
const note3 = Note.create('C', '#', 4);

// Properties
note1.pc;           // "C"
note1.octave;       // 4
note1.name;         // "C4"
note1.midiNumber;   // 60
note1.frequency;    // 261.63 Hz
note1.height;       // 60 (semitones from C-1)

// Methods
note1.transpose(7); // Returns new Note (G4)
```

### Interval

Represents musical intervals with quality and number.

```typescript
// Creation methods
const int1 = Interval.from('M3');
const int2 = Interval.fromSemitones(4);
const int3 = Interval.between('C4', 'E4');

// Properties
int1.quality;       // "M" (Major)
int1.number;        // 3
int1.name;          // "M3"
int1.fullName;      // "Major 3rd"
int1.semitones;     // 4
int1.chroma;        // 4
int1.direction;     // 1 (ascending) or -1 (descending)

// Methods
int1.invert();      // Returns m6 (inversion of M3)
```

### Chord

Powerful chord analysis with extensive database.

```typescript
// Chord guessing
const results = Chord.guess(['C4', 'E4', 'G4', 'B4']);
const { chord, bass, inversion } = results[0];

chord.root;         // PitchClass("C")
chord.name;         // "C major seventh"
chord.symbols;      // ["Cmaj7", "CM7", "CΔ7", "CΔ"]
inversion;          // 0 (root position)
chord.pcset;        // PCSet([0, 4, 7, 11])

// Advanced guessing options
const options = {
  allowOmissions: true,     // Allow chords with missing notes
  allowInversions: true,    // Consider inversions
  allowSlash: true,         // Allow slash chords (e.g., C/G)
  assumeRoot: 'C',          // Force specific root
  impliedIntervals: ['P1', 'P5']  // Intervals that can be omitted
};

Chord.guess(notes, options);

// Access chord database
const type = ChordType.find('maj7');
type.intervals;     // ["P1", "M3", "P5", "M7"]
type.symbols;       // ["maj7", "M7", "Δ7", "Δ"]
type.name;          // "major seventh"
```

### PCSet (Pitch Class Set)

Set theory operations for musical analysis.

```typescript
// Creation methods
const set1 = PCSet.from([0, 4, 7]);              // from chromas
const set2 = PCSet.from('101010000000');         // binary string
const set3 = PCSet.from(['C', 'E', 'G']);        // from note names

// Properties
set1.binary;            // 145 (binary representation)
set1.intervalVector;    // [0, 0, 1, 1, 1, 0]

// Transformations (return new instances)
set1.transpose(2);      // [2, 6, 9]
set1.invert();          // [0, 8, 5]
set1.normal();          // [0, 4, 7] - most compact ordering
set1.prime();           // [0, 3, 7] - normalized inversion
set1.complement();      // [1, 2, 3, 5, 6, 8, 9, 10, 11]

// Analysis
PCSet.isZRelated(set1, set2);  // Check Z-relation
```

## Utilities

### Validation Type Guards

```typescript
import { 
  isValidLetter,
  isValidAccidental,
  isValidChroma,
  isValidMidiNumber,
  isValidOctave,
} from 'qord';

isValidLetter('C');         // true
isValidLetter('H');         // false
isValidChroma(11);          // true
isValidChroma(12);          // false
isValidMidiNumber(60);      // true
isValidMidiNumber(128);     // false
isValidOctave(4);           // true
isValidOctave(-2);          // false
```

### Formatting Utilities

```typescript
import { numberToOrdinal, capitalize } from 'qord';

numberToOrdinal(1);    // "1st"
numberToOrdinal(3);    // "3rd"
numberToOrdinal(11);   // "11th"
capitalize('hello');   // "Hello"
```

## Advanced Usage

### Coordinate System

Qord uses a coordinate system based on the circle of fifths:

```typescript
// Pitch classes use [fifths]
const pc = PitchClass.from('F#');
pc.coordinate;  // [6] - 6 steps clockwise on circle of fifths

// Notes use [fifths, octaves]
const note = Note.from('C4');
note.coordinate;  // [0, 0]

const g4 = Note.from('G4');
g4.coordinate;  // [1, 0] - 1 fifth up, same octave
```

### Chord Type Database

Access the complete chord database:

```typescript
import { CHORD_TYPE_DATABASE } from 'qord';

// Format: [intervals, full name, space-separated symbols]
// Example: 
// ["1P 3M 5P 7M", "major seventh", "maj7 M7 Δ7 Δ"]

// Database contains 150+ chord types including:
// - Triads (major, minor, diminished, augmented, sus)
// - Sevenths (maj7, 7, m7, dim7, etc.)
// - Extended (9ths, 11ths, 13ths)
// - Altered (b5, #5, b9, #9, #11, b13)
// - Add chords (add9, add11, etc.)
```

### Set Theory Analysis

```typescript
const set = PCSet.from([0, 1, 4, 6]);

// Normal form - most compact left-packed ordering
const normal = set.normal();
console.log(normal);  // [0, 1, 4, 6]

// Prime form - transposed normal form starting at 0
const prime = set.prime();
console.log(prime);   // [0, 2, 5, 6]

// Interval vector - distribution of interval classes
const iv = set.intervalVector;
console.log(iv);      // [2, 1, 1, 1, 1, 0]

// Complement - all pitch classes not in set
const complement = set.complement();
console.log(complement);  // [2, 3, 5, 7, 8, 9, 10, 11]
```

## Best Practices

1. **Use factory methods**: Prefer `Note.from()` over direct constructor calls
   ```typescript
   // ✅ Good
   const note = Note.from('C4');
   
   // ❌ Avoid (constructor is protected)
   // const note = new Note(...);
   ```

2. **Leverage TypeScript**: Full type safety catches errors at compile time
   ```typescript
   const note = Note.from('C4');
   note.frequency;  // TypeScript knows this is a number
   ```

3. **Immutability**: All transformations return new instances
   ```typescript
   const original = Note.from('C4');
   const transposed = original.transpose(7);  // New instance
   // original is unchanged
   ```

4. **Error handling**: Methods throw descriptive errors for invalid inputs
   ```typescript
   try {
     const note = Note.fromMidi(200);  // Out of range
   } catch (error) {
     console.error(error.message);  // Detailed error message
   }
   ```

5. **Performance**: Private fields provide encapsulation without getters
   ```typescript
   // Readonly private fields using # syntax
   note.midiNumber;  // Direct property access, no getter overhead
   ```

## Migration Guide

See [MIGRATION.md](./MIGRATION.md) for detailed migration instructions from the JavaScript version.

Quick summary:
- Import paths changed to organized structure (`core/`, `utils/`)
- Factory methods are now primary creation pattern
- All files use PascalCase for class names
- Enhanced type safety may catch previously undetected errors

```typescript
// Old (JavaScript)
import PitchClass from 'qord/class/pitch-class';

// New (TypeScript)
import { PitchClass } from 'qord';
```

## Development

```bash
# Install dependencies
pnpm install

# Type checking
pnpm run type-check

# Build library
pnpm run build

# Run tests (TODO)
pnpm run test

# Lint and format
pnpm run lint
```

## Architecture Highlights

- **Factory Pattern**: Flexible object creation with validation
- **Immutable Operations**: All transformations return new instances
- **Type-Safe**: Comprehensive TypeScript types throughout
- **Zero Dependencies**: Self-contained, minimal footprint
- **Tree-Shakeable**: Modern ES modules for optimal bundling
- **Lazy Loading**: Chord type tree built on-demand
- **Private Fields**: Encapsulation using # syntax
- **Comprehensive Validation**: Type guards for runtime safety

## License

MIT

## Credits

- Chord database sourced from [Music Theory Wikibook](https://en.wikibooks.org/wiki/Music_Theory/Complete_List_of_Chord_Patterns)
- Built with TypeScript, Vite, and SvelteKit

---

**Note**: This library is production-ready with comprehensive type safety, modern architecture, and best practices for music theory operations in web applications.
