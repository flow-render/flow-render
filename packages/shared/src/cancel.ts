export type CancelCallback = (reason: CancelError) => void;

export const CANCEL_MAP = new WeakMap<any, CancelCallback>();

export class CancelError extends Error {
  constructor (message?: string) {
    super(message);
    this.name = 'CancelError';
  }
}

// export function cancel (promise: Promise<any>) {
//   CANCEL_MAP.get(promise)?.(new CancelError('Flow render was cancelled manually.'));
// }

export function cancelByNode (node: any) {
  CANCEL_MAP.get(node)?.(new CancelError('Flow render was cancelled because its Viewport component was unmounted.'));
}

export function isCancelError (error: any): error is CancelError {
  return error instanceof CancelError;
}
