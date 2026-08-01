import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: process.env.GITHUB_ACTIONS === 'true' ? '/mt.bau/' : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'static_logo.png'],
      manifest: {
        name: 'مكانك الجامعي - BAU',
        short_name: 'مكانك',
        description: 'المساعد الأكاديمي الشامل لطلاب جامعة البلقاء التطبيقية',
        start_url: process.env.GITHUB_ACTIONS === 'true' ? '/mt.bau/' : '/',
        scope: process.env.GITHUB_ACTIONS === 'true' ? '/mt.bau/' : '/',
        display: 'standalone',
        orientation: 'any',
        background_color: '#020b18',
        theme_color: '#fbbf24',
        lang: 'ar',
        dir: 'rtl',
        categories: ['education', 'utilities'],
        icons: [
          {
            src: '/favicon.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/favicon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,ttf}'],
        // Disable inlineWorkboxMode to prevent single-quote folder path escaping bug in workbox-build
        inlineWorkboxRuntime: false
      },
      devOptions: {
        enabled: false
      }
    })
  ],
  resolve: {
    alias: {
      'react': path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
  },
  server: {
    host: true,
  },
}))
