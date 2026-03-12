<script setup lang="ts">
import { provide, ref } from 'vue'
import { Viewport } from '../../src'

const theme = ref('light')

provide('theme', theme)
</script>

<template>
  <div>
    <button @click="theme = (theme === 'light' ? 'dark' : 'light')">
      change-theme
    </button>

    <Viewport/>
  </div>
</template>
