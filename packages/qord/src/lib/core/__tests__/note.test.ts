import { describe, it, expect } from 'vitest';
import Note from '../note.js';
import PitchClass from '../pitch-class.js';

describe('Note', () => {
	describe('creation', () => {
		it('should create from string with octave', () => {
			const note = Note.from('C4') as Note;
			expect(note).toBeInstanceOf(Note);
			expect(note.name).toBe('C4');
			expect(note.octave).toBe(4);
			expect(note.pc).toBe('C');
		});

		it('should create from MIDI number', () => {
			const note = Note.fromMidi(60);
			expect(note.name).toBe('C4');
			expect(note.midiNumber).toBe(60);
		});

		it('should create from parts', () => {
			const note = Note.createNote('A', '#', 4);
			expect(note.name).toBe('A#4');
		});

		it('should return PitchClass when no octave', () => {
			const result = Note.from('C');
			expect(result).toBeInstanceOf(PitchClass);
			expect(result).not.toBeInstanceOf(Note);
		});
	});

	describe('properties', () => {
		it('should calculate MIDI number correctly', () => {
			expect((Note.from('C4') as Note).midiNumber).toBe(60);
			expect((Note.from('A4') as Note).midiNumber).toBe(69);
			expect((Note.from('C0') as Note).midiNumber).toBe(12);
		});

		it('should calculate frequency correctly', () => {
			const a4 = Note.from('A4') as Note;
			expect(a4.frequency).toBeCloseTo(440, 2);
			
			const c4 = Note.from('C4') as Note;
			expect(c4.frequency).toBeCloseTo(261.63, 2);
		});

		it('should calculate height correctly', () => {
			expect((Note.from('C4') as Note).height).toBe(60);
			expect((Note.from('C5') as Note).height).toBe(72);
		});
	});

	describe('transpose', () => {
		it('should transpose by semitones', () => {
			const c4 = Note.from('C4') as Note;
			const e4 = c4.transpose(4);
			expect(e4.name).toBe('E4');
			expect(e4.midiNumber).toBe(64);
		});

		it('should transpose across octaves', () => {
			const c4 = Note.from('C4') as Note;
			const c5 = c4.transpose(12);
			expect(c5.name).toBe('C5');
		});

		it('should handle negative transposition', () => {
			const e4 = Note.from('E4') as Note;
			const c4 = e4.transpose(-4);
			expect(c4.name).toBe('C4');
		});
	});

	describe('error handling', () => {
		it('should throw on invalid octave', () => {
			expect(() => Note.createNote('C', null, 10)).toThrow('Invalid note octave');
		});

		it('should throw on invalid MIDI number', () => {
			expect(() => Note.fromMidi(128)).toThrow('Invalid MIDI number');
			expect(() => Note.fromMidi(-1)).toThrow('Invalid MIDI number');
		});
	});
});
