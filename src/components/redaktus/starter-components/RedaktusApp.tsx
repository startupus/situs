import { useEffect } from 'react';
import { Redaktus } from 'redaktus/core';
import { useTheme } from '../../../hooks/useTheme';

import config from '../config/config';

// Vite-совместимые типы
interface AppProps {
  Component: React.ComponentType<any>;
  pageProps: Record<string, any>;
}

const RedaktusApp = ({ Component, pageProps }: AppProps) => {
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

  return (
    <Redaktus {...redaktusConfig}>
      {(() => {
        console.log('Inside Redaktus provider - rendering Component');
        return <Component {...pageProps} />;
      })()}
    </Redaktus>
  );
};

export default RedaktusApp;
