import { testRunner } from '@flow-render/test-utils';
import { cleanup, render } from '@testing-library/vue';
import { render as flowRender, Viewport } from '../src';
import TestContextChild from './components/test-context-child.vue';
import TestContext from './components/test-context.vue';
import TestDialog from './components/test-dialog.vue';
import TestLocalRenderer from './components/test-local-renderer.vue';

testRunner('vue', {
  render: (App, props) => render(App, { props }).unmount,
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
