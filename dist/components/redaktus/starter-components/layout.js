import { jsx as _jsx } from "react/jsx-runtime";
import { Nunito_Sans } from 'next/font/google';
import { useTheme } from '../../../hooks/useTheme';
const nunito = Nunito_Sans({
    adjustFontFallback: false,
    subsets: ['latin'],
    display: 'swap',
    weight: ['300', '400', '600', '700', '800', '900'],
    style: ['normal', 'italic'],
    variable: '--font-nunito',
});
const Layout = ({ children }) => {
    const { resolvedTheme } = useTheme();
    return (_jsx("div", { className: `flex flex-col h-screen justify-between font-sans antialiased`, children: _jsx("main", { className: `mb-auto transition-colors duration-200 ${resolvedTheme === 'dark' ? '!bg-gray-900' : '!bg-white'}`, children: children }) }));
};
export default Layout;
//# sourceMappingURL=layout.js.map