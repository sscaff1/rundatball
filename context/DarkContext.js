import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const DarkModeContext = createContext(false);

const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((d) => !d);
  }, []);

  const value = useMemo(
    () => ({
      darkMode,
      toggleDarkMode,
    }),
    [darkMode, toggleDarkMode],
  );
  return <DarkModeContext.Provider value={value}>{children}</DarkModeContext.Provider>;
};

const useDarkMode = () => useContext(DarkModeContext);

export { DarkModeProvider, useDarkMode };

export default DarkModeContext;
