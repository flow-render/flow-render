<script lang="ts">
  import { createRenderer, RenderFunction } from '../../src'

  export let boxId: string
  export let getRender: (render: RenderFunction) => void

  const [render, Viewport,] = createRenderer()

  getRender(render)
</script>

<div data-testid={boxId}>
  <Viewport/>
</div>
