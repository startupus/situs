import { jsx as _jsx } from "react/jsx-runtime";
import { Redaktus } from 'redaktus/core';
import { useTheme } from '../../../hooks/useTheme';
import config from '../config/config';
const RedaktusApp = ({ Component, pageProps }) => {
    console.log('RedaktusApp render - Component:', Component, 'pageProps:', pageProps);
    const { resolvedTheme } = useTheme();
    console.log('RedaktusApp resolvedTheme:', resolvedTheme);
    const redaktusConfig = {
        ...config,
        isDarkColorMode: resolvedTheme === 'dark', // Используем тему из основного приложения
        contentClassName: `antialiased font-inter ${resolvedTheme === 'dark' ? 'dark bg-dark text-gray-1' : 'light bg-gray text-black'}`,
    };
    console.log('RedaktusApp redaktusConfig:', redaktusConfig);
    console.log('About to render Redaktus provider');
    return (_jsx(Redaktus, { ...redaktusConfig, children: (() => {
            console.log('Inside Redaktus provider - rendering Component');
            return _jsx(Component, { ...pageProps });
        })() }));
};
export default RedaktusApp;
//# sourceMappingURL=RedaktusApp.js.map