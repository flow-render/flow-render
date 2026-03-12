import { renderToPromise, resetStore, type RenderArgs, type ResolveValue, type StoreBase } from '@flow-render/shared';
import { h, type ComponentType, type FunctionComponent, type VNode } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';

export { isCancelError, type PromiseResolvers } from '@flow-render/shared';

export type RenderFunction = <P extends object, V = ResolveValue<P>> (type: ComponentType<P>, ...props: RenderArgs<P, V>) => Promise<V>;

class Store<T> implements StoreBase<T> {
  fns = new Set<(nodes: T[]) => void>();
  nodes: T[] = [];

  sub (fn: (nodes: T[]) => void) {
    this.fns.add(fn);

    return () => {
      this.fns.delete(fn);
      resetStore(this);
    };
  }

  get () {
    return this.nodes;
  }

  set (nodes: T[]) {
    this.nodes = nodes;

    for (const fn of this.fns) {
      fn(nodes);
    }
  }
}

export function createRenderer (): [render: RenderFunction, Viewport: FunctionComponent] {
  const store = new Store<VNode<any>>();

  let keyCount = 0;

  return [
    function render (type, propsOrAdapter?) {
      return renderToPromise(store, propsOrAdapter, (props) => {
        // @ts-expect-error Keyed
        // @see https://preactjs.com/tutorial/08-keys/
        props.key = keyCount++;

        return h(type, props);
      });
    },

    function Viewport () {
      const [nodes, setNodes] = useState(store.nodes);

      useEffect(() => store.sub(setNodes), []);

      return nodes;
    },
  ];
}

export function useRenderer () {
  const ref = useRef<null | ReturnType<typeof createRenderer>>(null);

  return ref.current || (ref.current = createRenderer());
}

export const [render, Viewport] = createRenderer();
