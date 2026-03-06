/**
 * Retrieves the current theme from localStorage.
 * Defaults to 'dark' if no theme is set.
 */
export const getTheme = () => {
  let theme = localStorage.getItem('theme');

  // Set default if not exists
  if (!theme) {
    theme = 'dark';
    localStorage.setItem('theme', 'dark');
  }
  return theme;
};

/**
 * Applies the given theme to the document and saves it to localStorage.
 */
export const applyTheme = (theme) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('theme', theme);
};

export const toggleTheme = () => {
  const currentTheme = getTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
};