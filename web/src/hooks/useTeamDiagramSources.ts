import { useCallback, useEffect, useMemo, useState } from 'react'

import catalogSeed from '../data/diagram-sources/catalog.json'
import type { DiagramSourceCatalogFile } from '../data/diagram-sources/types.ts'
import { TEAM_PROCESS_FLOWS } from '../data/process-flows/teams.ts'

export type TeamDiagramSourceKind = 'json' | 'mermaid'

function cloneCatalog(data: DiagramSourceCatalogFile): DiagramSourceCatalogFile {
  return {
    version: 1,
    json: Object.fromEntries(
      Object.entries(data.json).map(([k, v]) => [
        k,
        v.map((d) => ({ ...d })),
      ]),
    ),
    mermaid: Object.fromEntries(
      Object.entries(data.mermaid).map(([k, v]) => [
        k,
        v.map((d) => ({ ...d })),
      ]),
    ),
  }
}

type Options = {
  onRepoDocumentLoaded: (text: string, fileName: string) => void
}

export function useTeamDiagramSources(
  kind: TeamDiagramSourceKind,
  { onRepoDocumentLoaded }: Options,
) {
  const [catalog, setCatalog] = useState<DiagramSourceCatalogFile>(() =>
    cloneCatalog(catalogSeed as DiagramSourceCatalogFile),
  )
  const [teamId, setTeamId] = useState<string>(
    TEAM_PROCESS_FLOWS[0]?.id ?? 'executive',
  )
  const [selectedDocId, setSelectedDocId] = useState('')
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveBusy, setSaveBusy] = useState(false)
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [loadBusy, setLoadBusy] = useState(false)

  const repoDocs = catalog[kind][teamId] ?? []

  const selectedRepoDoc = useMemo(
    () => repoDocs.find((d) => d.id === selectedDocId) ?? null,
    [repoDocs, selectedDocId],
  )

  useEffect(() => {
    setSaveError(null)
  }, [teamId])

  useEffect(() => {
    const ids = repoDocs.map((d) => d.id)
    setSelectedDocId((prev) => {
      if (prev && ids.includes(prev)) return prev
      return ''
    })
  }, [teamId, repoDocs])

  const loadRepoDocument = useCallback(
    async (docId: string) => {
      const doc = repoDocs.find((d) => d.id === docId)
      if (!doc) return
      setLoadBusy(true)
      setSaveError(null)
      try {
        const res = await fetch(doc.path, { cache: 'no-cache' })
        if (!res.ok) throw new Error(res.statusText || 'Load failed')
        const text = await res.text()
        const fileName = doc.path.split('/').pop() ?? 'file'
        onRepoDocumentLoaded(text, fileName)
      } catch (e) {
        setSaveError(e instanceof Error ? e.message : 'Load failed')
      } finally {
        setLoadBusy(false)
      }
    },
    [repoDocs, onRepoDocumentLoaded],
  )

  const onDocSelect = useCallback(
    (docId: string) => {
      setSelectedDocId(docId)
      if (docId) void loadRepoDocument(docId)
    },
    [loadRepoDocument],
  )

  const saveToRepo = useCallback(
    async (editorText: string, exportFileName: string) => {
      if (!import.meta.env.DEV) return
      const name = exportFileName.trim()
      if (!name) {
        setSaveError('Set a file name before saving to the repo.')
        return
      }
      if (kind === 'json') {
        try {
          JSON.parse(editorText)
        } catch (e) {
          setSaveError(
            e instanceof Error ? `Invalid JSON: ${e.message}` : 'Invalid JSON',
          )
          return
        }
      }
      setSaveBusy(true)
      setSaveError(null)
      try {
        const res = await fetch('/__api/diagram-sources/save', {
          method: 'POST',
          headers: {
            'X-Team-Id': teamId,
            'X-File-Name': name,
            'X-Source-Kind': kind,
            'Content-Type': 'text/plain; charset=utf-8',
          },
          body: editorText,
        })
        const data = (await res.json()) as {
          ok?: boolean
          catalog?: DiagramSourceCatalogFile
          error?: string
        }
        if (!res.ok || !data.ok || !data.catalog) {
          throw new Error(data.error ?? res.statusText ?? 'Save failed')
        }
        setCatalog(cloneCatalog(data.catalog))
        const teamEntries = data.catalog[kind][teamId] ?? []
        const last = teamEntries[teamEntries.length - 1]
        if (last) setSelectedDocId(last.id)
      } catch (e) {
        setSaveError(e instanceof Error ? e.message : 'Save failed')
      } finally {
        setSaveBusy(false)
      }
    },
    [kind, teamId],
  )

  const deleteFromRepo = useCallback(async () => {
    if (!selectedRepoDoc || !import.meta.env.DEV) return
    const ok = window.confirm(
      `Remove "${selectedRepoDoc.title}" from the repo?\n\nThis deletes the file under public/diagram-sources and updates catalog.json.`,
    )
    if (!ok) return
    setDeleteBusy(true)
    setSaveError(null)
    try {
      const res = await fetch('/__api/diagram-sources/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId,
          documentId: selectedRepoDoc.id,
          sourceKind: kind,
        }),
      })
      const data = (await res.json()) as {
        ok?: boolean
        catalog?: DiagramSourceCatalogFile
        error?: string
      }
      if (!res.ok || !data.ok || !data.catalog) {
        throw new Error(data.error ?? res.statusText ?? 'Delete failed')
      }
      setCatalog(cloneCatalog(data.catalog))
      setSelectedDocId('')
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setDeleteBusy(false)
    }
  }, [kind, selectedRepoDoc, teamId])

  return {
    catalog,
    teamId,
    setTeamId,
    repoDocs,
    selectedDocId,
    setSelectedDocId: onDocSelect,
    selectedRepoDoc,
    saveError,
    setSaveError,
    saveBusy,
    deleteBusy,
    loadBusy,
    saveToRepo,
    deleteFromRepo,
    isDev: import.meta.env.DEV,
  }
}
