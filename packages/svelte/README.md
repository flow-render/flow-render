# @flow-render/svelte

English | [中文](./README-zh.md)

Render [Svelte](https://svelte.dev/) components in asynchronous flows — a Promise-based UI rendering approach that lets you naturally await
user interactions, just like calling async functions.

> **⚠️ Experimental**  
> This implementation requires **Svelte 5+** (Function Components).  
> Since flow-render dynamically creates the `Viewport` component using Svelte's runtime API, it may become incompatible
> with future Svelte versions if the runtime component structure changes.

## Installation

```bash
npm i @flow-render/svelte
```

## Quick Start

### Mount the Viewport

Place a `<Viewport/>` at the root of your application. All dynamically rendered components will appear here.

```sveltehtml
<!-- App.svelte -->

<script lang="ts">
  import { Viewport } from '@flow-render/svelte'
</script>

<YourApp/>
<Viewport/> <!-- Dynamic components are rendered here -->
```

### Define Components

Flow Render supports two ways to write components; you can choose based on your scenario.

#### Executor Mode (Recommended)

Components directly declare and use `resolve`/`reject` callbacks, similar to the `new Promise((resolve, reject) => ...)`
executor style.

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
    <button onclick={() => resolve(true)}>Yes</button>
    <button onclick={() => resolve(false)}>No</button>
    <button onclick={() => reject(new Error('Cancel'))}>Cancel</button>
  </div>
</dialog>
```

Callbacks are automatically injected when rendering:

```ts
import { render } from '@flow-render/svelte'

const result = await render(ConfirmDialog, {
  title: 'Are you sure?'
})
```

#### Adapter Mode (Flexible and Powerful)

Adapter mode allows you to dynamically associate props of any component with a Promise. You simply provide a function
that receives `resolve` and `reject` and returns the component's props. This approach not only works with existing
components but also enables more complex logic, such as determining props based on external data, conditional rendering,
dynamic bindings, etc.

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
    <button onclick={props.onYes}>Yes</button>
    <button onclick={props.onNo}>No</button>
    <button onclick={props.onCancel}>Cancel</button>
  </div>
</dialog>
```

When rendering with adapter mode, you establish the connection between the Promise and component callbacks via an
adapter function:

```ts
import { render } from '@flow-render/svelte'

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

## More

[Full documentation](../../)