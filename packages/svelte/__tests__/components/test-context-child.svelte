<script lang="ts">
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';

  export let boxId: string;

  const theme = getContext<Writable<string>>('theme');
</script>

<div data-testid={boxId}>
  {$theme}
</div>
