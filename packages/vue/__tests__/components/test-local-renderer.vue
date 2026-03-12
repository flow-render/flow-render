<script lang="ts" setup>
import { createRenderer, RenderFunction } from '../../src'

const props = defineProps<{
  boxId: string,
  getRender: (render: RenderFunction) => void
}>()

const [render, Viewport,] = createRenderer()

props.getRender(render)
</script>

<template>
  <div :data-testid="props.boxId">
    <Viewport/>
  </div>
</template>