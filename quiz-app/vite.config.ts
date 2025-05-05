import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    // Update this to match your GitHub Pages URL structure
    base: mode === 'production' 
      ? '/etainkiely-com/quiz-app/' 
      : '/',
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: mode !== 'production',
    },
    server: {
      port: 3000,
      open: true,
    },
    preview: {
      port: 5000,
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    publicDir: 'public',
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      coverage: {
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'src/test/'
        ]
      }
    },
    define: {
      // Pass environment variables to the client
      __APP_ENV__: JSON.stringify(env.APP_ENV)
    },
  };
});

