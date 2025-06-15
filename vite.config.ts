import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
    assetsDir: 'assets',
    copyPublicDir: true,
  },
  publicDir: 'public',
})