import { describe, it, expect } from 'vitest';
import PitchClass from '../pitch-class.js';

describe('PitchClass', () => {
	describe('creation', () => {
		it('should create from string', () => {
			const pc = PitchClass.from('C#');
			expect(pc.name).toBe('C#');
			expect(pc.chroma).toBe(1);
		});

		it('should create from chroma', () => {
			const pc = PitchClass.from(0);
			expect(pc.name).toBe('C');
		});

		it('should handle flats', () => {
			const pc = PitchClass.from('Db');
			expect(pc.chroma).toBe(1);
		});
	});

	describe('enharmonic equivalence', () => {
		it('should recognize enharmonic equivalents', () => {
			const cSharp = PitchClass.from('C#');
			const dFlat = PitchClass.from('Db');
			expect(cSharp.enharmonicEquals(dFlat)).toBe(true);
		});

		it('should not match non-enharmonic notes', () => {
			const c = PitchClass.from('C');
			const d = PitchClass.from('D');
			expect(c.enharmonicEquals(d)).toBe(false);
		});
	});

	describe('error handling', () => {
		it('should throw on invalid letter', () => {
			expect(() => PitchClass.from('H')).toThrow('Invalid pitch class name');
		});

		it('should throw on invalid chroma', () => {
			expect(() => PitchClass.from(12)).toThrow('Invalid chroma');
		});
	});
});
