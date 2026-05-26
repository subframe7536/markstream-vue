import type { PluginOption } from 'vite'
import path from 'node:path'
import { defineConfig } from 'vite'
import monacoEditorPlugin from 'vite-plugin-monaco-editor-esm'
import solid from 'vite-plugin-solid'

export default defineConfig(({ mode }) => ({
  base: './',
  server: {
    port: 4177,
    fs: { allow: [path.resolve(__dirname, '..')] },
  },
  worker: { format: 'es' },
  optimizeDeps: { exclude: ['stream-monaco'] },
  resolve: mode === 'development'
    ? {
        alias: {
          'markstream-solid': path.resolve(__dirname, '../packages/markstream-solid/src'),
          'markstream-core': path.resolve(__dirname, '../packages/markstream-core/src/index.ts'),
          'markstream-core/': `${path.resolve(__dirname, '../packages/markstream-core/src')}/`,
        },
      }
    : undefined,
  plugins: [
    solid(),
    monacoEditorPlugin({
      languageWorkers: ['editorWorkerService', 'typescript', 'css', 'html', 'json'],
      customDistPath(_root, buildOutDir) {
        return path.resolve(buildOutDir, 'monacoeditorwork')
      },
    }) as unknown as PluginOption,
  ],
}))
