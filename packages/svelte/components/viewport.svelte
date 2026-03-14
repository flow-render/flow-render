<script>
  import { onMount } from 'svelte'

  const { store } = $props()

  let nodes = $state(store.nodes)

  onMount(() => store.sub((value) => {
    nodes = value
  }))
</script>

{#each nodes as node (node.key)}
  <node.component {...node.props}/>
{/each}