import { mountStore, renderToPromise, unmountStore, type RenderArgs, type ResolveValue, type StoreBase } from '@flow-render/shared';
import {
  createElement,
  useEffect,
  useRef,
  useSyncExternalStore,
  type ComponentType,
  type FunctionComponent,
  type ReactElement,
} from 'react';

export { isCancelError, type PromiseResolvers } from '@flow-render/shared';

export type RenderFunction = <P extends object, V = ResolveValue<P>> (type: ComponentType<P>, ...props: RenderArgs<P, V>) => Promise<V>;

class Store<T> implements StoreBase<T> {
  fns = new Set<() => void>();
  nodes: T[] = [];
  count = 0;

  sub = (fn: () => void) => {
    this.fns.add(fn);

    return () => {
      this.fns.delete(fn);
    };
  };

  get = () => this.nodes;

  set (nodes: T[]) {
    this.nodes = nodes;

    for (const fn of this.fns) {
      fn();
    }
  }
}

export function createRenderer (): [render: RenderFunction, Viewport: FunctionComponent] {
  const store = new Store<ReactElement>();

  let keyCount = 0;

  return [
    function render (type, propsOrAdapter?) {
      return renderToPromise(store, propsOrAdapter, (props) => {
        // @ts-expect-error Keyed
        // @see https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key
        props.key = keyCount++;

        return createElement(type, props);
      });
    },

    function Viewport () {
      useEffect(() => {
        mountStore(store);

        return () => {
          // Delay reset to avoid React 18+ StrictMode's fake mount→cleanup→mount cycle
          queueMicrotask(() => {
            unmountStore(store);
          });
        };
      }, []);

      return useSyncExternalStore(store.sub, store.get);
    },
  ];
}

export function useRenderer () {
  const ref = useRef<null | ReturnType<typeof createRenderer>>(null);

  return ref.current || (ref.current = createRenderer());
}

export const [render, Viewport] = createRenderer();
