<script lang="ts">
  import type { ComponentProps } from '@flow-render/test-utils';

  export let name: ComponentProps['name'];
  export let yesId: ComponentProps['yesId'];
  export let noId: ComponentProps['noId'];
  export let cancelId: ComponentProps['cancelId'];
  export let resolve: ComponentProps['resolve'];
  export let reject: ComponentProps['reject'];
</script>

<dialog data-testid={name} open>
  <slot />

  <button data-testid={yesId} on:click={() => resolve(yesId)}>
    Yes
  </button>

  <button data-testid={noId} on:click={() => resolve(noId)}>
    No
  </button>

  <button data-testid={cancelId} on:click={() => reject(cancelId)}>
    Cancel
  </button>
</dialog>
