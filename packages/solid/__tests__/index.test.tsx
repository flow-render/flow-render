import { testRunner } from '@flow-render/test-utils';
import { cleanup, render } from '@solidjs/testing-library';
import { render as flowRender, Viewport } from '../src';
import { TestContext, TestContextChild } from './components/test-context';
import { TestDialog } from './components/test-dialog';
import { TestLocalRenderer } from './components/test-local-renderer';

testRunner('solid', {
  render: (App, props) => render(() => <App {...props} />).unmount,
  act: (fn) => fn(),
  cleanup,

  defaultViewport: Viewport,
  defaultRender: flowRender,

  components: {
    TestDialog,
    TestContext,
    TestContextChild,
    TestLocalRenderer,
  },
});
