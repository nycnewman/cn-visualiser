import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//import { visualizer } from 'rollup-plugin-visualizer'
import { splitVendorChunkPlugin } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: "/cn-visualiser",
  plugins: [
    react(),
    splitVendorChunkPlugin(),
//    visualizer({
//      open: true,
//      filename: 'dist/stats.html',
//    }),
  ],
  build: {
   rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@open-ish') || id.includes('tslib')) {
            return '@open-ish';
          }
          if (
            id.includes('react-router-dom') ||
            id.includes('@remix-run') ||
            id.includes('react-router')
          ) {
            return '@react-router';
          }
          if (
            id.includes('@mui')
          ) {
            return '@mui';
          }
          if (id.includes('node_modules')) {
            return 'vendor'; // Group all node_modules into a vendor chunk
          }
        },
      },
    },
  },
})
