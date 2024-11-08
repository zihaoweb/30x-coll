import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import type { UserConfig } from 'vite';
import createVitePlugins from './build/vite/plugins';
import proxy from './build/vite/proxy';

// https://vitejs.dev/config/
export default defineConfig((): UserConfig => {
  const isBuild = process.env.NODE_ENV === 'production';
  return {
    resolve: {
      alias: {
        // 设置别名
        '@': resolve(__dirname, './src'),
      },
    },
    // vite 相关配置
    server: {
      port: 8080,
      host: true,
      open: true,
      // proxy,
      proxy: {
        '/bu': {
          target: 'http://192.168.18.68:4004',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/bu/, ''),
        },
        '/wx': {
          target: 'http://192.168.18.68:3001',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/wx/, ''),
        },
      },
    },
    build: {
      rollupOptions: {
        external: './deploy.js',
      },
    },
    plugins: createVitePlugins(isBuild),
  };
});
