import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Исправляем ошибку process is not defined
    'process.env': {},
  },
  resolve: {
    alias: {
      '@': '/src',
      'redaktus/frontend': '/src/components/redaktus/frontend.ts',
      'redaktus/core': '/src/components/redaktus/core.ts',
      'redaktus/types': '/src/components/redaktus/types-only.ts',
      'redaktus': '/src/components/redaktus/index.ts',
      'website': '/src/components/redaktus/website',
      'blog': '/src/components/redaktus/blog',
      // Next.js заглушки для совместимости (поскольку мы не в Next.js)
      'next/head': '/src/components/redaktus/next-shims/head.tsx',
      'next/link': '/src/components/redaktus/next-shims/link.tsx',
      'next/router': '/src/components/redaktus/next-shims/router.ts',
      'next/app': '/src/components/redaktus/next-shims/app.ts',
      'next/font/google': '/src/components/redaktus/next-shims/font.ts',
      'next-themes': '/src/components/redaktus/next-shims/themes.tsx',
    },
  },
  server: {
    port: 5177,
    host: true,
    hmr: {
      port: 5177,
      host: 'localhost',
    },
    watch: {
      usePolling: true,
      ignored: [
        '**/react-bricks-ui-source/**',
        '**/temp-inline-edit/**',
        '**/Upload/**',
        '**/node_modules/**'
      ]
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  optimizeDeps: {
    exclude: [
      'react-app-polyfill',
      '@reach/router',
      'react-bricks-ui'
    ]
  }
}) 