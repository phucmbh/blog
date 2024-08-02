import { createContext, useEffect, useState } from 'react';

const initialThemeContext = {
  theme: () => (darkthemePreference() ? 'dark' : 'light'),
  setTheme: () => null,
};

export const ThemeContext = createContext(initialThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(initialThemeContext.theme);
  useEffect(() => {
    if (theme) document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const darkthemePreference = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches;
