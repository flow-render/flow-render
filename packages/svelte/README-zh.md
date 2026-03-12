# @flow-render/svelte

[English](./README.md) | 中文

在异步流程中渲染 [Svelte](https://svelte.dev/) 组件，基于 Promise 的 UI 渲染方式，让你像调用异步函数一样自然地等待用户交互结果。

> **⚠️ 实验性**  
> 此实现需要 **Svelte 5+**（使用 `$props()` 的函数组件）。  
> 由于 flow-render 使用 Svelte 运行时 API 动态创建 `Viewport` 组件，如果未来 Svelte 版本的运行时组件结构发生变化，可能会导致不兼容。

## 安装

```bash
npm i @flow-render/svelte
```

## 快速开始

### 挂载 Viewport

将 `<Viewport/>` 放置在应用的根组件中。所有动态渲染的组件都将出现在这里。

```sveltehtml
<!-- App.svelte -->

<script lang="ts">
  import { Viewport } from '@flow-render/svelte'
</script>

<YourApp/>
<Viewport/> <!-- 动态组件渲染在这里 -->
```

### 定义组件

Flow Render 支持两种编写组件的方式，你可以根据场景选择。

#### Executor 模式（推荐）

组件直接使用 `resolve`/`reject` 回调，类似于 `new Promise((resolve, reject) => ...)` 的执行器风格。

```sveltehtml
<!-- ConfirmDialog.svelte -->

<script lang="ts">
  import { type PromiseResolvers } from '@flow-render/svelte'

  interface Props extends PromiseResolvers<boolean> {
    title: string
  }

  let { title, resolve, reject }: Props = $props()
</script>

<dialog open>
  <div>{title}</div>
  <div>
    <button onclick={() => resolve(true)}>是</button>
    <button onclick={() => resolve(false)}>否</button>
    <button onclick={() => reject(new Error('取消'))}>取消</button>
  </div>
</dialog>
```

渲染时回调会自动注入：

```ts
import { render } from '@flow-render/svelte'

const result = await render(ConfirmDialog, {
  title: '你确定吗？'
})
```

#### Adapter 模式（灵活且强大）

Adapter 模式允许你将任意组件的 props 动态关联到 Promise。你只需提供一个接收 `resolve` 和 `reject` 并返回组件 props
的函数。这种方式不仅适用于现有组件，还能实现更复杂的逻辑，比如基于外部数据决定 props、条件渲染、动态绑定等。

```sveltehtml
<!-- ConfirmDialog.svelte -->

<script lang="ts">
  interface Props {
    title: string
    onYes: () => void
    onNo: () => void
    onCancel: () => void
  }

  const props: Props = $props()
</script>

<dialog open>
  <div>{props.title}</div>
  <div>
    <button onclick={props.onYes}>是</button>
    <button onclick={props.onNo}>否</button>
    <button onclick={props.onCancel}>取消</button>
  </div>
</dialog>
```

使用 adapter 模式渲染时，通过 adapter 函数建立 Promise 和组件回调之间的关联：

```ts
import { render } from '@flow-render/svelte'

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

## 更多

[完整文档](../../)
