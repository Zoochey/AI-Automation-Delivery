import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'

import { DiagramLibraryPanel } from '../components/diagrams/DiagramLibraryPanel.tsx'
import { DiagramToolbar } from '../components/diagrams/DiagramToolbar.tsx'
import { NodeDetailsPanel } from '../components/diagrams/NodeDetailsPanel.tsx'
import { DIAGRAM_CATALOG } from '../data/diagrams/catalog.ts'
import { teamLabel } from '../data/process-flows/teams.ts'
import type { PortalCategory } from '../models/diagramTypes.ts'
import { findDiagramNode } from '../services/diagramMapper.ts'

const DiagramCanvas = lazy(() =>
  import('../components/diagrams/DiagramCanvas.tsx').then((m) => ({
    default: m.DiagramCanvas,
  })),
)

export function DiagramPortalPage() {
  const [selectedId, setSelectedId] = useState(DIAGRAM_CATALOG[0].definition.id)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<PortalCategory | 'all'>(
    'all',
  )
  const [teamFilter, setTeamFilter] = useState<string | 'all'>('all')
  const [visibleIds, setVisibleIds] = useState<string[]>(() =>
    DIAGRAM_CATALOG.map((e) => e.definition.id),
  )

  const onFilteredIdsChange = useCallback((ids: string[]) => {
    setVisibleIds((prev) => {
      if (
        prev.length === ids.length &&
        prev.every((v, i) => v === ids[i])
      ) {
        return prev
      }
      return ids
    })
  }, [])

  useEffect(() => {
    if (visibleIds.length === 0) return
    if (!visibleIds.includes(selectedId)) {
      setSelectedId(visibleIds[0])
      setSelectedNodeId(null)
    }
  }, [visibleIds, selectedId])

  const selectedEntry = useMemo(
    () =>
      DIAGRAM_CATALOG.find((e) => e.definition.id === selectedId) ??
      DIAGRAM_CATALOG[0],
    [selectedId],
  )

  const selectedNode = useMemo(
    () => findDiagramNode(selectedEntry.definition, selectedNodeId),
    [selectedEntry, selectedNodeId],
  )

  const canvasKey = `${selectedEntry.definition.id}-${selectedEntry.updatedAt}`

  return (
    <div className="diagram-portal">
      <header className="diagram-portal__header page-header">
        <h1>Diagram standards repository</h1>
        <p className="lede">
          JSON-defined process and organisation views rendered with Syncfusion.
          Mermaid stays the fast sketch layer; this portal is the structured,
          shareable catalogue for standards and delivery maps.
        </p>
      </header>

      <div className="diagram-portal__grid">
        <DiagramLibraryPanel
          entries={DIAGRAM_CATALOG}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id)
            setSelectedNodeId(null)
          }}
          search={search}
          onSearchChange={setSearch}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          teamFilter={teamFilter}
          onTeamChange={setTeamFilter}
          onFilteredIdsChange={onFilteredIdsChange}
        />

        <section className="diagram-portal__canvas" aria-label="Diagram canvas">
          <DiagramToolbar
            title={selectedEntry.definition.title}
            subtitle={selectedEntry.summary}
          />
          <div className="diagram-portal__meta-bar">
            <span className="diagram-portal__pill">
              {selectedEntry.sourceType}
            </span>
            <span className="diagram-portal__pill">v{selectedEntry.version}</span>
            <span className={`diagram-portal__pill diagram-portal__pill--${selectedEntry.status}`}>
              {selectedEntry.status}
            </span>
            {selectedEntry.owner ? (
              <span className="diagram-portal__pill">{selectedEntry.owner}</span>
            ) : null}
            {selectedEntry.department ? (
              <span className="diagram-portal__pill diagram-portal__pill--muted">
                {selectedEntry.department}
              </span>
            ) : null}
            <span className="diagram-portal__pill diagram-portal__pill--team">
              {teamLabel(selectedEntry.teamId)}
            </span>
          </div>
          {selectedEntry.definition.description ? (
            <p className="diagram-portal__desc">
              {selectedEntry.definition.description}
            </p>
          ) : null}
          <Suspense
            fallback={
              <p className="diagram-loading diagram-portal__loading">
                Loading diagram…
              </p>
            }
          >
            <div className="diagram-portal__diagram-stage">
              <DiagramCanvas
                definition={selectedEntry.definition}
                instanceKey={canvasKey}
                height="calc(100vh - 240px)"
                onNodeSelect={setSelectedNodeId}
              />
            </div>
          </Suspense>
        </section>

        <NodeDetailsPanel
          node={selectedNode}
          diagramTitle={selectedEntry.definition.title}
        />
      </div>
    </div>
  )
}
