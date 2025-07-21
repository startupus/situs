import React, { createContext, useContext, useState } from 'react'

// next-themes shim
const ThemeContext = createContext({
  theme: 'light',
  setTheme: (theme: string) => {},
})

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState('light')
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)

export default { ThemeProvider, useTheme } 