import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
// next-themes shim
const ThemeContext = createContext({
    theme: 'light',
    setTheme: (theme) => { },
});
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');
    return (_jsx(ThemeContext.Provider, { value: { theme, setTheme }, children: children }));
};
export const useTheme = () => useContext(ThemeContext);
export default { ThemeProvider, useTheme };
//# sourceMappingURL=themes.js.map