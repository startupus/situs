import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EditorThemeContextType {
  isEditorDarkMode: boolean;
  toggleEditorTheme: () => void;
  setEditorTheme: (isDark: boolean) => void;
}

const EditorThemeContext = createContext<EditorThemeContextType | undefined>(undefined);

interface EditorThemeProviderProps {
  children: ReactNode;
}

export const EditorThemeProvider: React.FC<EditorThemeProviderProps> = ({ children }) => {
  const [isEditorDarkMode, setIsEditorDarkMode] = useState(false);

  const toggleEditorTheme = () => {
    console.log('🎨 EditorThemeProvider: toggleEditorTheme called, current:', isEditorDarkMode);
    setIsEditorDarkMode(prev => {
      const newValue = !prev;
      console.log('🎨 EditorThemeProvider: theme changed to:', newValue);
      return newValue;
    });
  };

  const setEditorTheme = (isDark: boolean) => {
    console.log('🎨 EditorThemeProvider: setEditorTheme called with:', isDark);
    setIsEditorDarkMode(isDark);
  };

  console.log('🎨 EditorThemeProvider: rendering with isEditorDarkMode:', isEditorDarkMode);

  return (
    <EditorThemeContext.Provider value={{
      isEditorDarkMode,
      toggleEditorTheme,
      setEditorTheme
    }}>
      {children}
    </EditorThemeContext.Provider>
  );
};

export const useEditorTheme = (): EditorThemeContextType => {
  const context = useContext(EditorThemeContext);
  if (context === undefined) {
    throw new Error('useEditorTheme must be used within an EditorThemeProvider');
  }
  console.log('🎨 useEditorTheme: returning context with isEditorDarkMode:', context.isEditorDarkMode);
  return context;
}; 