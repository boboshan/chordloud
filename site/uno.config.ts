import { defineConfig, presetWebFonts, transformerVariantGroup, transformerDirectives } from 'unocss'
import presetWind4 from '@unocss/preset-wind4'

export default defineConfig({
  presets: [
    presetWind4({
      preflights: {
        reset: true,
      }
    }),
    presetWebFonts({
      provider: 'fontshare',
      fonts: {
        telma: [
          {
            name: 'Telma',
            weights: ['100', '200', '300', '400', '500'],
            italic: false
          },
          {
            name: 'sans-serif',
            provider: 'none'
          }
        ],
        erode: [
          {
            name: 'Erode',
            weights: ['100', '200', '300', '400', '500'],
            italic: false
          },
          {
            name: 'sans-serif',
            provider: 'none'
          }
        ]
      }
    })
  ],
  transformers: [
    transformerVariantGroup(), transformerDirectives(),
  ],
  shortcuts: {
    'card': 'p-4 sm:p-6 md:p-8 bg-[#231f20] rounded-2',
  },
  theme: {
    colors: {
      brand: {
        grayLight: '#1b1d23',
        grayDark: '#131519',
        grayDarkest: '#0d0f11',
        coal: '#0f0d0e',
        coalLight: '#181516',
        charcoal: '#1a1717ff',
        gray: '#262522',
        yellow: '#fcba28',
        pink: '#f38ba3',
        green: '#0ba95b',
        purple: '#7b5ea7',
        beige: '#f9f4da',
        blue: '#12b5e5',
        bluer: '#0071f4',
        orange: '#fc7428',
        red: '#ed203d',
        white: '#ffffff',
        gentlePeachLol: '#f99157',
        magesticPurple: '#9d7dce'
      }
    }
  }
})