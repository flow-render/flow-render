import { getKey, renderToPromise, type RenderArgs, type ResolveValue, type StoreBase } from '@flow-render/shared';
import { mountStore, unmountStore } from '@flow-render/shared';
import type { Component } from 'svelte';
// Since Svelte does not provide a stable component runtime API,
// Viewport needs to be implemented using `.svelte` files.
import viewportRender from '../components/viewport.svelte';

export { isCancelError, type PromiseResolvers, type RenderOptions } from '@flow-render/shared';

export type RenderFunction = <P extends object, V = ResolveValue<P>> (type: Component<P, any>, ...props: RenderArgs<P, V>) => Promise<V>;

interface Node {
  key: number;
  component: Component<any, any>;
  props: object;
}

class Store<T> implements StoreBase<T> {
  subs = new Set<(nodes: T[]) => void>();
  nodes: T[] = [];
  count = 0;

  sub (fn: (nodes: T[]) => void) {
    this.subs.add(fn);
    mountStore(this);

    return () => {
      this.subs.delete(fn);
      unmountStore(this);
    };
  }

  get () {
    return this.nodes;
  }

  set (nodes: T[]) {
    this.nodes = nodes;

    for (const sub of this.subs) {
      sub(nodes);
    }
  }
}

export function createRenderer (): [render: RenderFunction, Viewport: Component<any, any>] {
  const store = new Store<Node>();

  return [
    function render (type, propsOrAdapter?, options?) {
      return renderToPromise(
        store,
        propsOrAdapter,
        (props) => {
          return {
          // @see https://svelte.dev/docs/svelte/each#Keyed-each-blocks
            key: getKey(),
            component: type,
            props,
          };
        },
        options,
      );
    },

    function Viewport (anchor) {
      return viewportRender(anchor, { store });
    },
  ];
}

export const useRenderer = createRenderer;

export const [render, Viewport] = createRenderer();
