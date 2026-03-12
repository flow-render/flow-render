import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { testConfig } from '../../vitest.config';

export default defineConfig({
  plugins: [react()],
  test: testConfig,
});
