<script lang="ts">
  import Card from './Card.svelte'
  import Counter from './Counter.svelte'

  const props = $props()
</script>

<Card>
  {@render props.children?.()}

  <Counter/>

  <div>
    <button onclick={()=>props.reject()}>
      REJECT
    </button>

    <button onclick={()=>props.resolve(false)}>
      RESOLVE:false
    </button>

    <button onclick={()=>props.resolve(true)}>
      RESOLVE:true
    </button>

  </div>
</Card>
