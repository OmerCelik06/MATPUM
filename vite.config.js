import { defineConfig } from 'vite'
import { resolve } from 'path'
import apiRoutes from 'vite-plugin-api-routes'

export default defineConfig({
  plugins: [
    apiRoutes({
      mode: 'isolated',
      routesDir: 'src/api'
    })
  ],
  // Vite yapılandırma seçenekleri
  root: '.',
  publicDir: 'public',
  server: {
    port: 3000, // Sunucu portu
    open: true, // Tarayıcıyı otomatik aç
    host: true // Tüm ağ arayüzlerinden erişime izin ver
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: 'dist', // Derleme çıktı dizini
    assetsDir: 'assets', // Varlıkların dizini
    sourcemap: true, // Kaynak haritaları oluştur
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html')
      }
    }
  }
}) 