import { render } from '../../src';
import FlowModal from './FlowModal.svelte';
import Modal from './Modal.svelte';

export async function openModal (message?: string) {
  const res = await render(Modal, (resolve, reject) => {
    return {
      onOk: () => resolve(),
      onCancel: reject,
      children: () => `Modal - ${ message || Math.random() }`,
    };
  });

  console.log(res);
}

export async function openFlowModal () {
  const res = await render(FlowModal, {
    children: () => `FlowModal - ${ Math.random() }`,
  });

  console.log(res);
}
