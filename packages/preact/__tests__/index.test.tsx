import { testRunner } from '@flow-render/test-utils';
import { act, cleanup, render } from '@testing-library/preact';
import { render as flowRender, Viewport } from '../src';
import { TestContext, TestContextChild } from './components/test-context';
import { TestDialog } from './components/test-dialog';
import { TestLocalRenderer } from './components/test-local-renderer';

testRunner('preact', {
  render: (App, props) => render(<App {...props} />).unmount,
  act,
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
