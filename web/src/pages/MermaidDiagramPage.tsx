import {
  lazy,
  Suspense,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react'

import { MermaidDiagram } from '../components/MermaidDiagram.tsx'
import { TeamDiagramSourceToolbar } from '../components/TeamDiagramSourceToolbar.tsx'
import { useTeamDiagramSources } from '../hooks/useTeamDiagramSources.ts'
import type { DiagramDefinition } from '../models/diagramTypes.ts'
import { mermaidToDiagram } from '../services/mermaidToDiagram.ts'

const DiagramCanvas = lazy(() =>
  import('../components/diagrams/DiagramCanvas.tsx').then((m) => ({
    default: m.DiagramCanvas,
  })),
)

/** Former Appendix A sample — editable starting point */
const DEFAULT_MERMAID = `flowchart TD
  subgraph lane_L1[Business Discovery]
  A["Business Problem / Opportunity"]
  B["Discovery Workshop"]
  C["People / Process / Technology"]
  end

  subgraph lane_L2[Assessment]
  D["Use Case Intake"]
  E["Classification"]
  F["Data Classification"]
  G["Automation / AI / Hybrid Decision"]
  end

  subgraph lane_L3[Design & Build]
  H["Solution Design"]
  I["Prompt / Model / Integration"]
  J["Build & Release"]
  end

  subgraph lane_L4[Operate & Control]
  K["Monitoring & Reporting"]
  L["Governance & Risk"]
  M["Production Use"]
  end

  A --> B --> C --> D --> E --> F --> G --> H --> I --> J --> K --> L --> M
  M --> D`

type PreviewMode = 'mermaid' | 'syncfusion'

export function MermaidDiagramPage() {
  const [mermaidText, setMermaidText] = useState(DEFAULT_MERMAID)
  const [exportName, setExportName] = useState('delivery-flow.mmd')
  const [previewMode, setPreviewMode] = useState<PreviewMode>('mermaid')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onRepoLoaded = useCallback((text: string, fileName: string) => {
    setMermaidText(text)
    setExportName(fileName)
  }, [])

  const {
    teamId,
    setTeamId,
    repoDocs,
    selectedDocId,
    setSelectedDocId,
    selectedRepoDoc,
    saveError,
    saveBusy,
    deleteBusy,
    loadBusy,
    saveToRepo,
    deleteFromRepo,
    isDev,
  } = useTeamDiagramSources('mermaid', { onRepoDocumentLoaded: onRepoLoaded })

  const syncfusionDef = useMemo((): {
    definition: DiagramDefinition | null
    error: string | null
  } => {
    try {
      const def = mermaidToDiagram(mermaidText, {
        id: 'mermaid-live',
        title: 'Mermaid → flow',
      })
      return { definition: def, error: null }
    } catch (e) {
      return {
        definition: null,
        error: e instanceof Error ? e.message : 'Could not convert Mermaid',
      }
    }
  }, [mermaidText])

  const exportFile = useCallback(() => {
    const blob = new Blob([mermaidText], {
      type: 'text/plain;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const name = exportName.trim() || 'diagram.mmd'
    a.download = name.toLowerCase().endsWith('.mmd') ? name : `${name}.mmd`
    a.click()
    URL.revokeObjectURL(url)
  }, [exportName, mermaidText])

  const onPickFile = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setMermaidText(String(reader.result ?? ''))
      setExportName(file.name)
    }
    reader.readAsText(file)
    ev.target.value = ''
  }, [])

  return (
    <div className="json-diagram-page">
      <header className="json-diagram-page__header page-header">
        <h1>Mermaid diagram</h1>
        <p className="lede">
          Edit Mermaid flowchart source on the left; preview with native Mermaid
          (subgraphs, styling) or a Syncfusion flow converted from the same
          text. Team-scoped files: load from the repo catalogue, export, and in
          dev save or delete under <code>public/diagram-sources</code>.
        </p>
      </header>

      <TeamDiagramSourceToolbar
        teamId={teamId}
        onTeamIdChange={setTeamId}
        repoDocs={repoDocs}
        selectedDocId={selectedDocId}
        onRepoDocChange={setSelectedDocId}
        loadBusy={loadBusy}
        exportName={exportName}
        onExportNameChange={setExportName}
        onImportClick={() => fileInputRef.current?.click()}
        fileInputRef={fileInputRef}
        accept=".mmd,.txt,.md,text/plain"
        importLabel="Import Mermaid…"
        onFileChange={onPickFile}
        onExportDownload={exportFile}
        exportButtonLabel="Export .mmd"
        saveToRepoLabel="Save to repo"
        onSaveToRepo={() => void saveToRepo(mermaidText, exportName)}
        onDeleteFromRepo={() => void deleteFromRepo()}
        saveBusy={saveBusy}
        deleteBusy={deleteBusy}
        isDev={isDev}
        saveError={saveError}
        selectedRepoDoc={selectedRepoDoc}
      />

      <div className="json-diagram-page__split">
        <section className="json-diagram-page__editor" aria-label="Mermaid editor">
          <label className="json-diagram-page__editor-label" htmlFor="mmd-source">
            Mermaid source
          </label>
          <textarea
            id="mmd-source"
            className="json-diagram-page__textarea"
            value={mermaidText}
            onChange={(e) => setMermaidText(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
          />

          <fieldset className="json-diagram-page__layout-fieldset">
            <legend className="json-diagram-page__layout-legend">Preview</legend>
            <div className="mermaid-diagram-page__preview-toggle" role="group">
              <button
                type="button"
                className={
                  previewMode === 'mermaid'
                    ? 'json-diagram-page__layout-card json-diagram-page__layout-card--active mermaid-diagram-page__preview-btn'
                    : 'json-diagram-page__layout-card mermaid-diagram-page__preview-btn'
                }
                onClick={() => setPreviewMode('mermaid')}
                aria-pressed={previewMode === 'mermaid'}
              >
                <span className="json-diagram-page__layout-card-title">
                  Mermaid (browser)
                </span>
                <span className="json-diagram-page__layout-card-desc">
                  Full fidelity including subgraphs
                </span>
              </button>
              <button
                type="button"
                className={
                  previewMode === 'syncfusion'
                    ? 'json-diagram-page__layout-card json-diagram-page__layout-card--active mermaid-diagram-page__preview-btn'
                    : 'json-diagram-page__layout-card mermaid-diagram-page__preview-btn'
                }
                onClick={() => setPreviewMode('syncfusion')}
                aria-pressed={previewMode === 'syncfusion'}
              >
                <span className="json-diagram-page__layout-card-title">
                  Syncfusion flow
                </span>
                <span className="json-diagram-page__layout-card-desc">
                  Parsed subset only (no subgraph boxes)
                </span>
              </button>
            </div>
          </fieldset>
        </section>

        <section
          className="json-diagram-page__diagram"
          aria-label="Mermaid preview"
        >
          <div className="json-diagram-page__diagram-head">
            <span className="json-diagram-page__diagram-title">
              {previewMode === 'mermaid' ? 'Mermaid preview' : 'Syncfusion preview'}
            </span>
            {previewMode === 'syncfusion' && syncfusionDef.definition ? (
              <span className="json-diagram-page__node-count">
                Nodes: {syncfusionDef.definition.nodes.length}
              </span>
            ) : null}
          </div>
          <div className="json-diagram-page__diagram-canvas mermaid-diagram-page__canvas">
            {previewMode === 'mermaid' ? (
              <MermaidDiagram
                chart={mermaidText}
                aria-label="Mermaid flowchart preview"
              />
            ) : syncfusionDef.error ? (
              <p className="json-diagram-page__placeholder">{syncfusionDef.error}</p>
            ) : syncfusionDef.definition ? (
              <Suspense
                fallback={
                  <p className="diagram-loading">Loading diagram engine…</p>
                }
              >
                <DiagramCanvas
                  definition={syncfusionDef.definition}
                  instanceKey={mermaidText}
                  height="calc(100vh - 220px)"
                  aria-label="Mermaid converted to Syncfusion flowchart"
                />
              </Suspense>
            ) : (
              <p className="json-diagram-page__placeholder">
                Enter Mermaid flowchart text to preview.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
