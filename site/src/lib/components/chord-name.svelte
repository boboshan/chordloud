<script lang="ts">
	import { Chord } from 'qord';

	const SYMBOL_MAP: Record<string, string> = {
		m: 'min',
		M: 'Maj',
		'#': '♯',
		b: '♭',
		aug: 'Aug'
	};
	const SYMBOL_REGEX = /^m|^M|#|b|aug/g;

	const INTERVAL_MAP: Record<string, string> = {
		'perfect unison': 'Perfect Unison',
		'minor second': 'minor 2nd',
		'major second': 'Major 2nd',
		'minor third': 'minor 3rd',
		'major third': 'Major 3rd',
		'perfect fourth': 'Perfect 4th',
		tritone: 'Tritone',
		'perfect fifth': 'Perfect 5th',
		'minor sixth': 'minor 6th',
		'major sixth': 'Major 6th',
		'minor seventh': 'minor 7th',
		'major seventh': 'Major 7th',
		octave: 'Octave'
	};
	const INTERVAL_REGEX =
		/(major|minor|perfect)\s(second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth|thirteenth|fourteenth|fifteenth)|tritone|octave/gi;

	const PC_MAP: Record<string, string> = {
		'#': '♯',
		b: '♭',
		n: ''
	};
	const PC_REGEX = /(#|b|n)/;

	const replaceSymbols = (str: string) =>
		str?.replace(SYMBOL_REGEX, (match) => SYMBOL_MAP[match] || match);

	const replaceNames = (str: string) =>
		str?.replace(INTERVAL_REGEX, (match) => INTERVAL_MAP[match.toLowerCase()] || match);

	const replacePitchClassSymbols = (pitchClass: string) =>
		pitchClass.replace(PC_REGEX, (match) => PC_MAP[match] ?? match);

	let { chord, class: className, ...props } = $props();

	let omission = $derived(chord.omission?.map((o: { number: number }) => o.number).join(','));
	let symbol = $derived(chord.type.symbols[1] ?? null);

	let type = $derived.by(() => {
		if (symbol === '') return '';
		if (symbol == null) return null;
		return Chord.tokenizeSymbol(symbol);
	});

	let quality = $derived.by(() => {
		if (type === '') return '';
		if (type) return replaceSymbols(type[0]);
		return replaceNames(chord.type.name);
	});

	let alterations = $derived(Array.isArray(type) ? replaceSymbols(type.slice(1).join('')) : null);
	let root = $derived(chord.root ? replacePitchClassSymbols(chord.root.name) : null);
	let bass = $derived(chord.bass ? `${replacePitchClassSymbols(chord.bass.name)}` : null);
</script>

<!-- prettier-ignore -->
<div {...props} class={['inline items-baseline font-erode', className]}>
	{#if root}
		<span class="font-500">{root}</span
		>{/if}{#if quality}<span class="text-0.9em px-0.1em italic">{quality}</span
		>{/if}{#if alterations}<sup class="text-0.8em font-thin italic">{alterations}</sup
		>{/if}{#if omission}<sup class="text-0.8em font-thin italic">(no{omission})</sup
		>{/if}{#if bass}<span class="text-0.9em font-thin px-0.1em opacity-50">/</span
		><span class="text-0.9em font-thin opacity-50">{bass}</span>
	{/if}
</div>
