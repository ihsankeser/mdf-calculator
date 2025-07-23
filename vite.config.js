import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// HTML içeriğinde root id'sini güncellemek için özel plugin
function replaceRootIdPlugin() {
  return {
    name: 'replace-root-id',
    transformIndexHtml(html) {
      return html.replace('<div id="root"></div>', '<div id="wall-calculator-root"></div>');
    },
  };
}

// Shopify uyumlu Vite config
export default defineConfig({
  base: '', // 🔥 Artık doğru path
  plugins: [react(), replaceRootIdPlugin()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        entryFileNames: 'mdf-custom-wall.js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
