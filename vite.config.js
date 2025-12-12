import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import fs from 'fs'

// Generate all routes for SSG
function generateAllRoutes() {
  try {
    const servicesPath = path.resolve(__dirname, './src/data/wordpress-services.json')
    const servicesData = JSON.parse(fs.readFileSync(servicesPath, 'utf-8'))
    const serviceRoutes = Object.keys(servicesData).map(slug => `/services/${slug}`)
    
    return [
      '/',
      '/about',
      '/services',
      '/work',
      '/gallery',
      '/contact',
      ...serviceRoutes
    ]
  } catch (error) {
    console.warn('Failed to generate service routes:', error.message)
    return ['/', '/about', '/services', '/work', '/gallery', '/contact']
  }
}

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { quality: 80 },
    })
  ],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, './src/shared'),
    }
  },
  server: {
    port: 3000,
    host: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'wordpress-data': ['./src/data/wordpress-services.json']
        }
      }
    }
  },
  // Routes for pre-rendering (SSG)
  ssgOptions: {
    routes: generateAllRoutes()
  }
})
