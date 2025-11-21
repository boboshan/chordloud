import devtoolsJson from 'vite-plugin-devtools-json';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import UnoCSS from 'unocss/vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		devtoolsJson(),
		UnoCSS(),
		visualizer({
			emitFile: true,
			filename: 'stats.html'
		})
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
