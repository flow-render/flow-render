<script lang="ts">
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { Viewport } from '../../src';

  const theme = writable('light');

  setContext('theme', theme);

  const toggleTheme = () => {
    theme.update((value) => (value === 'light' ? 'dark' : 'light'));
  };
</script>

<button on:click={toggleTheme}>change-theme</button>
<Viewport />
