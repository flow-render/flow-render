# @flow-render/vue

English | [中文](./README-zh.md)

Render [Vue](https://vuejs.org/) components in asynchronous flows — a Promise-based UI rendering approach that lets you naturally await
user interactions, just like calling async functions.

## Installation

```bash
npm i @flow-render/vue
```

## Quick Start

### Mount the Viewport

Place a `<Viewport/>` at the root of your application. All dynamically rendered components will appear here.

```vue
<!-- App.vue -->

<script setup lang="ts">
  import { Viewport } from '@flow-render/vue'
</script>

<template>
  <YourApp/>
  <Viewport/> <!-- Dynamic components are rendered here -->
</template>
```

### Define Components

Flow Render supports two ways to write components; you can choose based on your scenario.

#### Executor Mode (Recommended)

Components directly declare and use `resolve`/`reject` callbacks, similar to the `new Promise((resolve, reject) => ...)`
executor style.

```vue
<!-- ConfirmDialog.vue -->

<script setup lang="ts">
  import { type PromiseResolvers } from '@flow-render/vue'

  interface Props extends PromiseResolvers<boolean> {
    title: string
  }

  let props = defineProps<Props>()
</script>

<template>
  <dialog open>
    <div>{{title}}</div>
    <div>
      <button @click="props.resolve(true)">Yes</button>
      <button @click="props.resolve(false)">No</button>
      <button @click="props.reject(new Error('Cancel'))">Cancel</button>
    </div>
  </dialog>
</template>
```

Callbacks are automatically injected when rendering:

```ts
import { render } from '@flow-render/vue'

const result = await render(ConfirmDialog, {
  title: 'Are you sure?'
})
```

#### Adapter Mode (Flexible and Powerful)

Adapter mode allows you to dynamically associate props of any component with a Promise. You simply provide a function
that receives `resolve` and `reject` and returns the component's props. This approach not only works with existing
components but also enables more complex logic, such as determining props based on external data, conditional rendering,
dynamic bindings, etc.

```vue
<!-- ConfirmDialog.vue -->

<script setup lang="ts">
  interface Props {
    title: string
    onYes: () => void
    onNo: () => void
    onCancel: () => void
  }

  const props = defineProps<Props>()
</script>

<template>
  <dialog open>
    <div>{{props.title}}</div>
    <div>
      <button @click="props.onYes">Yes</button>
      <button @click="props.onNo">No</button>
      <button @click="props.onCancel">Cancel</button>
    </div>
  </dialog>
</template>
```

When rendering with adapter mode, you establish the connection between the Promise and component callbacks via an
adapter function:

```ts
import { render } from '@flow-render/vue'

const result = await render(ConfirmDialog, (resolve, reject) => {
  return {
    title: 'Are you sure?',
    onYes: () => resolve(true),
    onNo: () => resolve(false),
    onCancel: () => reject(),
  }
})
```

---

## `children` prop

Vue has a special `children` prop that is automatically mapped to the slots.
When your component needs to receive children, **exclude the `children` prop from Props**, use `<slot/>` in the
template.

```vue
<!-- ConfirmDialog.vue -->

<script setup lang="ts">
  import { type PromiseResolvers } from '@flow-render/vue'

  interface Props extends PromiseResolvers<boolean> {
    title: string
  }

  // Exclude 'children' from defineProps
  const props = defineProps<Props>()
</script>

<template>
  <dialog open>
    <div>{{ props.title }}</div>
    <!-- Render children via default slot -->
    <slot/>
    <button @click="props.resolve(true)">Yes</button>
  </dialog>
</template>
```

Pass children when rendering:

```ts
import { render } from '@flow-render/vue'

const result = await render(ConfirmDialog, {
  title: 'Confirm',
  children: 'Are you sure you want to continue?'
})
```

---

## More

[Full documentation](../../)