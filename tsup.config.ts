import { defineConfig, type Options } from 'tsup';

const frameworks = [
  'preact',
  'react',
  'solid',
  'svelte',
  'vue',
];

const external = [
  'preact',
  'preact/*',
  'react',
  'solid-js',
  'svelte',
  'svelte/*',
  /\.svelte$/,
  'vue',
];

export default defineConfig(
  frameworks.map((name): Options => {
    return {
      entry: {
        index: `packages/${ name }/src/index.ts`,
      },
      outDir: `packages/${ name }/dist`,
      dts: true,
      format: 'esm',
      target: 'esnext',
      clean: true,
      external,
      treeshake: 'smallest',
    };
  }),
);
