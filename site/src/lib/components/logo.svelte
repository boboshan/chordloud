<script lang="ts">
	import { goto } from '$app/navigation';

	const modules = import.meta.glob('./icons/*.svg', { eager: true, import: 'default' });
	const icons = Object.fromEntries(
		Object.entries(modules).map(([path, src]) => [
			path.split('/').pop()?.replace('.svg', '') ?? '',
			src as string
		])
	);

	let {
		icon = undefined,
		href = '/',
		onclick,
		class: className,
		...props
	}: {
		icon?: string;
		href?: string;
		onclick?: (event: MouseEvent) => void;
		class?: string;
		[key: string]: any;
	} = $props();

	const keys = Object.keys(icons);
	const randomKey = () => keys[Math.floor(Math.random() * keys.length)];

	let selectedIcon = $state(icon ? icons[icon] : null);

	$effect(() => {
		if (!selectedIcon) {
			selectedIcon = icons[randomKey()];
		}
	});

	function handleClick(event: MouseEvent) {
		if (href && href !== '#') {
			goto(href);
		}
		selectedIcon = icons[randomKey()];
		onclick?.(event);
	}
</script>

<button
	tabindex="0"
	onclick={handleClick}
	class={[
		'inline-block size-[50px] md:size-[90px] rounded-50% md:rounded-8 p-1.5 sm:(p-2 size-[70px] rounded-6 bg-gradient-to-bl from-brand-pink to-brand-blue) cursor-pointer select-none transition-all duration-150 ease-out hover:(scale-102 shadow-lg) active:scale-99',
		className
	]}
	{...props}
>
	{#if selectedIcon}
		<img src={selectedIcon} alt="icon" class="h-full w-full" />
	{/if}
</button>
