import {
  lazy,
  Suspense,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react'

import { TeamDiagramSourceToolbar } from '../components/TeamDiagramSourceToolbar.tsx'
import { useTeamDiagramSources } from '../hooks/useTeamDiagramSources.ts'
import type { DiagramDefinition } from '../models/diagramTypes.ts'
import {
  JSON_DIAGRAM_LAYOUT_CARDS,
  mapJsonTreeDefinitionToSyncfusion,
  type JsonDiagramLayoutId,
} from '../services/jsonDiagramLayouts.ts'
import { jsonToTreeDiagramDefinition } from '../services/jsonToTreeDiagram.ts'

const DiagramCanvas = lazy(() =>
  import('../components/diagrams/DiagramCanvas.tsx').then((m) => ({
    default: m.DiagramCanvas,
  })),
)

const SAMPLE_JSON = `{
  "GeneralProfile": {
    "entity": {
      "name": "Syncfusion QA Testing Lab",
      "location": {
        "facility": "Building A",
        "wing": "North",
        "lab_id": "LAB-1042"
      }
    },
    "management": {
      "lead": "Alex Morgan",
      "reports_to": "Director of Engineering"
    },
    "facilities": {
      "environment": "Controlled",
      "power": "Redundant UPS"
    }
  }
}`

export function JsonToDiagramPage() {
  const [jsonText, setJsonText] = useState(SAMPLE_JSON)
  const [exportName, setExportName] = useState('my-diagram.json')
  const [layoutId, setLayoutId] =
    useState<JsonDiagramLayoutId>('hierarchical-lr')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onRepoLoaded = useCallback((text: string, fileName: string) => {
    setJsonText(text)
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
  } = useTeamDiagramSources('json', { onRepoDocumentLoaded: onRepoLoaded })

  const mapDefinition = useCallback(
    (d: DiagramDefinition) => mapJsonTreeDefinitionToSyncfusion(d, layoutId),
    [layoutId],
  )

  const activeLayoutLabel = useMemo(
    () => JSON_DIAGRAM_LAYOUT_CARDS.find((c) => c.id === layoutId)?.title,
    [layoutId],
  )

  const { definition, error, valid } = useMemo(() => {
    try {
      const parsed: unknown = JSON.parse(jsonText)
      const def = jsonToTreeDiagramDefinition(parsed, {
        id: 'json-live',
        title: 'JSON → tree',
        rootLabel: 'document',
      })
      return { definition: def, error: null as string | null, valid: true }
    } catch (e) {
      return {
        definition: null as DiagramDefinition | null,
        error: e instanceof Error ? e.message : 'Invalid JSON',
        valid: false,
      }
    }
  }, [jsonText])

  const exportJson = useCallback(() => {
    const blob = new Blob([jsonText], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = exportName.trim() || 'diagram.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [exportName, jsonText])

  const onPickFile = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const file = ev.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        setJsonText(String(reader.result ?? ''))
        setExportName(file.name)
      }
      reader.readAsText(file)
      ev.target.value = ''
    },
    [],
  )

  return (
    <div className="json-diagram-page">
      <header className="json-diagram-page__header page-header">
        <h1>JSON → diagram</h1>
        <p className="lede">
          Edit JSON on the left; pick a layout below the editor — hierarchical,
          mind map, radial, grid, swimlane by depth, or wireframe. Choose a team
          to load or save files under <code>diagram-sources</code> (dev save
          updates the catalogue).
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
        onFileChange={onPickFile}
        accept=".json,application/json"
        importLabel="Import JSON…"
        onExportDownload={exportJson}
        exportButtonLabel="Export JSON"
        saveToRepoLabel="Save JSON to repo"
        onSaveToRepo={() => void saveToRepo(jsonText, exportName)}
        onDeleteFromRepo={() => void deleteFromRepo()}
        saveBusy={saveBusy}
        deleteBusy={deleteBusy}
        isDev={isDev}
        saveError={saveError}
        selectedRepoDoc={selectedRepoDoc}
      />

      <div className="json-diagram-page__split">
        <section className="json-diagram-page__editor" aria-label="JSON editor">
          <label className="json-diagram-page__editor-label" htmlFor="json-source">
            Source JSON
          </label>
          <textarea
            id="json-source"
            className="json-diagram-page__textarea"
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
          />
          <div
            className={
              valid
                ? 'json-diagram-page__status json-diagram-page__status--ok'
                : 'json-diagram-page__status json-diagram-page__status--err'
            }
          >
            {valid ? '✓ Valid JSON' : `✗ ${error}`}
          </div>

          <fieldset className="json-diagram-page__layout-fieldset">
            <legend className="json-diagram-page__layout-legend">
              Layout &amp; view
            </legend>
            <div
              className="json-diagram-page__layout-grid"
              role="group"
              aria-label="Diagram layout presets"
            >
              {JSON_DIAGRAM_LAYOUT_CARDS.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  className={
                    card.id === layoutId
                      ? 'json-diagram-page__layout-card json-diagram-page__layout-card--active'
                      : 'json-diagram-page__layout-card'
                  }
                  onClick={() => setLayoutId(card.id)}
                  aria-pressed={card.id === layoutId}
                >
                  <span className="json-diagram-page__layout-card-title">
                    {card.title}
                  </span>
                  <span className="json-diagram-page__layout-card-desc">
                    {card.description}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
        </section>

        <section
          className="json-diagram-page__diagram"
          aria-label="JSON structure diagram"
        >
          <div className="json-diagram-page__diagram-head">
            <span className="json-diagram-page__diagram-title">
              {activeLayoutLabel ?? 'Diagram'}
            </span>
            {definition ? (
              <span className="json-diagram-page__node-count">
                Nodes: {definition.nodes.length}
              </span>
            ) : null}
          </div>
          <div className="json-diagram-page__diagram-canvas">
            {valid && definition ? (
              <Suspense
                fallback={
                  <p className="diagram-loading">Loading diagram engine…</p>
                }
              >
                <DiagramCanvas
                  definition={definition}
                  mapDefinition={mapDefinition}
                  instanceKey={`${jsonText}::${layoutId}`}
                  height="calc(100vh - 220px)"
                  aria-label={`JSON structure: ${activeLayoutLabel ?? 'diagram'}`}
                />
              </Suspense>
            ) : (
              <p className="json-diagram-page__placeholder">
                Fix JSON to preview the tree.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
