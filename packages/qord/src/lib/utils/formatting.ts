/**
 * Formatting Utilities
 * Helper functions for formatting numbers and strings
 * @module utils/formatting
 */

/**
 * Converts a number to its ordinal form (1st, 2nd, 3rd, etc.)
 * @param n - The number to convert
 * @returns The ordinal string representation
 * @example
 * ```typescript
 * numberToOrdinal(1)  // "1st"
 * numberToOrdinal(22) // "22nd"
 * numberToOrdinal(13) // "13th"
 * ```
 */
export function numberToOrdinal(n: number): string {
	const suffixes = ["th", "st", "nd", "rd"] as const;
	const value = n % 100;
	return `${n}${suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]}`;
}

/**
 * Capitalizes the first character of a string
 * @param str - The string to capitalize
 * @returns The capitalized string
 * @example
 * ```typescript
 * capitalize("hello") // "Hello"
 * capitalize("WORLD") // "WORLD"
 * ```
 */
export function capitalize(str: string): string {
	if (str.length === 0) return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
}
