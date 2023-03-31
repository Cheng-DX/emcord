import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
} from 'unocss'

const colors = [
  'primary',
  'primary-hover',
  'primary-active',
  'success',
  'success-hover',
  'success-active',
  'danger',
  'danger-hover',
  'danger-active',

  'text-0',
  'text-1',
  'text-2',
  'text-3',
  'text-3-trans',

  'theme-0',
  'theme-1',
  'theme-1-trans',
  'theme-2',
  'theme-2-hover',
  'theme-2-active',
  'theme-3',
  'theme-4',
  'theme-5',
]

const colorRules = colors.map((c) => [`c-${c}`, { color: `var(--c-${c})` }])
const bgRules = colors.map((c) => [`bgc-${c}`, { 'background-color': `var(--c-${c})` }])

export default defineConfig({
  shortcuts: [
    [
      'icon-btn',
      'text-[0.9em] inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600',
    ],
    ['flex-center', 'display-flex justify-center items-center'],
    ['btn', 'flex-center r-5 cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed'],

    ['btn-primary', 'btn bg-primary'],
    ['btn-success', 'btn bg-success'],
    ['btn-danger', 'btn bg-danger'],

    ['bg-primary', 'bgc-primary hover:bgc-primary-hover active:bgc-primary-active'],
    ['bg-success', 'bgc-success hover:bgc-success-hover active:bgc-success-active'],
    ['bg-danger', 'bgc-danger hover:bgc-danger-hover active:bgc-danger-active'],
    ['bg-text', 'bgc-b8b9bf hover:bgc-e0e1e5 active:bgc-ffffff'],
    ['theme-2', 'bgc-theme-2 hover:bgc-theme-2-hover active:bgc-theme-2-active'],

    ['c-change-1', 'c-text-1 hover:c-text-0 transition-280'],
    ['c-change-2', 'c-text-2 hover:c-text-1 transition-280'],
    ['c-change-3', 'c-text-3 hover:c-text-1 transition-280'],
  ],
  rules: [
    ['scroll-y', { 'overflow-y': 'scroll' }],
    ['btn-text', {
      'white-space': 'nowrap',
      'text-overflow': 'ellipsis',
      'font-weight': 700,
    }],
    ['scroll-x', { 'overflow-x': 'scroll' }],
    ...colorRules as any,
    ...bgRules as any,
    [/^wp-(\d+)$/, ([, d]) => ({ width: `${d}%` })],
    [/^hp-(\d+)$/, ([, d]) => ({ height: `${d}%` })],
    [/^r-(\d+)$/, ([, d]) => ({ 'border-radius': `${d}px` })],
    [/^bgc-([0-9a-zA-z]+)$/, ([, s]) => ({ 'background-color': `#${s}` })],
    [/^c-([0-9a-zA-z]+)$/, ([, s]) => ({ color: `#${s}` })],
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
        heroicons: () => import('@iconify-json/heroicons/icons.json').then(i => i.default as any),
        octicon: () => import('@iconify-json/octicon/icons.json').then(i => i.default as any),
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
