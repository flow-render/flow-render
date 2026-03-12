import { cancelByNode } from './cancel';

export interface StoreBase<T> {
  get: () => T[];
  set: (nodes: T[]) => void;
}

export function resetStore (store: StoreBase<any>) {
  const nodes = store.get();

  if (nodes.length > 0) {
    for (const node of nodes) {
      cancelByNode(node);
    }

    store.set([]);
  }
}
