"use client"

import type * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: string
  initialTheme?: string
}

type ThemeProviderState = {
  theme: string
  setTheme: (theme: string) => void
}

const initialState: ThemeProviderState = {
  theme: "orange",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "orange",
  initialTheme
}: ThemeProviderProps) {
  const [theme, setTheme] = useState(initialTheme || defaultTheme)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || defaultTheme
    if (savedTheme !== theme) {
      setTheme(savedTheme)
      document.documentElement.classList.remove(`theme-${theme}`)
      document.documentElement.classList.add(`theme-${savedTheme}`)
    }
  }, [defaultTheme, theme])

  const value = {
    theme,
    setTheme: (newTheme: string) => {
      document.documentElement.classList.remove(`theme-${theme}`)
      document.documentElement.classList.add(`theme-${newTheme}`)
      localStorage.setItem("theme", newTheme)
      setTheme(newTheme)
    },
  }

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}

