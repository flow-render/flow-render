<div align="center"><img src="assets/logo.svg" width="200"></div>

# Flow Render

English | [中文](./README-zh.md)

Flow Render provides a Promise-based UI rendering approach that allows you to **render components like calling
asynchronous functions and wait for user interaction results**.

It reorganizes scattered states, callbacks, and component hierarchies into a linear `async/await` control flow, making
complex interaction logic intuitive and easy to maintain.

```ts
const result = await render(Component)
```

---

## ✨ Features

- **Promise-driven UI rendering**: Wait for component results like calling async functions
- **Any component can be Promise-enabled**: New or existing components can be integrated without intrusive modifications
- **Centralized control flow**: Write interaction logic sequentially, avoiding scattered states and nested callbacks
- **Complete context inheritance**: Automatically preserves application context like theme, i18n, store
- **Isolated instances, destroyed after use**: Each render is an independent instance without interference, component
  state automatically resets
- **Supports global and local rendering**: Can be mounted at the app root or bound to local component lifecycle

---

## 📦 Framework Support

| Framework                   | Package                                             |
|-----------------------------|-----------------------------------------------------|
| [React](./packages/react)   | `@flow-render/react` *(also supports React Native)* |
| [Vue](./packages/vue)       | `@flow-render/vue`                                  |
| [Preact](./packages/preact) | `@flow-render/preact`                               |
| [Svelte](./packages/svelte) | `@flow-render/svelte`                               |
| [Solid](./packages/solid)   | `@flow-render/solid`                                |

---

## 🚀 Quick Start (React)

### Step 1: Install

```bash
npm i @flow-render/react
```

### Step 2: Mount the Viewport

Place a `<Viewport/>` at the root of your application. All dynamically rendered components will appear here.

```tsx
import { Viewport } from '@flow-render/react'

function App () {
  return (
    <>
      <YourApp/>
      <Viewport/> {/* Dynamic components are rendered here */}
    </>
  )
}
```

### Step 3: Define Components

Flow Render supports two ways to write components; you can choose based on your scenario.

#### Executor Mode (Recommended)

Components directly declare and use `resolve`/`reject` callbacks, similar to the `new Promise((resolve, reject) => ...)`
executor style.

```tsx
import { type PromiseResolvers } from '@flow-render/react'

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
import { render } from '@flow-render/react'

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
import { render } from '@flow-render/react'

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

## 📌 Lifecycle Explanation

By default, the lifecycle of dynamically rendered components from `render()` **does not follow the calling component**,
but follows the global `Viewport`.

This means:

- Even if the component that triggered the render is unmounted, the dynamic component can still exist
- Suitable for global modals, confirmation dialogs, selectors, async guided flows, etc.

If you want dynamic components to be automatically destroyed when the current page or component unmounts, use a **local
renderer**.

---

## Local Renderer

Using `useRenderer()` creates a local renderer **bound to the current component's lifecycle**.

Applicable scenarios:

- Page-level modals
- Interactions that need to be destroyed with a local area
- Custom rendering positions

```tsx
import { useRenderer } from '@flow-render/react'

function Page () {
  const [render, Viewport] = useRenderer()

  return (
    <div>
      <button onClick={() => render(ConfirmDialog)}>Open</button>
      <Viewport/>
    </div>
  )
}
```

When `Page` unmounts, any unfinished rendering tasks in the local renderer will also be terminated.

---

## Custom Renderer

When developing **component libraries** or **business subsystems**, you may want to expose your own rendering entry
point instead of having users depend on the default renderer. In this case, use `createRenderer()` to create an
independent instance.

```tsx
// your-lib/index.ts

import { createRenderer } from '@flow-render/react'

const [render, Viewport] = createRenderer()

export function LibProvider (props) {
  return (
    <>
      {props.children}
      <Viewport/>
    </>
  )
}

export function openDialog () {
  return render(Dialog)
}
```

Then, users only need to use the Provider and corresponding methods provided by your library, without any knowledge of
Flow Render's internals:

```tsx
import { LibProvider, openDialog } from 'your-lib'

function App () {
  return (
    <LibProvider>
      <UserApp/>
      <button onClick={() => openDialog()}>Open</button>
    </LibProvider>
  )
}
```

This encapsulates the rendering capability inside the library, providing a more stable and unified API externally.

---

## Exit Animation Support

By default, the component node is immediately removed from the DOM when `resolve` / `reject` is called, preventing exit
animations from playing. Use the `exitDelay` option to delay the removal and allow exit animations to complete.

```tsx
const result = await render(Component, null, {
  exitDelay: 350
})
```

- `exitDelay` only delays DOM removal, not the Promise's resolve/reject
- The delay duration may not exactly match the actual animation duration. If the animation duration changes dynamically,
  it's recommended to set a large enough buffer value (e.g., animation duration + 50ms)

---

## Cancelling Rendering

### Manual Cancellation

In some advanced scenarios, you may need to interrupt the UI flow externally, for example:

- Auto-close on timeout
- Terminate on route change
- User actively cancels the entire flow

Since `render()` returns a standard Promise, you can expose cancellation capability through the adapter:

```tsx
let cancel: () => void

const promise = render(Component, (resolve, reject) => {
  cancel = () => reject(new Error('Cancelled'))

  return {
    resolve,
    reject,
  }
})

// Call when needed
cancel()
```

### Automatic Cancellation

When a `Viewport` unmounts (e.g., global Viewport destroyed with the app, or local Viewport destroyed with its
component), all unfinished rendering tasks will be automatically rejected. If necessary, you can use `isCancelError` to
determine whether an error was caused by automatic cancellation.

```tsx
import { render, isCancelError } from '@flow-render/react'

try {
  await render(Component)
} catch (error) {
  if (isCancelError(error)) {
    // Handle automatic cancellation
    return
  }

  throw error
}
```

---

## Use Cases

Flow Render is particularly suitable for the following interactions:

- Confirmation dialogs / Alert boxes
- Form modals
- Selectors
- Guided workflows
- Login interception
- Permission confirmation
- Any UI logic that requires "waiting for the user to complete a step before continuing"

For example, you can write previously scattered interactions as a linear flow:

```tsx
async function postForm () {
  // Step 1: Confirmation
  const confirmed = await render(ConfirmDialog, {
    title: 'Confirm submission?'
  })

  if (!confirmed) {
    return
  }

  // Step 2: Fill form
  const formData = await render(FormDialog)

  // Step 3: Submit
  await submit(formData)
}
```

Compared to traditional state-driven approaches, this method is easier to read, reuse, and maintain.

---

## Design Philosophy

Flow Render is not meant to replace the existing component model of frameworks, but rather to provide a more natural
expression for **asynchronous UI interaction flows**:

1. Dynamically render on demand
2. Display UI and wait for user operations
3. Continue later logic after getting results

These steps can be organized within the same `async/await` code block.

For interactions that cross components, hierarchies, and flows, this approach is often more intuitive.

---

## 📄 License

MIT © shixianqin