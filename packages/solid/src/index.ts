import { mountStore, renderToPromise, unmountStore, type RenderArgs, type ResolveValue, type StoreBase } from '@flow-render/shared';
import { createComponent, createSignal, For, onCleanup, onMount, type Component, type JSXElement } from 'solid-js';

export { isCancelError, type PromiseResolvers, type RenderOptions } from '@flow-render/shared';

export type RenderFunction = <P extends object, V = ResolveValue<P>> (type: Component<P>, ...props: RenderArgs<P, V>) => Promise<V>;

type Node = () => JSXElement;

class Store<T> implements StoreBase<T> {
  signal = createSignal<T[]>([]);
  count = 0;

  get () {
    return this.signal[0]();
  }

  set (nodes: T[]) {
    this.signal[1](nodes);
  }
}

export function createRenderer (): [render: RenderFunction, Viewport: Component] {
  const store = new Store<Node>();

  return [
    function render (type, propsOrAdapter?, options?) {
      return renderToPromise(
        store,
        propsOrAdapter,
        (props) => () => createComponent(type, props),
        options,
      );
    },

    function Viewport () {
      onMount(() => {
        mountStore(store);
      });

      onCleanup(() => {
        unmountStore(store);
      });

      return createComponent(For, {
        get each () {
          return store.get();
        },
        children: (render: () => JSXElement) => render(),
      });
    },
  ];
}

export const useRenderer = createRenderer;

export const [render, Viewport] = createRenderer();
