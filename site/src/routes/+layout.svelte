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
	class="px-4 py-4 flex flex-row gap-1 w-full items-center justify-between md:(m-auto h-200px w-fit) sm:(m-auto py-8 gap-2 h-fit w-fit justify-center)"
>
	<Logo />
	<h1 class="text-9 line-height-none font-500 font-telma pr-2 block md:text-24 sm:text-18">
		<a href="/"><span>Chord</span><span class="text-brand-pink">Loud</span></a>
	</h1>
	<Hamburger />
</header>

<div class="m-auto px-4 pb-10 max-w-6xl sm:px-0">
	{@render children()}
</div>
