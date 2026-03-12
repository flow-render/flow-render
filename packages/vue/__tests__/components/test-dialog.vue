<script setup lang="ts">
import { ComponentProps } from '@flow-render/test-utils'

const props = defineProps<Omit<ComponentProps, 'children'>>()
</script>

<template>
  <dialog :data-testid="props.name" open>
    <slot></slot>

    <button :data-testid="props.yesId" @click="props.resolve(props.yesId)">
      Yes
    </button>

    <button :data-testid="props.noId" @click="props.resolve(props.noId)">
      No
    </button>

    <button :data-testid="props.cancelId" @click="props.reject(props.cancelId)">
      Cancel
    </button>
  </dialog>
</template>
