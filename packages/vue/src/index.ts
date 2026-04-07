import {
  getKey,
  mountStore,
  renderToPromise,
  unmountStore,
  type ResolveValue,
  type StoreBase,
} from '@flow-render/shared';
import { h, onMounted, onUnmounted, shallowRef, type Component, type VNode } from 'vue';
import type { RenderArgs } from './types';

export { isCancelError, type PromiseResolvers, type RenderOptions } from '@flow-render/shared';

export type RenderFunction = <T extends object, V = ResolveValue<T>> (type: Component<T>, ...props: RenderArgs<T, V>) => Promise<V>;

class Store<T> implements StoreBase<T> {
  ref = shallowRef<T[]>([]);
  count = 0;

  get () {
    return this.ref.value;
  }

  set (nodes: T[]) {
    this.ref.value = nodes;
  }
}

export function createRenderer (): [render: RenderFunction, Viewport: Component] {
  const store = new Store<VNode>();

  return [
    function render (type, propsOrAdapter?, options?) {
      return renderToPromise(
        store,
        propsOrAdapter,
        (propsWithChildren) => {
          const { children, ...props } = propsWithChildren;

          // @ts-expect-error Keyed
          // @see https://vuejs.org/guide/essentials/list#maintaining-state-with-key
          props.key = getKey();

          return h(type, props as any, children);
        },
        options,
      );
    },

    {
      name: 'Viewport',
      setup () {
        onMounted(() => {
          mountStore(store);
        });

        onUnmounted(() => {
          unmountStore(store);
        });

        return () => store.get();
      },
    },
  ];
}

export const useRenderer = createRenderer;

export const [render, Viewport] = createRenderer();
