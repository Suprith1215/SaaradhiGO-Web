import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'

// Plugin to resolve figma:asset/... imports to local asset files
function figmaAssetPlugin(): Plugin {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, `src/assets/${filename}`)
      }
    },
  }
}function terminalLoggerPlugin(): Plugin {
  return {
    name: 'terminal-logger',
    configureServer(server) {
      server.middlewares.use('/__log_otp', (req, res) => {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const { otp } = JSON.parse(body);
            console.log(`\n\x1b[32m==================================\x1b[0m`);
            console.log(`\x1b[32m🚗 [SAARADHIGo] TEST OTP RECEIVED: \x1b[1m${otp}\x1b[0m`);
            console.log(`\x1b[32m==================================\x1b[0m\n`);
          } catch (e) {}
          res.end('ok');
        });
      });
    }
  }
}

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    figmaAssetPlugin(),
    terminalLoggerPlugin(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.webp'],
  server: {
    hmr: {
      overlay: false
    }
  }
})
