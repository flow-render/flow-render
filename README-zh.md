# Flow Render

[English](./README.md) | 中文

Flow Render 提供了一种基于 Promise 的 UI 渲染方式，让你可以**像调用异步函数一样渲染组件，并等待用户交互结果**。

它将分散的状态、回调和组件层级重新组织为线性的 async/await 控制流，让复杂的交互逻辑变得直观且易于维护。

```ts
const result = await render(Component)
```

---

## ✨ 核心特性

- **Promise 驱动的 UI 渲染**：像调用异步函数一样等待组件的结果
- **支持任意组件 Promise 化**：新组件或现有组件都能接入，无需侵入式改造
- **控制流集中管理**：交互逻辑按顺序书写，避免状态分散和回调嵌套
- **支持上下文完整继承**：继承 theme、i18n、store 等应用上下文
- **实例隔离，用完即销毁**：每次渲染都是独立实例，互不干扰，组件状态自动重置
- **支持全局与局部渲染**：既可挂载在应用根节点，也可绑定到局部组件生命周期

---

## 📦 支持的框架

| 框架                          | 包名                                        |
|-----------------------------|-------------------------------------------|
| [React](./packages/react)   | `@flow-render/react` *(也支持 React Native)* |
| [Vue](./packages/vue)       | `@flow-render/vue`                        |
| [Preact](./packages/preact) | `@flow-render/preact`                     |
| [Svelte](./packages/svelte) | `@flow-render/svelte`                     |
| [Solid](./packages/solid)   | `@flow-render/solid`                      |

---

## 🚀 快速开始（React）

### 第一步：安装

```bash
npm i @flow-render/react
```

### 第二部：挂载容器

在应用根节点放一个 `<Viewport/>`，所有动态渲染的组件都会出现在这里。

```tsx
import { Viewport } from '@flow-render/react'

function App () {
  return (
    <>
      <YourApp/>
      <Viewport/> {/* 动态组件都渲染在这里 */}
    </>
  )
}
```

### 第三步：定义组件

Flow Render 支持两种编写组件的模式，你可以根据场景自由选择。

#### 执行器模式（推荐）

组件内部直接声明并使用 `resolve / reject` 回调，类似 `new Promise((resolve, reject)=>...)` 的执行器风格。

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
        <button onClick={() => resolve(true)}>是</button>
        <button onClick={() => resolve(false)}>否</button>
        <button onClick={() => reject(new Error('取消'))}>取消</button>
      </div>
    </dialog>
  )
}
```

渲染时自动注入回调：

```tsx
import { render } from '@flow-render/react'

const result = await render(ConfirmDialog, {
  title: '你确定吗？'
})
```

#### 适配器模式（灵活强大）

适配器模式让你可以将任意组件的 props 与 Promise 动态关联。你只需提供一个函数，该函数接收 resolve 和 reject，并返回组件的
props。这种方式不仅兼容现有组件，还能实现更复杂的逻辑，例如根据外部数据决定 props、条件渲染、动态绑定等。

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
        <button onClick={props.onYes}>是</button>
        <button onClick={props.onNo}>否</button>
        <button onClick={props.onCancel}>取消</button>
      </div>
    </dialog>
  )
}
```

适配器模式渲染时，可以通过适配器函数建立 Promise 与组件回调的关联：

```tsx
import { render } from '@flow-render/react'

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

## 全局渲染器（默认）

默认情况下，`render()` 渲染出的动态组件生命周期**不跟随调用它的组件**，而是跟随全局 `Viewport`。

这意味着：

- 即使触发渲染的组件已卸载，动态组件仍可继续存在
- 适合全局弹窗、确认框、选择器、异步引导流程等场景

若希望动态组件在当前页面或当前组件卸载时自动销毁，请使用**局部渲染器**。

---

## 局部渲染器

使用 `useRenderer()` 可以创建一个**与当前组件生命周期绑定**的局部渲染器。

适用场景：

- 页面级弹窗
- 需跟随局部区域销毁的交互
- 希望自定义渲染位置

```tsx
import { useRenderer } from '@flow-render/react'

function Page () {
  const [render, Viewport] = useRenderer()

  return (
    <div>
      <button onClick={() => render(ConfirmDialog)}>打开</button>
      <Viewport/>
    </div>
  )
}
```

当 `Page` 卸载时，局部渲染器中未完成的渲染任务也会一并结束。

---

## 自定义渲染器

开发**组件库**或**业务子系统**时，你可能希望对外暴露自己的渲染入口，而不是让用户依赖默认渲染器。此时可使用
`createRenderer()` 创建独立实例。

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

这样用户使用时只需接入库提供的 Provider 和对应的方法，无需了解关于 Flow Render 的任何逻辑：

```tsx
import { LibProvider, openDialog } from 'your-lib'

function App () {
  return (
    <LibProvider>
      <UserApp/>
      <button onClick={() => openDialog()}>打开</button>
    </LibProvider>
  )
}
```

这样便将渲染能力封装在库内部，对外提供更稳定、统一的 API。

---

## 取消渲染

### 手动取消渲染

某些高级场景下，你可能需要从外部中断 UI 流程，例如：

- 超时自动关闭
- 路由切换时终止
- 用户主动取消整个流程

由于 `render()` 返回标准 Promise，你可以在适配器中自行暴露取消能力：

```tsx
let cancel: () => void

const promise = render(Component, (resolve, reject) => {
  cancel = () => reject(new Error('Cancelled'))

  return {
    resolve,
    reject,
  }
})

// 需要时调用
cancel()
```

### 自动取消渲染

当 `Viewport` 卸载时（例如全局 Viewport 随应用销毁，或局部 Viewport 随组件销毁），所有未完成的渲染任务会自动 reject。如有必要可以通过
`isCancelError` 判断错误是否由自动取消引起。

```tsx
import { render, isCancelError } from '@flow-render/react'

try {
  await render(Component)
} catch (error) {
  if (isCancelError(error)) {
    // 处理自动取消
    return
  }

  throw error
}
```

---

## 适用场景

Flow Render 特别适合以下交互：

- 确认框 / 提示框
- 表单弹窗
- 选择器
- 向导流程
- 登录拦截
- 权限确认
- 任何需要“等待用户完成某一步再继续”的 UI 逻辑

例如，你可以将原本分散的交互写成线性流程：

```tsx
async function postForm () {
  // 第一步：确认
  const confirmed = await render(ConfirmDialog, {
    title: '确认提交？'
  })

  if (!confirmed) {
    return
  }

  // 第二步：填写表单
  const formData = await render(FormDialog)

  // 第三步：提交
  await submit(formData)
}
```

相比传统的状态驱动写法，这种方式更易阅读、复用和维护。

---

## 设计理念

Flow Render 并非要替代框架原有的组件模型，而是为**异步 UI 交互流程**提供更自然的表达方式：

1. 按需动态渲染
2. 展示 UI 并等待用户操作
3. 获取结果后继续后续逻辑

这几件事可以组织在同一段 `async / await` 代码中。

对于跨组件、跨层级、跨流程的交互，这种写法往往更直观。

---

## 📄 许可证

MIT © shixianqin
