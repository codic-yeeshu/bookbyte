/**
 * Theme preference: 'light' | 'dark' | 'system'.
 * 'system' is stored as "no key" so first-time visitors follow the OS setting.
 * The inline script in index.html applies the same logic before first paint.
 */
const STORAGE_KEY = 'bb-theme';
export const THEME_EVENT = 'bb-theme-change';

const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)');

export const getThemePreference = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'light' || saved === 'dark' ? saved : 'system';
  } catch {
    return 'system';
  }
};

export const resolveTheme = (preference) => {
  if (preference === 'system') return darkQuery().matches ? 'dark' : 'light';
  return preference;
};

export const applyTheme = (preference = getThemePreference()) => {
  document.documentElement.dataset.theme = resolveTheme(preference);
};

export const setThemePreference = (preference) => {
  try {
    if (preference === 'system') localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, preference);
  } catch {
    // storage blocked — the choice just won't persist
  }
  applyTheme(preference);
  window.dispatchEvent(new Event(THEME_EVENT));
};

export const subscribeToSystemTheme = (callback) => {
  const query = darkQuery();
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
};
