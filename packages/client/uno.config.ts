import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    [
      'icon-btn',
      'text-[0.9em] inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600',
    ],
    ['flex-center', 'display-flex justify-center items-center'],
    ['btn', 'c-text-0 flex-center r-5 cursor-pointer btn-text border-none disabled:opacity-50 disabled:cursor-not-allowed'],
    ['btn-primary', 'btn bgc-5865f2 hover:bgc-4752c4 active:bgc-3c45a5'],
    ['btn-success', 'btn bgc-248046 hover:bgc-1a6334 active:bgc-15562b'],
    ['btn-danger', 'btn bgc-da373c hover:bgc-a12828 active:bgc-8f2022'],
  ],
  rules: [
    [
      'scroll-y',
      {
        'overflow-y': 'scroll',
      },
    ],
    ['btn-text',
      {
        'margin': '0 auto',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        'font-weight': 700,
      },
    ],
    [
      'scroll-x',
      {
        'overflow-x': 'scroll',
      },
    ],
    ['c-text-0', { color: '#ffffff' }],
    ['c-text-1', { color: '#f3f4f5' }],
    ['c-text-2', { color: '#e0e1e5' }],
    ['c-text-3', { color: '#b8b9bf' }],
    [/^wp-(\d+)$/, ([, d]) => ({ width: `${d}%` })],
    [/^hp-(\d+)$/, ([, d]) => ({ height: `${d}%` })],
    [/^r-(\d+)$/, ([, d]) => ({ 'border-radius': `${d}px` })],
    [/^bgc-([0-9a-zA-z]+)$/, ([, s]) => ({ 'background-color': `#${s}` })],
    [/^s-(\w+)$/, ([, w]) => ({ height: w, width: w })],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      collections: {
        carbon: () =>
          import('@iconify-json/carbon/icons.json').then(i => i.default as any),
        ic: () => import('@iconify-json/ic/icons.json').then(i => i.default as any),
      },
    }),
    presetWebFonts({
      fonts: {
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
})
