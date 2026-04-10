/**
 * Must run before any @syncfusion/ej2-* UI loads. Imported first from main.tsx.
 * React has no C# SyncfusionLicenseProvider — EJ2 uses registerLicense only.
 */
import { registerLicense } from '@syncfusion/ej2-base'

function readKey(): string {
  const raw = import.meta.env.VITE_SYNCFUSION_LICENSE
  if (typeof raw !== 'string') return ''
  // Trim; strip optional surrounding quotes from .env
  return raw
    .trim()
    .replace(/^["']/, '')
    .replace(/["']$/, '')
}

const key = readKey()
if (key) {
  registerLicense(key)
  if (import.meta.env.DEV) {
    console.info(
      `[Syncfusion] registerLicense called (key length ${key.length}). If you still see the trial modal, the key may be wrong type, truncated, or not for EJ2 v33.`,
    )
  }
} else if (import.meta.env.DEV) {
  console.warn(
    '[Syncfusion] No license: set VITE_SYNCFUSION_LICENSE in web/.env (not .env.example), then restart `npm run dev`.',
  )
}
