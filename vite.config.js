import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import autoImport from 'unplugin-auto-import/vite';
import components from 'unplugin-vue-components/vite';
import { HeadlessUiResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
  plugins: [
    autoImport({
      include: [
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
        /\.js$/, // .js files
      ],
      imports: [
        'vue',
        '@vueuse/core',
        'vitepress',
        {
          composable: [
            'useEditLink',
            'getHeaders',
            'resolveHeaders',
            'isActive',
            'useActiveAnchor',
            'usePrevNext',
            'useSidebarControl',
            'useVersion',
          ],
        },
      ],
      dts: false,
    }),
    components({
      resolvers: [HeadlessUiResolver()],
      dts: false,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./.vitepress/theme/', import.meta.url)),
      composable: fileURLToPath(new URL('./.vitepress/theme/composables/index.js', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['meilisearch'],
  },
  server: {
    host: 'localhost',
    fs: {
      // for when developing with locally linked theme
      //allow: ['../..'],
    },
  },
});
