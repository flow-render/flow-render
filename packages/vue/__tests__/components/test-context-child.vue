<script setup lang="ts">
import { inject } from 'vue'

const props = defineProps<{ boxId: string }>()
const theme = inject('theme')
</script>

<template>
  <div :data-testid="props.boxId">
    {{ theme }}
  </div>
</template>
