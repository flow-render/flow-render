<script>
  import { onDestroy } from 'svelte'

  const { store, resetStore } = $props()
  const { nodes } = store

  onDestroy(() => {
    resetStore(store)
  })
</script>

{#each $nodes as node (node.key)}
  <node.component {...node.props}/>
{/each}