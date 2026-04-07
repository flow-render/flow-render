import { defineConfig } from '@braveforge/eslint-config';

export default defineConfig({
  extends: [
    {
      rules: {
        'no-plusplus': 'off',
        'typescript/max-params': 'off',
      },
    },
  ],
});
