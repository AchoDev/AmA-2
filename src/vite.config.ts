import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    outDir: '../www',
  },
  plugins: [vue({
    template: {
      compilerOptions: {
        isCustomElement: tag => tag === 'center'
      }
    }
  })],
})
