<script lang="ts">
  let count = 0
</script>

<div>
  <div>{count}</div>

  <button on:click={()=>{
      count += 1
    }}>
    + increase
  </button>

  <button on:click={()=>{
      count -= 1
    }}>
    - decrease
  </button>
</div>
