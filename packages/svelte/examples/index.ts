import { mount } from 'svelte';
import App from './components/App.svelte';
import { openModal } from './components/open';

openModal('Open before <App/> render');

const app = mount(
  App,
  {
    target: document.querySelector('#app')!,
  },
);

export default app;
