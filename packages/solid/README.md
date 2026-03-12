# @flow-render/solid

English | [中文](./README-zh.md)

Render [Solid](https://www.solidjs.com/) components in asynchronous flows — a Promise-based UI rendering approach that lets you naturally await
user interactions, just like calling async functions.

## Installation

```bash
npm i @flow-render/solid
```

## Quick Start

### Mount the Viewport

Place a `<Viewport/>` at the root of your application. All dynamically rendered components will appear here.

```tsx
import { Viewport } from '@flow-render/solid'

function App () {
  return (
    <>
      <YourApp/>
      <Viewport/> {/* Dynamic components are rendered here */}
    </>
  )
}
```

### Define Components

Flow Render supports two ways to write components; you can choose based on your scenario.

#### Executor Mode (Recommended)

Components directly declare and use `resolve`/`reject` callbacks, similar to the `new Promise((resolve, reject) => ...)`
executor style.

```tsx
import { type PromiseResolvers } from '@flow-render/solid'

interface Props extends PromiseResolvers<boolean> {
  title: string
}

function ConfirmDialog ({ title, resolve, reject }: Props) {
  return (
    <dialog open>
      <div>{title}</div>
      <div>
        <button onClick={() => resolve(true)}>Yes</button>
        <button onClick={() => resolve(false)}>No</button>
        <button onClick={() => reject(new Error('Cancel'))}>Cancel</button>
      </div>
    </dialog>
  )
}
```

Callbacks are automatically injected when rendering:

```tsx
import { render } from '@flow-render/solid'

const result = await render(ConfirmDialog, {
  title: 'Are you sure?'
})
```

#### Adapter Mode (Flexible and Powerful)

Adapter mode allows you to dynamically associate props of any component with a Promise. You simply provide a function
that receives `resolve` and `reject` and returns the component's props. This approach not only works with existing
components but also enables more complex logic, such as determining props based on external data, conditional rendering,
dynamic bindings, etc.

```tsx
interface Props {
  title: string
  onYes: () => void
  onNo: () => void
  onCancel: () => void
}

function ConfirmDialog (props: Props) {
  return (
    <dialog open>
      <div>{props.title}</div>
      <div>
        <button onClick={props.onYes}>Yes</button>
        <button onClick={props.onNo}>No</button>
        <button onClick={props.onCancel}>Cancel</button>
      </div>
    </dialog>
  )
}
```

When rendering with adapter mode, you establish the connection between the Promise and component callbacks via an
adapter function:

```tsx
import { render } from '@flow-render/solid'

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