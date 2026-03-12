import { createContext, useContext, useState } from 'react';
import { Viewport } from '../../src';

const ThemeContext = createContext('');

export function TestContext () {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={theme}>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        change-theme
      </button>

      <Viewport />
    </ThemeContext.Provider>
  );
}

export function TestContextChild (props: { boxId: string }) {
  return (
    <div data-testid={props.boxId}>
      {useContext(ThemeContext)}
    </div>
  );
}
