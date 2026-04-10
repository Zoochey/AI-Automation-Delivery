import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { diagramSourcesSavePlugin } from './vite-plugin-diagram-sources-save.ts'
import { processFlowsSavePlugin } from './vite-plugin-process-flows-save.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    processFlowsSavePlugin(__dirname),
    diagramSourcesSavePlugin(__dirname),
  ],
  // Always load `.env` from this folder, even if Vite is started with a different cwd.
  envDir: __dirname,
  root: __dirname,
})
