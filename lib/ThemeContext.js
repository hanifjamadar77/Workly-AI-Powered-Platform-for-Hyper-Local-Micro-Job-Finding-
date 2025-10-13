// src/context/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { Appearance } from "react-native";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const colorScheme = Appearance.getColorScheme(); // system theme
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");

  useEffect(() => {
    const listener = ({ colorScheme }) => {
      setIsDarkMode(colorScheme === "dark");
    };
    const subscription = Appearance.addChangeListener(listener);
    return () => subscription.remove();
  }, []);

  const theme = {
    isDarkMode,
    colors: {
      background: isDarkMode ? "#0f172a" : "#ffffff",
      card: isDarkMode ? "#1e293b" : "#f8fafc",
      text: isDarkMode ? "#f8fafc" : "#1e293b",
      subtitle: isDarkMode ? "#cbd5e1" : "#64748b",
      border: isDarkMode ? "#334155" : "#e2e8f0",
      primary: "#6366f1",
    },
    toggleTheme: () => setIsDarkMode((prev) => !prev),
  };

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
