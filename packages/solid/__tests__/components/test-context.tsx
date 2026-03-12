import { createContext, createSignal, useContext } from 'solid-js';
import { Viewport } from '../../src';

interface ContextValue {
  theme: () => string;
}

const ThemeContext = createContext<ContextValue>();

export function TestContext () {
  const [theme, setTheme] = createSignal('light');

  return (
    <ThemeContext.Provider value={{ theme }}>
      <button onClick={() => setTheme(theme() === 'light' ? 'dark' : 'light')}>
        change-theme
      </button>

      <Viewport />
    </ThemeContext.Provider>
  );
}

export function TestContextChild (props: { boxId: string }) {
  const { theme } = useContext(ThemeContext)!;

  return (
    <div data-testid={props.boxId}>
      {theme()}
    </div>
  );
}
