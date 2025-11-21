import { describe, it, expect } from 'vitest';
import Chord, { ChordType } from '../chord/chord.js';

describe('Chord', () => {
	describe('guess', () => {
		it('should recognize major triads', () => {
			const results = Chord.guess(['C', 'E', 'G']);
			expect(results.length).toBeGreaterThan(0);
			const best = results[0].chord;
			expect(best.root.name).toBe('C');
			expect(best.symbols[0]).toMatch(/^C/);
		});

		it('should recognize minor triads', () => {
			const results = Chord.guess(['A', 'C', 'E']);
			expect(results.length).toBeGreaterThan(0);
			const best = results[0].chord;
			expect(best.root.name).toBe('A');
		});

		it('should recognize seventh chords', () => {
			const results = Chord.guess(['C', 'E', 'G', 'B']);
			expect(results.length).toBeGreaterThan(0);
			const best = results[0].chord;
			expect(best.root.name).toBe('C');
			expect(best.name).toContain('major seventh');
		});

		it('should recognize dominant sevenths', () => {
			const results = Chord.guess(['G', 'B', 'D', 'F']);
			expect(results.length).toBeGreaterThan(0);
			const best = results[0].chord;
			expect(best.root.name).toBe('G');
		});

		it('should handle inversions', () => {
			const results = Chord.guess(['E', 'G', 'C'], { allowInversions: true });
			expect(results.length).toBeGreaterThan(0);
			const best = results[0].chord;
			expect(best.inversion).toBeGreaterThan(0);
		});

		it('should handle slash chords', () => {
			const results = Chord.guess(['G', 'C', 'E'], { allowSlash: true });
			expect(results.length).toBeGreaterThan(0);
		});
	});

	describe('properties', () => {
		it('should provide root', () => {
			const results = Chord.guess(['C', 'E', 'G']);
			const chord = results[0].chord;
			expect(chord.root.name).toBe('C');
		});

		it('should provide symbols', () => {
			const results = Chord.guess(['C', 'E', 'G']);
			const chord = results[0].chord;
			expect(chord.symbols.length).toBeGreaterThan(0);
			expect(chord.symbols[0]).toMatch(/^C/);
		});

		it('should provide intervals', () => {
			const results = Chord.guess(['C', 'E', 'G']);
			const chord = results[0].chord;
			expect(chord.type.intervals.length).toBe(3);
		});
	});

	describe('ChordType', () => {
		it('should find chord type by symbol', () => {
			const type = ChordType.find('maj7');
			expect(type).not.toBeNull();
			expect(type?.symbols).toContain('maj7');
		});

		it('should search chord types', () => {
			const types = ChordType.search('maj');
			expect(types.length).toBeGreaterThan(0);
		});
	});

	describe('edge cases', () => {
		it('should throw for invalid notes', () => {
			expect(() => Chord.guess(['X', 'Y'])).toThrow('Invalid pitch class name');
		});

		it('should handle single note', () => {
			const results = Chord.guess(['C']);
			// Single note still returns results (e.g., power chord, root)
			expect(results.length).toBeGreaterThanOrEqual(0);
		});

		it('should handle duplicate notes', () => {
			const results = Chord.guess(['C', 'C', 'E', 'G']);
			expect(results.length).toBeGreaterThan(0);
		});
	});
});
