import type { ComponentProps } from '@flow-render/test-utils';

export function TestDialog (props: ComponentProps) {
  return (
    <dialog data-testid={props.name} open>
      {props.children}

      <button data-testid={props.yesId} onClick={() => props.resolve(props.yesId)}>
        Yes
      </button>

      <button data-testid={props.noId} onClick={() => props.resolve(props.noId)}>
        No
      </button>

      <button data-testid={props.cancelId} onClick={() => props.reject(props.cancelId)}>
        Cancel
      </button>
    </dialog>
  );
}
