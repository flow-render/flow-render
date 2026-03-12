import { renderToPromise, resetStore, type ResolveValue, type StoreBase } from '@flow-render/shared';
import { h, onUnmounted, shallowRef, type Component, type VNode } from 'vue';
import type { RenderArgs } from './types';

export { isCancelError, type PromiseResolvers } from '@flow-render/shared';

export type RenderFunction = <T extends object, V = ResolveValue<T>> (type: Component<T>, ...props: RenderArgs<T, V>) => Promise<V>;

class Store<T> implements StoreBase<T> {
  ref = shallowRef<T[]>([]);

  get () {
    return this.ref.value;
  }

  set (nodes: T[]) {
    this.ref.value = nodes;
  }
}

export function createRenderer (): [render: RenderFunction, Viewport: Component] {
  const store = new Store<VNode>();

  let keyCount = 0;

  return [
    function render (type, propsOrAdapter?) {
      return renderToPromise(store, propsOrAdapter, (propsWithChildren) => {
        const { children, ...props } = propsWithChildren;

        // @ts-expect-error Keyed
        // @see https://vuejs.org/guide/essentials/list#maintaining-state-with-key
        props.key = keyCount++;

        return h(type, props as any, children);
      });
    },

    {
      name: 'Viewport',
      setup () {
        onUnmounted(() => {
          resetStore(store);
        });

        return () => store.get();
      },
    },
  ];
}

export const useRenderer = createRenderer;

export const [render, Viewport] = createRenderer();
