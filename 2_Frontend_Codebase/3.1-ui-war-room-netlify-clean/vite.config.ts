import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [
      react(),
      // Bundle analyzer - only in production with analyze flag
      env.ANALYZE &&
        visualizer({
          filename: 'dist/stats.html',
          open: true,
          gzipSize: true,
          brotliSize: true,
        }),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // IMPORTANT: Never use process.env in define section - it breaks browser builds!
    // Vite automatically handles VITE_ prefixed env vars via import.meta.env
    // No define section needed for env vars
    build: {
      // Optimize bundle size and performance
      chunkSizeWarningLimit: 800,
      target: 'es2020', // Modern browsers for better optimization
      // Use esbuild but preserve React hooks and function names
      minify: 'esbuild',
      // CRITICAL: Preserve React hook names and structure
      esbuild: {
        keepNames: true,
      },
      rollupOptions: {
        output: {
          // CRITICAL: Simplified chunking to prevent React singleton breaking
          manualChunks: {
            // Keep React as single, unified chunk - NEVER split React
            'react-vendor': ['react', 'react-dom'],
            // Router separate to allow lazy loading
            'react-router': ['react-router-dom'],
            // State management
            'state': ['@reduxjs/toolkit', 'react-redux', 'zustand'],
            // Authentication
            'auth': ['@supabase/supabase-js', '@supabase/auth-helpers-react'],
            // Charts
            'charts': ['recharts', 'd3-scale'],
            // Query and async
            'query': ['@tanstack/react-query', '@tanstack/react-query-devtools'],
          },
        },
      },
      // Enable source maps for debugging
      sourcemap: false,
      // CSS optimization
      cssMinify: true,
    },
    server: {
      port: env.VITE_PORT ? parseInt(env.VITE_PORT) : 5173,
      open: false, // Disable auto-browser opening in headless environments
      host: true, // Listen on all addresses
      watch: {
        // Exclude directories that shouldn't be watched to prevent ENOSPC errors
        ignored: [
          '**/src/backend/**',
          '**/venv/**',
          '**/.venv/**',
          '**/node_modules/**',
          '**/.git/**',
          '**/dist/**',
          '**/build/**',
          '**/__pycache__/**',
          '**/*.pyc',
          '**/env/**',
          '**/migrations/**',
          '**/logs/**',
          '**/tmp/**',
          '**/temp/**',
        ],
      },
    },
  };
});
