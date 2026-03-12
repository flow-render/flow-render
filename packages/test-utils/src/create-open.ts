import type { PromiseResolvers, PropsAdapter, RenderArgs } from '@flow-render/shared';
import { screen } from '@testing-library/dom';
import { userEvent } from '@testing-library/user-event';
import { createId } from './create-id';

export type RenderFunction = (type: any, ...props: RenderArgs<any>) => Promise<any>;

export type OpenFlowCase = Awaited<ReturnType<ReturnType<typeof createOpen>>>;

export interface CreateOpenOptions {
  defaultRender: RenderFunction;
  defaultComponent: unknown;
  act?: (cb: () => any) => Promise<any>;
}

export interface OpenOptions {
  render?: RenderFunction;
  component?: unknown;
  adapter?: PropsAdapter<PromiseResolvers<string>>;
  children?: unknown;
}

export interface ComponentPropsBase {
  name: string;
  yesId: string;
  noId: string;
  cancelId: string;
  children?: any;
}

export interface ComponentProps extends ComponentPropsBase, PromiseResolvers<string> {
}

export function createOpen (initOptions: CreateOpenOptions) {
  const act = initOptions.act || ((fn) => fn());

  return async (options: OpenOptions) => {
    const name = createId();
    const yesId = `${ name }-yes`;
    const noId = `${ name }-no`;
    const cancelId = `${ name }-cancel`;
    const render = options.render || initOptions.defaultRender;
    const component = options.component || initOptions.defaultComponent;

    const base: ComponentPropsBase = {
      name,
      yesId,
      noId,
      cancelId,
      children: options.children,
    };

    let promise!: Promise<string>;

    await act(() => {
      promise = render(
        component,
        options.adapter
          ? (resolve, reject) => {
            return {
              ...base,
              ...options.adapter!(resolve, reject),
            };
          }
          : base,
      );
    });

    promise.catch(() => {
      // ignore unhandled errors
    });

    return {
      name,
      yesId,
      noId,
      cancelId,
      promise,
      container: () => screen.queryByTestId(name),
      clickYes: () => userEvent.click(screen.queryByTestId(yesId)!),
      clickNo: () => userEvent.click(screen.queryByTestId(noId)!),
      clickCancel: () => userEvent.click(screen.queryByTestId(cancelId)!),
    };
  };
}
