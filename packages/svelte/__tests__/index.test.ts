import { testRunner } from '@flow-render/test-utils';
import { act, cleanup, render } from '@testing-library/svelte';
import { render as flowRender, Viewport } from '../src';
import TestContextChild from './components/test-context-child.svelte';
import TestContext from './components/test-context.svelte';
import TestDialog from './components/test-dialog.svelte';
import TestLocalRenderer from './components/test-local-renderer.svelte';

testRunner('svelte', {
  render: (App, props) => render(App, { props }).unmount,
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
