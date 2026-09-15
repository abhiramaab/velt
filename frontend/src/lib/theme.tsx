"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    localStorage.removeItem("velt-theme");
    document.documentElement.classList.remove("dark");
    document.documentElement.style.backgroundColor = "#ffffff";
    document.documentElement.style.color = "#0f172a";
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: "light", toggle: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
