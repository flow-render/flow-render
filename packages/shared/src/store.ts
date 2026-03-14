import { cancelByNode } from './cancel';

export interface StoreBase<T> {
  count: number;
  get: () => T[];
  set: (nodes: T[]) => void;
}

export function mountStore (store: StoreBase<any>) {
  store.count++;
}

export function unmountStore (store: StoreBase<any>) {
  if (--store.count === 0) {
    const nodes = store.get();

    if (nodes.length > 0) {
      for (const node of nodes) {
        cancelByNode(node);
      }

      store.set([]);
    }
  }
}
