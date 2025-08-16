import { resolve } from 'path';
import { defineConfig } from 'vite'
import handlebars from 'vite-plugin-handlebars';
import checker from 'vite-plugin-checker';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
  root: resolve(__dirname, 'src'),
  build: {
      outDir: resolve(__dirname, 'dist'),
  },
  server: { port: 3000, },
  preview: { port: 3000 },
  plugins: [
    handlebars({ reloadOnPartialChange: true }),
    checker({
      stylelint: {
        lintCommand: 'stylelint ./**/*.styl',
      },
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint "./**/*.{ts,js}"',
      },
    }),
    eslint({
      include: ['src/**/*.{ts,js}'],
      exclude: ['node_modules', 'dist'],
      })
  ],
})
