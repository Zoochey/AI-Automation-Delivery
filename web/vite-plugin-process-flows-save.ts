import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'

type CatalogFile = {
  version: 1
  documents: Record<string, { id: string; title: string; path: string }[]>
}

function sanitizeFileName(name: string): string {
  const trimmed = name.trim() || 'diagram.pdf'
  const safe = trimmed.replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 120)
  return safe.toLowerCase().endsWith('.pdf') ? safe : `${safe}.pdf`
}

function uniqueName(dir: string, fileName: string): string {
  const base = fileName.replace(/\.pdf$/i, '')
  const ext = '.pdf'
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

/** Public URL must be /process-flows/{teamId}/{file}.pdf with a single filename segment. */
function resolvePdfDiskPath(
  root: string,
  teamId: string,
  publicPath: string,
): string | null {
  const prefix = `/process-flows/${teamId}/`
  if (!publicPath.startsWith(prefix)) return null
  const fileName = publicPath.slice(prefix.length)
  if (!fileName || /[\\/]/.test(fileName) || fileName.includes('..')) {
    return null
  }
  const teamDir = path.join(root, 'public', 'process-flows', teamId)
  const full = path.join(teamDir, fileName)
  const rel = path.relative(teamDir, full)
  if (rel.startsWith('..') || path.isAbsolute(rel) || rel === '') return null
  return path.resolve(full)
}

/**
 * Dev-only APIs:
 * - POST /__api/process-flows/save — raw PDF; headers x-team-id, x-file-name
 * - POST /__api/process-flows/delete — JSON { teamId, documentId }
 */
export function processFlowsSavePlugin(root: string): Plugin {
  return {
    name: 'process-flows-save',
    configureServer(server) {
      const catalogPath = path.join(root, 'src/data/process-flows/catalog.json')

      server.middlewares.use((req, res, next) => {
        const pathname = req.url?.split('?')[0] ?? ''

        if (pathname === '/__api/process-flows/delete' && req.method === 'POST') {
          void handleDelete(req, res, catalogPath, root)
          return
        }

        if (pathname === '/__api/process-flows/save' && req.method === 'POST') {
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
    } | null
    const teamId = String(body?.teamId ?? '').trim()
    const documentId = String(body?.documentId ?? '').trim()
    if (!teamId || !documentId) {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ ok: false, error: 'teamId and documentId required' }))
      return
    }

    const catalog = readCatalog(catalogPath)
    if (!Object.prototype.hasOwnProperty.call(catalog.documents, teamId)) {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ ok: false, error: 'Unknown team id' }))
      return
    }

    const teamDocs = catalog.documents[teamId] ?? []
    const idx = teamDocs.findIndex((d) => d.id === documentId)
    if (idx === -1) {
      res.statusCode = 404
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ ok: false, error: 'Document not found' }))
      return
    }

    const doc = teamDocs[idx]
    const diskPath = resolvePdfDiskPath(root, teamId, doc.path)
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
    catalog.documents[teamId] = teamDocs
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
    if (!teamId || !Object.prototype.hasOwnProperty.call(catalog.documents, teamId)) {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ ok: false, error: 'Invalid or unknown team id' }))
      return
    }

    const chunks: Buffer[] = []
    await new Promise<void>((resolve, reject) => {
      req.on('data', (c: Buffer) => chunks.push(c))
      req.on('end', () => resolve())
      req.on('error', reject)
    })
    const body = Buffer.concat(chunks)
    if (body.length === 0) {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ ok: false, error: 'Empty body' }))
      return
    }

    const headerName = req.headers['x-file-name']
    const rawName = typeof headerName === 'string' ? headerName : 'diagram.pdf'
    const safeBase = sanitizeFileName(rawName)

    const teamPublicDir = path.join(root, 'public/process-flows', teamId)
    fs.mkdirSync(teamPublicDir, { recursive: true })

    const finalName = uniqueName(teamPublicDir, safeBase)
    const diskPath = path.join(teamPublicDir, finalName)
    fs.writeFileSync(diskPath, body)

    const publicUrlPath = `/process-flows/${teamId}/${finalName}`
    const doc = {
      id: randomUUID(),
      title: finalName.replace(/\.pdf$/i, ''),
      path: publicUrlPath,
    }

    const teamDocs = catalog.documents[teamId] ?? []
    teamDocs.push(doc)
    catalog.documents[teamId] = teamDocs
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
