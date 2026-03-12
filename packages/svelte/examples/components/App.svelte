<script lang="ts">
  import { Viewport } from '../../src'
  import { openModal, openFlowModal } from './open'
</script>

<div>
  <h1>@flow-render/svelte</h1>

  <button on:click={()=>{
    openModal()
  }}>
    Open Modal
  </button>

  <button on:click={()=>{
    openFlowModal()
  }}>
    Open Flow Modal
  </button>

  <hr/>
  <Viewport/>
</div>
