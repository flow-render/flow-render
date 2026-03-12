import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { testConfig } from '../../vitest.config';

export default defineConfig({
  plugins: [vue()],
  test: testConfig,
});
