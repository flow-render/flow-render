import { defineConfig, type TestUserConfig } from 'vitest/config';

export const testConfig: TestUserConfig = {
  environment: 'jsdom',
  globals: true,
  coverage: {
    enabled: true,
    provider: 'v8',
    exclude: ['packages/test-utils'],
  },
};

export default defineConfig({
  test: {
    ...testConfig,

    /**
     * Solid FAIL
     * Error: Client-only API called on the server side. Run client-only code in onMount, or conditionally run client-only component with <Show>.
     */
    projects: ['packages/*', '!packages/solid'],
  },
});
