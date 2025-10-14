import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
  colors: {},
});

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("isDarkMode");
      if (savedTheme !== null) setIsDarkMode(JSON.parse(savedTheme));
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    setIsDarkMode((prev) => {
      AsyncStorage.setItem("isDarkMode", JSON.stringify(!prev));
      return !prev;
    });
  };

  const colors = {
    background: isDarkMode ? "#1F2937" : "#FFFFFF",
    card: isDarkMode ? "#374151" : "#FFFFFF",
    text: isDarkMode ? "#F3F4F6" : "#1F2937",
    subtitle: isDarkMode ? "#D1D5DB" : "#6B7280",
    primary: "#6366F1",
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
