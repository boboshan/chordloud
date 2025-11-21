<script lang="ts">
	import { uiManager } from '$lib/ui.svelte';
</script>

<button
	class="flex flex-col justify-center items-center w-8 h-8 gap-1.5 bg-transparent border-none cursor-pointer z-50 sm:hidden"
	onclick={() => uiManager.toggleMenu()}
	aria-label="Toggle menu"
>
	<span
		class={[
			'block w-6 h-0.5 bg-brand-beige transition-all duration-300 ease-in-out',
			uiManager.isMenuOpen ? 'transform rotate-45 translate-y-2' : ''
		]}
	></span>
	<span
		class={[
			'block w-6 h-0.5 bg-brand-beige transition-all duration-300 ease-in-out',
			uiManager.isMenuOpen ? 'opacity-0' : ''
		]}
	></span>
	<span
		class={[
			'block w-6 h-0.5 bg-brand-beige transition-all duration-300 ease-in-out',
			uiManager.isMenuOpen ? 'transform -rotate-45 -translate-y-2' : ''
		]}
	></span>
</button>
