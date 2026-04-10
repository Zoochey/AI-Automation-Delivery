import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react'

import catalogSeed from '../data/process-flows/catalog.json'
import { TEAM_PROCESS_FLOWS } from '../data/process-flows/teams.ts'
import type {
  ProcessFlowCatalogFile,
  ProcessFlowDocument,
} from '../data/process-flows/types.ts'

type PendingPdf = {
  id: string
  file: File
  objectUrl: string
}

function cloneCatalog(data: ProcessFlowCatalogFile): ProcessFlowCatalogFile {
  return {
    version: 1,
    documents: Object.fromEntries(
      Object.entries(data.documents).map(([k, v]) => [
        k,
        v.map((d) => ({ ...d })),
      ]),
    ),
  }
}

export function BusinessProcessFlowsPage() {
  const [catalog, setCatalog] = useState<ProcessFlowCatalogFile>(() =>
    cloneCatalog(catalogSeed as ProcessFlowCatalogFile),
  )
  const [selectedTeamId, setSelectedTeamId] = useState(TEAM_PROCESS_FLOWS[0].id)
  const [selectedDocId, setSelectedDocId] = useState('')
  const [pendingByTeam, setPendingByTeam] = useState<
    Record<string, PendingPdf[]>
  >({})
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveBusy, setSaveBusy] = useState(false)
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const viewerStageRef = useRef<HTMLDivElement>(null)
  const objectUrlsRef = useRef<Set<string>>(new Set())

  const selectedFlow = useMemo(
    () =>
      TEAM_PROCESS_FLOWS.find((t) => t.id === selectedTeamId) ??
      TEAM_PROCESS_FLOWS[0],
    [selectedTeamId],
  )

  const catalogDocs: ProcessFlowDocument[] =
    catalog.documents[selectedTeamId] ?? []
  const pendingDocs: PendingPdf[] = pendingByTeam[selectedTeamId] ?? []

  const selectedCatalogDoc = useMemo(
    () => catalogDocs.find((d) => d.id === selectedDocId) ?? null,
    [catalogDocs, selectedDocId],
  )

  const selectedPending = useMemo(
    () => pendingDocs.find((p) => p.id === selectedDocId) ?? null,
    [pendingDocs, selectedDocId],
  )

  const viewerSrc = selectedPending
    ? selectedPending.objectUrl
    : selectedCatalogDoc
      ? selectedCatalogDoc.path
      : null

  const revokeTrackedUrl = useCallback((url: string) => {
    URL.revokeObjectURL(url)
    objectUrlsRef.current.delete(url)
  }, [])

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u))
      objectUrlsRef.current.clear()
    }
  }, [])

  useEffect(() => {
    const onFs = () => setFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  // Keep a valid PDF selection when team or lists change
  useEffect(() => {
    const allIds = [
      ...catalogDocs.map((d) => d.id),
      ...pendingDocs.map((p) => p.id),
    ]
    setSelectedDocId((prev) => {
      if (prev && allIds.includes(prev)) return prev
      return allIds[0] ?? ''
    })
  }, [selectedTeamId, catalogDocs, pendingDocs])

  const onTeamChange = useCallback((teamId: string) => {
    setSelectedTeamId(teamId)
    setSaveError(null)
  }, [])

  const onPickPdf = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const file = ev.target.files?.[0]
      ev.target.value = ''
      if (!file) return
      const looksPdf =
        file.type === 'application/pdf' ||
        file.name.toLowerCase().endsWith('.pdf')
      if (!looksPdf) return

      const id = `pending-${crypto.randomUUID()}`
      const objectUrl = URL.createObjectURL(file)
      objectUrlsRef.current.add(objectUrl)

      setPendingByTeam((prev) => {
        const list = [...(prev[selectedFlow.id] ?? [])]
        list.push({ id, file, objectUrl })
        return { ...prev, [selectedFlow.id]: list }
      })
      setSelectedDocId(id)
      setSaveError(null)
    },
    [selectedFlow.id],
  )

  const removePending = useCallback(
    (teamId: string, pendingId: string) => {
      setPendingByTeam((prev) => {
        const list = prev[teamId] ?? []
        const found = list.find((p) => p.id === pendingId)
        if (found) revokeTrackedUrl(found.objectUrl)
        const nextList = list.filter((p) => p.id !== pendingId)
        const next = { ...prev }
        if (nextList.length) next[teamId] = nextList
        else delete next[teamId]
        return next
      })
    },
    [revokeTrackedUrl],
  )

  const saveToRepo = useCallback(async () => {
    if (!selectedPending || !import.meta.env.DEV) return
    setSaveBusy(true)
    setSaveError(null)
    try {
      const res = await fetch('/__api/process-flows/save', {
        method: 'POST',
        headers: {
          'X-Team-Id': selectedTeamId,
          'X-File-Name': selectedPending.file.name,
          'Content-Type': 'application/octet-stream',
        },
        body: selectedPending.file,
      })
      const data = (await res.json()) as {
        ok?: boolean
        catalog?: ProcessFlowCatalogFile
        error?: string
      }
      if (!res.ok || !data.ok || !data.catalog) {
        throw new Error(data.error ?? res.statusText ?? 'Save failed')
      }
      setCatalog(cloneCatalog(data.catalog))
      const savedId = selectedPending.id
      removePending(selectedTeamId, savedId)
      const teamEntries = data.catalog.documents[selectedTeamId] ?? []
      const last = teamEntries[teamEntries.length - 1]
      if (last) setSelectedDocId(last.id)
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaveBusy(false)
    }
  }, [
    selectedPending,
    selectedTeamId,
    removePending,
  ])

  const deleteFromRepo = useCallback(async () => {
    if (!selectedCatalogDoc || !import.meta.env.DEV) return
    const ok = window.confirm(
      `Remove "${selectedCatalogDoc.title}" from the repo?\n\nThis deletes the file under public/process-flows and updates catalog.json.`,
    )
    if (!ok) return
    setDeleteBusy(true)
    setSaveError(null)
    try {
      const res = await fetch('/__api/process-flows/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: selectedTeamId,
          documentId: selectedCatalogDoc.id,
        }),
      })
      const data = (await res.json()) as {
        ok?: boolean
        catalog?: ProcessFlowCatalogFile
        error?: string
      }
      if (!res.ok || !data.ok || !data.catalog) {
        throw new Error(data.error ?? res.statusText ?? 'Delete failed')
      }
      setCatalog(cloneCatalog(data.catalog))
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setDeleteBusy(false)
    }
  }, [selectedCatalogDoc, selectedTeamId])

  const exportPdf = useCallback(() => {
    if (selectedPending) {
      const url = URL.createObjectURL(selectedPending.file)
      const a = document.createElement('a')
      a.href = url
      a.download = selectedPending.file.name || `${selectedFlow.id}.pdf`
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 2_000)
      return
    }
    if (selectedCatalogDoc) {
      void fetch(selectedCatalogDoc.path)
        .then((r) => {
          if (!r.ok) throw new Error(String(r.status))
          return r.blob()
        })
        .then((blob) => {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${selectedCatalogDoc.title}.pdf`
          a.click()
          setTimeout(() => URL.revokeObjectURL(url), 2_000)
        })
        .catch(() => {})
    }
  }, [selectedPending, selectedCatalogDoc, selectedFlow.id])

  const toggleFullscreen = useCallback(async () => {
    const el = viewerStageRef.current
    if (!el) return
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch {
      /* ignore */
    }
  }, [])

  const canExport = Boolean(selectedPending ?? selectedCatalogDoc)
  const canSaveToRepo =
    import.meta.env.DEV && !!selectedPending && !saveBusy && !deleteBusy

  const canDeleteFromRepo =
    import.meta.env.DEV &&
    !!selectedCatalogDoc &&
    !selectedPending &&
    !saveBusy &&
    !deleteBusy

  const docOptions = useMemo(() => {
    const opts: { id: string; label: string; isPending: boolean }[] = []
    for (const d of catalogDocs) {
      opts.push({ id: d.id, label: d.title, isPending: false })
    }
    for (const p of pendingDocs) {
      opts.push({
        id: p.id,
        label: `${p.file.name} (unsaved)`,
        isPending: true,
      })
    }
    return opts
  }, [catalogDocs, pendingDocs])

  return (
    <div className="bpf-page">
      <header className="page-header bpf-page__header">
        <h1>Business process flows</h1>
        <p className="lede">
          Choose a team, then a PDF for that team. Import adds a draft for that
          team only. With <code>npm run dev</code>, <strong>Save to repo</strong>{' '}
          writes the file under <code>web/public/process-flows/&lt;team&gt;/</code>{' '}
          and updates <code>web/src/data/process-flows/catalog.json</code>.{' '}
          <strong>Delete from repo</strong> removes a saved PDF and its catalog
          entry (dev only).
        </p>
      </header>

      <section className="section bpf-section bpf-controls">
        <div className="bpf-toolbar">
          <label className="flow-selector bpf-toolbar__team" htmlFor="bpf-team">
            Team
            <select
              id="bpf-team"
              value={selectedTeamId}
              onChange={(e) => onTeamChange(e.target.value)}
            >
              {TEAM_PROCESS_FLOWS.map((flow) => (
                <option key={flow.id} value={flow.id}>
                  {flow.label}
                </option>
              ))}
            </select>
          </label>

          <label
            className="flow-selector bpf-toolbar__doc"
            htmlFor="bpf-doc"
          >
            PDF for this team
            <select
              id="bpf-doc"
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              disabled={docOptions.length === 0}
            >
              {docOptions.length === 0 ? (
                <option value="">No PDFs yet — import one</option>
              ) : (
                docOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))
              )}
            </select>
          </label>

          <div className="bpf-toolbar__actions">
            <button
              type="button"
              className="bpf-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              Import PDF…
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="bpf-file-input"
              onChange={onPickPdf}
              aria-hidden
            />
            <button
              type="button"
              className="bpf-btn bpf-btn--primary"
              onClick={exportPdf}
              disabled={!canExport}
            >
              Export PDF
            </button>
            <button
              type="button"
              className="bpf-btn bpf-btn--primary"
              onClick={() => void saveToRepo()}
              disabled={!canSaveToRepo}
              title={
                import.meta.env.DEV
                  ? 'Write PDF + catalog entry (dev server only)'
                  : 'Available when running npm run dev locally'
              }
            >
              {saveBusy ? 'Saving…' : 'Save to repo'}
            </button>
            <button
              type="button"
              className="bpf-btn bpf-btn--danger"
              onClick={() => void deleteFromRepo()}
              disabled={!canDeleteFromRepo}
              title={
                import.meta.env.DEV
                  ? 'Remove PDF file and catalog entry'
                  : 'Available when running npm run dev locally'
              }
            >
              {deleteBusy ? 'Deleting…' : 'Delete from repo'}
            </button>
            {selectedPending ? (
              <button
                type="button"
                className="bpf-btn bpf-btn--ghost"
                onClick={() => removePending(selectedTeamId, selectedPending.id)}
              >
                Discard import
              </button>
            ) : null}
          </div>
        </div>

        {saveError ? (
          <p className="bpf-error" role="alert">
            {saveError}
          </p>
        ) : null}
        {!import.meta.env.DEV ? (
          <p className="bpf-hint">
            Saving into the project folder runs on the Vite dev server only.
            Export PDF to share a copy, or run <code>npm run dev</code> locally to
            use Save to repo.
          </p>
        ) : null}
      </section>

      <section className="section bpf-viewer-section">
        <div className="bpf-viewer-head">
          <h2 className="bpf-viewer-title">{selectedFlow.label}</h2>
          <button
            type="button"
            className="bpf-btn"
            onClick={() => void toggleFullscreen()}
            disabled={!viewerSrc}
          >
            {fullscreen ? 'Exit full screen' : 'Full screen'}
          </button>
        </div>
        <p className="bpf-meta">
          {selectedFlow.notes ? `${selectedFlow.notes} ` : ''}
          {selectedPending ? (
            <>
              Draft: <code>{selectedPending.file.name}</code>
            </>
          ) : selectedCatalogDoc ? (
            <>
              File: <code>{selectedCatalogDoc.path}</code>
            </>
          ) : (
            <>No PDF selected.</>
          )}
        </p>

        <div className="bpf-viewer-stage" ref={viewerStageRef}>
          {viewerSrc ? (
            <div className="flow-embed-wrap bpf-pdf-wrap">
              <iframe
                title={`${selectedFlow.label} — PDF`}
                src={viewerSrc}
                className="flow-embed bpf-pdf-frame"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="card bpf-empty">
              <p>
                No PDFs for this team yet. Use <strong>Import PDF…</strong> to add
                one, then optionally <strong>Save to repo</strong> (dev) to store
                it under <code>public/process-flows/{selectedFlow.id}/</code>.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
