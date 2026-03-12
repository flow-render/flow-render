import { useRenderer, type RenderFunction } from '../../src';

export function TestLocalRenderer (props: {
  boxId: string;
  getRender: (render: RenderFunction) => void;
}) {
  const [render, Viewport] = useRenderer();

  props.getRender(render);

  return (
    <div data-testid={props.boxId}>
      <Viewport />
    </div>
  );
}
