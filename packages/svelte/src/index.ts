import { renderToPromise, type RenderArgs, type ResolveValue, type StoreBase } from '@flow-render/shared';
import { resetStore } from '@flow-render/shared';
import type { Component } from 'svelte';
import { get, writable } from 'svelte/store';
// Since Svelte does not provide a stable component runtime API,
// Viewport need to be implemented using `.svelte` files.
import viewportRender from '../components/viewport.svelte';

export { isCancelError, type PromiseResolvers } from '@flow-render/shared';

export type RenderFunction = <P extends object, V = ResolveValue<P>> (type: Component<P, any>, ...props: RenderArgs<P, V>) => Promise<V>;

interface Node {
  key: number;
  component: Component<any, any>;
  props: object;
}

class Store<T> implements StoreBase<T> {
  nodes = writable<T[]>([]);

  get () {
    return get(this.nodes);
  }

  set (nodes: T[]) {
    this.nodes.set(nodes);
  }
}

export function createRenderer (): [render: RenderFunction, Viewport: Component<any, any>] {
  const store = new Store<Node>();

  let keyCount = 0;

  return [
    function render (type, propsOrAdapter?) {
      return renderToPromise(store, propsOrAdapter, (props) => {
        return {
          // @see https://svelte.dev/docs/svelte/each#Keyed-each-blocks
          key: keyCount++,
          component: type,
          props,
        };
      });
    },

    function Viewport (anchor) {
      return viewportRender(anchor, { store, resetStore });
    },
  ];
}

export const useRenderer = createRenderer;

export const [render, Viewport] = createRenderer();
