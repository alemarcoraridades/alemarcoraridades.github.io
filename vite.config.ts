import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  console.log('env carregado:', env);
  return {
    plugins: [react()],
    base: '/',
    define: {
      'import.meta.env' : JSON.stringify(env)
    },
    build: {
      outDir: 'docs'
    },
    resolve: {
      alias: { '@': resolve(__dirname, './src') }
    },
    server: {
      port: 3000,
      open: true,
    },
    preview: {
      port: 3000,
    },
  };
});

