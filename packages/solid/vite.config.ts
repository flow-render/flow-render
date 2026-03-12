import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import { testConfig } from '../../vitest.config';

export default defineConfig({
  plugins: [solid()],
  test: testConfig,
});
