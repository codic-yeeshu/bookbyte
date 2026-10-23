import { useEffect, useState } from 'react';
import {
  THEME_EVENT,
  applyTheme,
  getThemePreference,
  resolveTheme,
  setThemePreference,
  subscribeToSystemTheme,
} from '../utils/themeUtils';

const readState = () => {
  const preference = getThemePreference();
  return { preference, theme: resolveTheme(preference) };
};

export const useTheme = () => {
  const [state, setState] = useState(readState);

  useEffect(() => {
    const sync = () => setState(readState());
    const onSystemChange = () => {
      if (getThemePreference() === 'system') applyTheme('system');
      sync();
    };
    window.addEventListener(THEME_EVENT, sync);
    const unsubscribe = subscribeToSystemTheme(onSystemChange);
    return () => {
      window.removeEventListener(THEME_EVENT, sync);
      unsubscribe();
    };
  }, []);

  return {
    ...state,
    setPreference: setThemePreference,
    toggle: () => setThemePreference(state.theme === 'dark' ? 'light' : 'dark'),
  };
};
