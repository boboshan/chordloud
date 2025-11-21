import { describe, it, expect } from 'vitest';
import Interval from '../interval.js';

describe('Interval', () => {
	describe('creation', () => {
		it('should create from interval name', () => {
			const interval = Interval.from('M3');
			expect(interval.name).toBe('M3');
			expect(interval.quality).toBe('M');
			expect(interval.number).toBe(3);
			expect(interval.semitones).toBe(4);
		});

		it('should create from semitones', () => {
			const interval = Interval.fromSemitones(5);
			expect(interval.semitones).toBe(5);
			expect(interval.name).toBe('P4');
		});

		it('should create from two notes', () => {
			const interval = Interval.between('C4', 'E4');
			expect(interval.name).toBe('M3');
			expect(interval.semitones).toBe(4);
		});
	});

	describe('properties', () => {
		it('should identify perfect intervals', () => {
			const p5 = Interval.from('P5');
			expect(p5.quality).toBe('P');
			expect(p5.semitones).toBe(7);
		});

		it('should identify major intervals', () => {
			const m3 = Interval.from('M3');
			expect(m3.quality).toBe('M');
			expect(m3.semitones).toBe(4);
		});

		it('should identify minor intervals', () => {
			const m3 = Interval.from('m3');
			expect(m3.quality).toBe('m');
			expect(m3.semitones).toBe(3);
		});

		it('should identify augmented intervals', () => {
			const a4 = Interval.from('A4');
			expect(a4.quality).toBe('A');
			expect(a4.semitones).toBe(6);
		});

		it('should identify diminished intervals', () => {
			const d5 = Interval.from('d5');
			expect(d5.quality).toBe('d');
			expect(d5.semitones).toBe(6);
		});
	});

	describe('inversion', () => {
		it('should invert M3 to m6', () => {
			const m3 = Interval.from('M3');
			const inv = m3.invert();
			expect(inv.name).toBe('m6');
		});

		it('should invert P5 to P4', () => {
			const p5 = Interval.from('P5');
			const inv = p5.invert();
			expect(inv.name).toBe('P4');
		});

		it('should invert m7 to M2', () => {
			const m7 = Interval.from('m7');
			const inv = m7.invert();
			expect(inv.name).toBe('M2');
		});
	});

	describe('fullName', () => {
		it('should generate correct full names', () => {
			expect(Interval.from('M3').fullName).toBe('Major 3rd');
			expect(Interval.from('P5').fullName).toBe('Perfect 5th');
			expect(Interval.from('m7').fullName).toBe('Minor 7th');
			expect(Interval.from('A4').fullName).toBe('Augmented 4th');
			expect(Interval.from('d5').fullName).toBe('Diminished 5th');
		});
	});

	describe('error handling', () => {
		it('should throw on invalid interval name', () => {
			expect(() => Interval.from('X3')).toThrow();
		});
	});
});
