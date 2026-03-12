# @flow-render/vue

[English](./README.md) | 中文

在异步流程中渲染 [Vue](https://vuejs.org/) 组件，基于 Promise 的 UI 渲染方式，让你像调用异步函数一样自然地等待用户交互结果。

## 安装

```bash
npm i @flow-render/vue
```

## 快速开始

### 挂载 Viewport

将 `<Viewport/>` 放置在应用的根组件中。所有动态渲染的组件都将出现在这里。

```vue
<!-- App.vue -->

<script setup lang="ts">
  import { Viewport } from '@flow-render/vue'
</script>

<template>
  <YourApp/>
  <Viewport/> <!-- 动态组件渲染在这里 -->
</template>
```

### 定义组件

Flow Render 支持两种编写组件的方式，你可以根据场景选择。

#### Executor 模式（推荐）

组件直接使用 `resolve`/`reject` 回调，类似于 `new Promise((resolve, reject) => ...)` 的执行器风格。

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
      <button @click="props.resolve(true)">是</button>
      <button @click="props.resolve(false)">否</button>
      <button @click="props.reject(new Error('取消'))">取消</button>
    </div>
  </dialog>
</template>
```

渲染时回调会自动注入：

```ts
import { render } from '@flow-render/vue'

const result = await render(ConfirmDialog, {
  title: '你确定吗？'
})
```

#### Adapter 模式（灵活且强大）

Adapter 模式允许你将任意组件的 props 动态关联到 Promise。你只需提供一个接收 `resolve` 和 `reject` 并返回组件 props
的函数。这种方式不仅适用于现有组件，还能实现更复杂的逻辑，比如基于外部数据决定 props、条件渲染、动态绑定等。

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
      <button @click="props.onYes">是</button>
      <button @click="props.onNo">否</button>
      <button @click="props.onCancel">取消</button>
    </div>
  </dialog>
</template>
```

使用 adapter 模式渲染时，通过 adapter 函数建立 Promise 和组件回调之间的关联：

```ts
import { render } from '@flow-render/vue'

const result = await render(ConfirmDialog, (resolve, reject) => {
  return {
    title: '你确定吗？',
    onYes: () => resolve(true),
    onNo: () => resolve(false),
    onCancel: () => reject(),
  }
})
```

---

## Children prop

Vue 有一个特殊的 `children` prop，它会自动映射到默认插槽。
当你的组件需要接收子元素时，**从 Props 中排除 `children` prop**，在模板中使用 `<slot/>`。

```vue
<!-- ConfirmDialog.vue -->

<script setup lang="ts">
  import { type PromiseResolvers } from '@flow-render/vue'

  interface Props extends PromiseResolvers<boolean> {
    title: string
  }

  // 从 defineProps 中排除 'children'
  const props = defineProps<Props>()
</script>

<template>
  <dialog open>
    <div>{{ props.title }}</div>
    <!-- 通过默认插槽渲染子元素 -->
    <slot/>
    <button @click="props.resolve(true)">是</button>
  </dialog>
</template>
```

渲染时传递 children：

```ts
import { render } from '@flow-render/vue'

const result = await render(ConfirmDialog, {
  title: '确认',
  children: '你确定要继续吗？'
})
```

---

## 更多

[完整文档](../../)
