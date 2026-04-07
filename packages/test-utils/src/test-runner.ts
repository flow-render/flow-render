import '@testing-library/jest-dom';
import { isCancelError } from '@flow-render/shared';
import { screen } from '@testing-library/dom';
import { userEvent } from '@testing-library/user-event';
import { beforeEach, expect, test } from 'vitest';
import { createId } from './create-id';
import { createOpen, type OpenFlowCase, type RenderFunction } from './create-open';

export interface TestRunnerOptions {
  render: (App: any, props?: object) => () => any;
  act: (fn: () => Promise<any>) => Promise<any>;
  cleanup: () => void;

  defaultRender: any;
  defaultViewport: any;

  components: {
    TestDialog: any;
    TestContext: any;
    TestContextChild: any;
    TestLocalRenderer: any;
  };
}

function getError (a: OpenFlowCase) {
  return a.promise.catch((error) => error);
}

function sleep (ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function testRunner (framework: string, options: TestRunnerOptions) {
  beforeEach(() => {
    options.cleanup();
  });

  const open = createOpen({
    ...options,
    defaultComponent: options.components.TestDialog,
  });

  test('should support calling render before Viewport is mounted', async () => {
    const a = await open({});

    await sleep(100);

    options.render(options.defaultViewport);

    expect(a.container()).toBeInTheDocument();
  });

  test('should support context inheritance', async () => {
    const boxId = createId();

    options.render(options.components.TestContext);

    await options.act(async () => {
      options.defaultRender(options.components.TestContextChild, () => {
        return { boxId };
      }).catch(() => {
        // ignore
      });
    });

    const box = screen.queryByTestId(boxId)!;
    const changeBtn = screen.queryByText('change-theme')!;

    expect(box.textContent).toBe('light');

    await userEvent.click(changeBtn);
    expect(box.textContent).toBe('dark');

    await userEvent.click(changeBtn);
    expect(box.textContent).toBe('light');
  });

  test('Executor mode', async () => {
    options.render(options.defaultViewport);

    const start = async (test: (testCase: OpenFlowCase) => Promise<void>) => {
      const x = await open({});

      expect(x.container()).toBeInTheDocument();
      await test(x);
      expect(x.container()).toBeNull();
    };

    await start(async (a) => {
      await a.clickYes();
      expect(await a.promise).toBe(a.yesId);
    });

    await start(async (b) => {
      await b.clickNo();
      expect(await b.promise).toBe(b.noId);
    });

    await start(async (c) => {
      await c.clickCancel();
      expect(await getError(c)).toBe(c.cancelId);
    });
  });

  test('Adapter mode', async () => {
    options.render(options.defaultViewport);

    let resolvedValue: any;
    let rejectedReason: any;

    const start = async (test: (flow: OpenFlowCase) => Promise<void>) => {
      const t = await open({
        adapter: (resolve, reject) => {
          return {
            resolve: (value) => {
              resolvedValue = value;
              resolve(value);
            },
            reject: (reason) => {
              rejectedReason = reason;
              reject(reason);
            },
          };
        },
      });

      expect(t.container()).toBeInTheDocument();
      await test(t);
      expect(t.container()).toBeNull();
    };

    await start(async (a) => {
      expect(resolvedValue).toBeUndefined();
      await a.clickYes();
      expect(resolvedValue).toBe(a.yesId);
      expect(await a.promise).toBe(resolvedValue);
    });

    await start(async (b) => {
      expect(resolvedValue).toBeDefined();
      await b.clickNo();
      expect(resolvedValue).toBe(b.noId);
      expect(await b.promise).toBe(resolvedValue);
    });

    await start(async (c) => {
      expect(rejectedReason).toBeUndefined();
      await c.clickCancel();
      expect(rejectedReason).toBe(c.cancelId);
      expect(await getError(c)).toBe(rejectedReason);
    });
  });

  test('Exit delay', async () => {
    options.render(options.defaultViewport);

    const a = await open({
      renderOptions: {
        exitDelay: 1000,
      },
    });

    expect(a.container()).toBeInTheDocument();
    await a.clickYes();
    await sleep(500);
    expect(a.container()).toBeInTheDocument();
    await sleep(500);
    expect(a.container()).toBeNull();
  });

  test('should support rendering multiple instances simultaneously', async () => {
    options.render(options.defaultViewport);

    const [a, b, c] = await Promise.all([
      open({}),
      open({}),
      open({}),
    ]);

    expect(a.name).not.toBe(b.name);
    expect(a.name).not.toBe(c.name);
    expect(b.name).not.toBe(c.name);

    expect(a.container()).toBeInTheDocument();
    expect(b.container()).toBeInTheDocument();
    expect(c.container()).toBeInTheDocument();

    await a.clickYes();
    expect(a.container()).toBeNull();
    expect(b.container()).toBeInTheDocument();
    expect(c.container()).toBeInTheDocument();

    await b.clickNo();
    expect(a.container()).toBeNull();
    expect(b.container()).toBeNull();
    expect(c.container()).toBeInTheDocument();

    await c.clickCancel();
    expect(a.container()).toBeNull();
    expect(b.container()).toBeNull();
    expect(c.container()).toBeNull();

    expect(await a.promise).toBe(a.yesId);
    expect(await b.promise).toBe(b.noId);
    expect(await getError(c)).toBe(c.cancelId);
  });

  test('should auto-cancel pending Promise when Viewport is destroyed', async () => {
    const unmount = options.render(options.defaultViewport);

    const [a, b, c, d] = await Promise.all([
      open({}),
      open({}),
      open({}),
      open({}),
    ]);

    expect(a.container()).toBeInTheDocument();
    expect(b.container()).toBeInTheDocument();
    expect(c.container()).toBeInTheDocument();
    expect(d.container()).toBeInTheDocument();

    await a.clickYes();
    expect(a.container()).toBeNull();

    await b.clickCancel();
    expect(b.container()).toBeNull();

    unmount();

    expect(c.container()).toBeNull();
    expect(d.container()).toBeNull();

    expect(await a.promise).toBe(a.yesId);
    expect(await getError(b)).toBe(b.cancelId);

    expect(isCancelError(await getError(c))).toBe(true);
    expect(isCancelError(await getError(d))).toBe(true);

    //  rerender
    options.render(options.defaultViewport);

    expect(a.container()).toBeNull();
    expect(b.container()).toBeNull();
    expect(c.container()).toBeNull();
    expect(d.container()).toBeNull();

    const e = await open({});

    expect(e.container()).toBeInTheDocument();
  });

  test('should support custom local render position', async () => {
    const boxId = createId();

    let render!: RenderFunction;

    options.render(options.components.TestLocalRenderer, {
      boxId,
      getRender: (r: RenderFunction) => {
        render = r;
      },
    });

    const container = screen.queryByTestId(boxId);

    expect(container).toBeInTheDocument();

    const a = await open({
      render,
    });

    expect(a.container()).toBeInTheDocument();
    expect(a.container()?.parentElement).toBe(container);
  });
}
