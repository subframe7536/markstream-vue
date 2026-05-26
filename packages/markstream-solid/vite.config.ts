import { resolve } from 'node:path'
import process from 'node:process'
import solid from 'vite-plugin-solid'
import { visualizer } from 'rollup-plugin-visualizer'
import UnpluginClassExtractor from 'unplugin-class-extractor/vite'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { name } from './package.json'

export default defineConfig(({ mode }) => {
  const base = mode === 'npm' ? '' : '/'
  const plugins = [solid()]
  if (mode === 'npm') {
    plugins.push(
      dts({
        outDir: 'dist/types',
        insertTypesEntry: true,
        tsconfigPath: './tsconfig.build.json',
      }),
      UnpluginClassExtractor({
        output: 'dist/tailwind.ts',
        include: [/\/src\/.*\.(?:ts|tsx)(\?.*)?$/],
      }) as any,
    )
    if (process.env.ANALYZE === 'true')
      plugins.push(visualizer({ filename: 'bundle-visualizer.html', gzipSize: true, brotliSize: true }) as any)
  }
  return {
    base,
    plugins,
    css: { postcss: './postcss.config.cjs' },
    worker: {
      format: 'es',
      rollupOptions: {
        external: ['katex', 'katex/contrib/mhchem', 'mermaid'],
        output: {
          entryFileNames: 'workers/[name].js',
          chunkFileNames: 'workers/[name].js',
          assetFileNames: 'workers/[name][extname]',
        },
      },
    },
    build: {
      target: 'es2019',
      cssTarget: 'chrome80',
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: { ecma: 2019, drop_console: false, drop_debugger: true, pure_funcs: ['console.log'], passes: 2 },
        mangle: { safari10: true },
        format: { comments: false, preserve_annotations: false, ecma: 2019 },
      },
      lib: {
        entry: { index: resolve(__dirname, 'src/index.ts') },
        name,
        fileName: (_, entryName) => `${entryName}.js`,
        formats: ['es'],
      },
      rollupOptions: {
        external: [
          'node:module',
          'solid-js',
          'solid-js/store',
          'solid-js/web',
          'katex',
          'katex/contrib/mhchem',
          'mermaid',
          'stream-monaco',
          'stream-markdown',
          'stream-markdown-parser',
          'markstream-core',
          '@antv/infographic',
          '@terrastruct/d2',
          '@floating-ui/dom',
        ],
      },
    },
  }
})
