import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'

type CatalogFile = {
  version: 1
  json: Record<string, { id: string; title: string; path: string }[]>
  mermaid: Record<string, { id: string; title: string; path: string }[]>
}

type SourceKind = 'json' | 'mermaid'

function sanitizeFileName(name: string, kind: SourceKind): string {
  const trimmed = name.trim() || (kind === 'json' ? 'diagram.json' : 'diagram.mmd')
  const safe = trimmed.replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 120)
  const ext = kind === 'json' ? '.json' : '.mmd'
  const lower = safe.toLowerCase()
  if (kind === 'json') {
    return lower.endsWith('.json') ? safe : `${safe.replace(/\.[^.]+$/, '')}.json`
  }
  return lower.endsWith('.mmd') ? safe : `${safe.replace(/\.[^.]+$/, '')}.mmd`
}

function uniqueName(dir: string, fileName: string): string {
  const ext = path.extname(fileName)
  const base = path.basename(fileName, ext)
  let candidate = `${base}${ext}`
  let n = 2
  while (fs.existsSync(path.join(dir, candidate))) {
    candidate = `${base}_${n}${ext}`
    n += 1
  }
  return candidate
}

function readCatalog(catalogPath: string): CatalogFile {
  const raw = fs.readFileSync(catalogPath, 'utf8')
  return JSON.parse(raw) as CatalogFile
}

function writeCatalog(catalogPath: string, data: CatalogFile) {
  fs.writeFileSync(catalogPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (c: Buffer) => chunks.push(c))
    req.on('end', () => {
      try {
        const text = Buffer.concat(chunks).toString('utf8')
        if (!text.trim()) {
          resolve(null)
          return
        }
        resolve(JSON.parse(text) as unknown)
      } catch (e) {
        reject(e)
      }
    })
    req.on('error', reject)
  })
}

function readTextBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (c: Buffer) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function resolveDiskPath(
  root: string,
  teamId: string,
  publicPath: string,
): string | null {
  const prefix = `/diagram-sources/${teamId}/`
  if (!publicPath.startsWith(prefix)) return null
  const fileName = publicPath.slice(prefix.length)
  if (!fileName || /[\\/]/.test(fileName) || fileName.includes('..')) {
    return null
  }
  const teamDir = path.join(root, 'public', 'diagram-sources', teamId)
  const full = path.join(teamDir, fileName)
  const rel = path.relative(teamDir, full)
  if (rel.startsWith('..') || path.isAbsolute(rel) || rel === '') return null
  return path.resolve(full)
}

/**
 * Dev-only APIs for team-scoped JSON / Mermaid text files:
 * - POST /__api/diagram-sources/save — UTF-8 body; x-team-id, x-file-name, x-source-kind: json|mermaid
 * - POST /__api/diagram-sources/delete — JSON { teamId, documentId, sourceKind }
 */
export function diagramSourcesSavePlugin(root: string): Plugin {
  return {
    name: 'diagram-sources-save',
    configureServer(server) {
      const catalogPath = path.join(root, 'src/data/diagram-sources/catalog.json')

      server.middlewares.use((req, res, next) => {
        const pathname = req.url?.split('?')[0] ?? ''

        if (pathname === '/__api/diagram-sources/delete' && req.method === 'POST') {
          void handleDelete(req, res, catalogPath, root)
          return
        }

        if (pathname === '/__api/diagram-sources/save' && req.method === 'POST') {
          void handleSave(req, res, catalogPath, root)
          return
        }

        next()
      })
    },
  }
}

async function handleDelete(
  req: IncomingMessage,
  res: ServerResponse,
  catalogPath: string,
  root: string,
) {
  try {
    if (!fs.existsSync(catalogPath)) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ ok: false, error: 'catalog.json missing' }))
      return
    }

    const body = (await readJsonBody(req)) as {
      teamId?: string
      documentId?: string
      sourceKind?: SourceKind
    } | null
    const teamId = String(body?.teamId ?? '').trim()
    const documentId = String(body?.documentId ?? '').trim()
    const sourceKind = body?.sourceKind
    if (!teamId || !documentId || (sourceKind !== 'json' && sourceKind !== 'mermaid')) {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(
        JSON.stringify({
          ok: false,
          error: 'teamId, documentId, and sourceKind (json|mermaid) required',
        }),
      )
      return
    }

    const catalog = readCatalog(catalogPath)
    const bucket = catalog[sourceKind]
    if (!Object.prototype.hasOwnProperty.call(bucket, teamId)) {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ ok: false, error: 'Unknown team id' }))
      return
    }

    const teamDocs = bucket[teamId] ?? []
    const idx = teamDocs.findIndex((d) => d.id === documentId)
    if (idx === -1) {
      res.statusCode = 404
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ ok: false, error: 'Document not found' }))
      return
    }

    const doc = teamDocs[idx]
    const diskPath = resolveDiskPath(root, teamId, doc.path)
    if (!diskPath) {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ ok: false, error: 'Invalid document path' }))
      return
    }

    if (fs.existsSync(diskPath)) {
      try {
        fs.unlinkSync(diskPath)
      } catch (e) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(
          JSON.stringify({
            ok: false,
            error: e instanceof Error ? e.message : 'Could not delete file',
          }),
        )
        return
      }
    }

    teamDocs.splice(idx, 1)
    bucket[teamId] = teamDocs
    catalog[sourceKind] = bucket
    writeCatalog(catalogPath, catalog)

    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ ok: true, catalog }))
  } catch (e) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(
      JSON.stringify({
        ok: false,
        error: e instanceof Error ? e.message : 'Delete failed',
      }),
    )
  }
}

async function handleSave(
  req: IncomingMessage,
  res: ServerResponse,
  catalogPath: string,
  root: string,
) {
  try {
    if (!fs.existsSync(catalogPath)) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ ok: false, error: 'catalog.json missing' }))
      return
    }

    const catalog = readCatalog(catalogPath)
    const teamId = String(req.headers['x-team-id'] ?? '').trim()
    const kindRaw = String(req.headers['x-source-kind'] ?? '').trim().toLowerCase()
    const sourceKind: SourceKind | null =
      kindRaw === 'json' || kindRaw === 'mermaid' ? kindRaw : null

    if (!teamId || !sourceKind) {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(
        JSON.stringify({
          ok: false,
          error: 'Invalid or missing x-team-id / x-source-kind (json|mermaid)',
        }),
      )
      return
    }

    const bucket = catalog[sourceKind]
    if (!Object.prototype.hasOwnProperty.call(bucket, teamId)) {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ ok: false, error: 'Unknown team id' }))
      return
    }

    const text = await readTextBody(req)
    if (!text.length) {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ ok: false, error: 'Empty body' }))
      return
    }

    const headerName = req.headers['x-file-name']
    const rawName = typeof headerName === 'string' ? headerName : 'diagram'
    const safeBase = sanitizeFileName(rawName, sourceKind)

    const teamPublicDir = path.join(root, 'public/diagram-sources', teamId)
    fs.mkdirSync(teamPublicDir, { recursive: true })

    const finalName = uniqueName(teamPublicDir, safeBase)
    const diskPath = path.join(teamPublicDir, finalName)
    fs.writeFileSync(diskPath, text, 'utf8')

    const publicUrlPath = `/diagram-sources/${teamId}/${finalName}`
    const title = finalName.replace(/\.(json|mmd)$/i, '')
    const doc = {
      id: randomUUID(),
      title,
      path: publicUrlPath,
    }

    const teamDocs = bucket[teamId] ?? []
    teamDocs.push(doc)
    bucket[teamId] = teamDocs
    catalog[sourceKind] = bucket
    writeCatalog(catalogPath, catalog)

    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ ok: true, catalog }))
  } catch (e) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(
      JSON.stringify({
        ok: false,
        error: e instanceof Error ? e.message : 'Save failed',
      }),
    )
  }
}
