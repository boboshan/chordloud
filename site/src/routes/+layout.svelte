<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import 'virtual:uno.css';
	import Logo from '$lib/components/logo.svelte';
	import Hamburger from '$lib/components/hamburger.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>ChordLoud</title>
	<link rel="icon" href={favicon} />
	<meta name="description" content="An easy-to-use chord toolset." />
	<meta name="keywords" content="Chord, Chord Detector, Midi" />
	<meta name="author" content="bbs" />
	<meta name="twitter:site" content="https://chordloud.com" />
	<meta name="twitter:title" content="ChordLoud" />
	<meta name="twitter:description" content="An easy-to-use chord toolset." />
	<meta name="twitter:creator" content="bbs" />
	<meta property="og:title" content="ChordLoud" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://chordloud.com" />
	<meta property="og:image:alt" content="ChordLoud" />
	<meta property="og:description" content="An easy-to-use chord toolset." />
	<meta property="og:site_name" content="ChordLoud" />
	<meta property="og:locale" content="EN_US" />
</svelte:head>

<header
	class="w-full px-4 py-6 sm:(h-fit w-fit py-8 ma) md:(h-200px w-fit py-8 ma)
  flex flex-row justify-between items-center gap-1 sm:(justify-center gap-2)"
>
	<Logo />

	<h1 class="text-9 sm:text-18 md:text-24 pr-2 font-telma font-500 block line-height-none">
		<a href="/"><span>Chord</span><span class="text-brand-pink">Loud</span></a>
	</h1>
	<Hamburger />
</header>

<div class="px-4 pb-4 md:px-8 max-w-6xl m-auto">
	{@render children()}
</div>
