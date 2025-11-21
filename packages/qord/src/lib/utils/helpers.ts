/**
 * Helper Utilities
 * Common utility functions for music theory calculations
 * @module utils/helpers
 */

import { STEP_TO_FIFTH_DISTANCE, STEP_TO_OCTAVE } from "../constants.js";

/**
 * Type representing a coordinate in the pitch space
 * [fifth, octave] or just [fifth] if octave is not specified
 */
export type Coordinate = [number] | [number, number];

/**
 * Calculates the coordinate representation of a pitch or pitch class
 * Returns a function that takes an optional octave and returns the coordinate
 *
 * @param step - The scale step (0-6)
 * @param alteration - The alteration in semitones (# = 1, b = -1, etc.)
 * @param direction - The direction multiplier (1 or -1)
 * @returns A function that takes an optional octave and returns the coordinate
 */
export function calculateCoordinate(
	step: number,
	alteration: number,
	direction = 1,
): (octave?: number | null) => Coordinate {
	const fifthDistance = STEP_TO_FIFTH_DISTANCE[step] + 7 * alteration;
	return (octave: number | null = null): Coordinate => {
		if (octave === null) {
			return [direction * fifthDistance];
		}
		const octaveAdjustment = octave - STEP_TO_OCTAVE[step] - 4 * alteration;
		return [direction * fifthDistance, direction * octaveAdjustment];
	};
}

/**
 * Rotates an array by n positions
 * @param n - Number of positions to rotate (positive = right, negative = left)
 * @param arr - The array to rotate
 * @returns A new rotated array
 * @example
 * rotate(2, [1, 2, 3, 4]) // [3, 4, 1, 2]
 * rotate(-1, [1, 2, 3, 4]) // [4, 1, 2, 3]
 */
export function rotate<T>(n: number, arr: readonly T[]): T[] {
	const length = arr.length;
	const normalizedRotation = ((n % length) + length) % length;
	return [
		...arr.slice(normalizedRotation),
		...arr.slice(0, normalizedRotation),
	];
}

/**
 * Generates all possible rotations of an array
 * For arrays of length <= 2, returns only the original array
 * @param arr - The array to generate rotations for
 * @returns An array of all rotations
 * @example
 * generateRotations([1, 2, 3]) // [[1, 2, 3], [2, 3, 1], [3, 1, 2]]
 */
export function generateRotations<T>(arr: readonly T[]): T[][] {
	if (arr.length <= 2) {
		return [[...arr]];
	}
	const rotations: T[][] = [];
	for (let i = 0; i < arr.length; i++) {
		rotations.push(rotate(i, arr));
	}
	return rotations;
}
