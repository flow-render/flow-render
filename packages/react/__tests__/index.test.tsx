import { testRunner } from '@flow-render/test-utils';
import { act, cleanup, render } from '@testing-library/react';
import React, { StrictMode } from 'react';
import { render as flowRender, Viewport } from '../src';
import { TestContext, TestContextChild } from './components/test-context';
import { TestDialog } from './components/test-dialog';
import { TestLocalRenderer } from './components/test-local-renderer';

testRunner('react', {
  render: (App, props) => render(<StrictMode><App {...props} /></StrictMode>).unmount,
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
