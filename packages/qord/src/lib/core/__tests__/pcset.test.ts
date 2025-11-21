import { describe, it, expect } from 'vitest';
import PCSet from '../pcset.js';

describe('PCSet', () => {
	describe('creation', () => {
		it('should create from array of chromas', () => {
			const set = PCSet.from([0, 4, 7]);
			expect(set).toHaveLength(3);
			expect(set).toEqual([0, 4, 7]);
		});

		it('should create from binary string', () => {
			const set = PCSet.from('101010010000');
			expect(set).toContain(0);
			expect(set).toContain(2);
			expect(set).toContain(4);
		});

		it('should create from note names', () => {
			const set = PCSet.from(['C', 'E', 'G']);
			expect(set).toContain(0);
			expect(set).toContain(4);
			expect(set).toContain(7);
		});
	});

	describe('normal form', () => {
		it('should compute normal form of major triad', () => {
			const set = PCSet.from([0, 4, 7]);
			const normal = set.normal();
			expect(normal).toEqual([0, 4, 7]);
		});

		it('should compute normal form with rotation', () => {
			const set = PCSet.from([7, 0, 4]);
			const normal = set.normal();
			expect(normal).toEqual([0, 4, 7]);
		});
	});

	describe('prime form', () => {
		it('should compute prime form', () => {
			const set = PCSet.from([0, 4, 7]);
			const prime = set.prime();
			expect(prime).toEqual([0, 3, 7]);
		});

		it('should be transposition invariant', () => {
			const set1 = PCSet.from([0, 4, 7]);
			const set2 = PCSet.from([2, 6, 9]);
			expect(set1.prime()).toEqual(set2.prime());
		});
	});

	describe('interval vector', () => {
		it('should compute interval vector for major triad', () => {
			const set = PCSet.from([0, 4, 7]);
			const iv = set.intervalVector;
			expect(iv).toHaveLength(6);
			expect(iv).toEqual([0, 0, 1, 1, 1, 0]);
		});

		it('should compute interval vector for diminished seventh', () => {
			const set = PCSet.from([0, 3, 6, 9]);
			const iv = set.intervalVector;
			// Four minor thirds (3 semitones) and two tritones (6 semitones)
			expect(iv).toEqual([0, 0, 4, 0, 0, 2]);
		});
	});

	describe('transformations', () => {
		it('should transpose', () => {
			const set = PCSet.from([0, 4, 7]);
			const transposed = set.transpose(2);
			expect(transposed).toEqual([2, 6, 9]);
		});

		it('should invert', () => {
			const set = PCSet.from([0, 4, 7]);
			const inverted = set.invert();
			expect(inverted).toContain(0);
		});

		it('should compute complement', () => {
			const set = PCSet.from([0, 1, 2]);
			const complement = set.complement();
			expect(complement).toHaveLength(9);
			expect(complement).not.toContain(0);
			expect(complement).not.toContain(1);
			expect(complement).not.toContain(2);
		});
	});

	describe('binary representation', () => {
		it('should compute binary for major triad', () => {
			const set = PCSet.from([0, 4, 7]);
			// Binary: bit 0 + bit 4 + bit 7 = 1 + 16 + 128 = 145
			expect(set.binary).toBe(0b010010001);
		});
	});

	describe('Z-relation', () => {
		it('should identify Z-related sets', () => {
			const set1 = PCSet.from([0, 1, 4, 6]);
			const set2 = PCSet.from([0, 1, 3, 7]);
			expect(PCSet.isZRelated(set1, set2)).toBe(true);
		});

		it('should identify non-Z-related sets', () => {
			const set1 = PCSet.from([0, 4, 7]);
			const set2 = PCSet.from([0, 3, 6]);
			expect(PCSet.isZRelated(set1, set2)).toBe(false);
		});
	});
});
