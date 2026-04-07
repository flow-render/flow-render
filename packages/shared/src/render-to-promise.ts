import { CANCEL_MAP } from './cancel';
import type { StoreBase } from './store';
import type { OmitResolvers, PropsAdapter, RenderOptions, ResolveFunction } from './types';

export function renderToPromise<Props extends object, Value, Node> (
  store: StoreBase<Node>,
  propsOrAdapter: null | undefined | OmitResolvers<Props> | PropsAdapter<Props, Value>,
  factory: (props: Props) => Node,
  options?: RenderOptions,
): Promise<Value> {
  let node!: Node;
  let isCancelled: undefined | boolean;
  let exitDelayTimer: undefined | ReturnType<typeof setTimeout>;

  const promise = new Promise<Value>((resolve, reject) => {
    node = factory(
      typeof propsOrAdapter === 'function'
        ? propsOrAdapter(resolve as ResolveFunction<Value>, reject)
        : { ...propsOrAdapter, resolve, reject } as Props,
    );

    store.set([...store.get(), node]);

    CANCEL_MAP.set(node, (error) => {
      isCancelled = true;
      reject(error);
      clearTimeout(exitDelayTimer);
    });
  });

  return promise.finally(() => {
    CANCEL_MAP.delete(node);

    if (isCancelled) {
      return;
    }

    const removeNode = () => {
      store.set(store.get().filter((item) => item !== node));
    };

    if (options?.exitDelay) {
      exitDelayTimer = setTimeout(removeNode, options.exitDelay);
    }
    else {
      removeNode();
    }
  });
}
