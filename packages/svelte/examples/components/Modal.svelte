<script lang="ts">
  import Card from './Card.svelte'
  import Counter from './Counter.svelte'

  const props = $props()
</script>

<Card>
  {@render props.children?.()}

  <Counter/>

  <div>
    <button onclick={()=>props.onCancel()}>
      CANCEL
    </button>

    <button onclick={()=>props.onOk()}>
      OK
    </button>
  </div>
</Card>
