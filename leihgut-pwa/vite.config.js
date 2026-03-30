import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/openclaw/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Leihgut',
        short_name: 'Leihgut',
        description: 'Werkzeuge & Schulden Tracker',
        theme_color: '#ff6b00',
        background_color: '#f2f2f7',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/openclaw/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}']
      }
    })
  ],
})
