import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Inspect from 'vite-plugin-inspect'
import VueDevtools from 'vite-plugin-vue-devtools'

export default defineConfig({
  server: {
    cors: true,
  },
  envDir: './env',
  plugins: [
    VueDevtools(),
    vue({
      script: {
        // @ts-expect-error defineModel is not yet in the types
        defineModel: true,
      },
    }),
    UnoCSS(),
    Inspect(),
    AutoImport({
      include: [
        /\.[tj]sx?$/,
        /\.vue$/, /\.vue\?vue/,
        /\.md$/,
      ],
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        {
          '@vueuse/core': [
            ['useFetch', 'useCoreFetch'],
          ],
        },
      ],
      dirs: [
        'src/composables/**',
      ],
    }),
  ],
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('src', import.meta.url)),
    },
  },
})
