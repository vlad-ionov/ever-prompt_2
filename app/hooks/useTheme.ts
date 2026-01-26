import { useThemeContext } from "../contexts/ThemeContext";

export function useTheme() {
  const { isDarkMode, toggleTheme, setTheme } = useThemeContext();

  return {
    isDarkMode,
    toggleDarkMode: toggleTheme,
    setDarkMode: (dark: boolean) => setTheme(dark ? "dark" : "light")
  };
}
