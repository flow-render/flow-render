import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';
import { testConfig } from '../../vitest.config';

export default defineConfig({
  plugins: [preact()],
  test: testConfig,
});
