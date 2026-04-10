import { useEffect, useMemo } from 'react'

import {
  TEAM_PROCESS_FLOWS,
  teamLabel,
} from '../../data/process-flows/teams.ts'
import type {
  DiagramCatalogEntry,
  PortalCategory,
} from '../../models/diagramTypes.ts'
import { PORTAL_CATEGORY_LABELS } from '../../models/diagramTypes.ts'

type Props = {
  entries: DiagramCatalogEntry[]
  selectedId: string
  onSelect: (id: string) => void
  search: string
  onSearchChange: (value: string) => void
  categoryFilter: PortalCategory | 'all'
  onCategoryChange: (value: PortalCategory | 'all') => void
  teamFilter: string | 'all'
  onTeamChange: (value: string | 'all') => void
  /** Lets the parent keep canvas selection in sync when filters hide the current diagram. */
  onFilteredIdsChange?: (ids: string[]) => void
}

const CATEGORY_ORDER: PortalCategory[] = [
  'organisation-maps',
  'process-flows',
  'bpmn-models',
  'report-lineage',
  'data-structures',
  'standards-controls',
  'appendices',
]

export function DiagramLibraryPanel({
  entries,
  selectedId,
  onSelect,
  search,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  teamFilter,
  onTeamChange,
  onFilteredIdsChange,
}: Props) {
  const q = search.trim().toLowerCase()

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (categoryFilter !== 'all' && e.category !== categoryFilter) return false
      if (teamFilter !== 'all' && e.teamId !== teamFilter) return false
      if (!q) return true
      const hay = [
        e.definition.title,
        e.summary,
        e.definition.description ?? '',
        e.owner ?? '',
        e.department ?? '',
        teamLabel(e.teamId),
        ...e.tags,
      ]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [entries, categoryFilter, teamFilter, q])

  const filteredIdsKey = filtered.map((e) => e.definition.id).join('|')
  useEffect(() => {
    onFilteredIdsChange?.(filtered.map((e) => e.definition.id))
  }, [filteredIdsKey, onFilteredIdsChange, filtered])

  const byCategory = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: filtered.filter((e) => e.category === cat),
  })).filter((g) => g.items.length > 0)

  return (
    <aside className="diagram-library" aria-label="Diagram library">
      <h2 className="diagram-library__title">Repository</h2>
      <label className="diagram-library__search-label">
        Search
        <input
          type="search"
          className="diagram-library__search"
          value={search}
          onChange={(ev) => onSearchChange(ev.target.value)}
          placeholder="Title, tags, owner, department…"
          autoComplete="off"
        />
      </label>
      <label className="diagram-library__filter-label">
        Category
        <select
          className="diagram-library__select"
          value={categoryFilter}
          onChange={(ev) =>
            onCategoryChange(ev.target.value as PortalCategory | 'all')
          }
        >
          <option value="all">All categories</option>
          {CATEGORY_ORDER.map((c) => (
            <option key={c} value={c}>
              {PORTAL_CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
      </label>
      <label className="diagram-library__filter-label">
        Team
        <select
          className="diagram-library__select"
          value={teamFilter}
          onChange={(ev) =>
            onTeamChange(
              ev.target.value === 'all' ? 'all' : ev.target.value,
            )
          }
        >
          <option value="all">All teams</option>
          {TEAM_PROCESS_FLOWS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </label>
      <div className="diagram-library__groups">
        {byCategory.map(({ category, items }) => (
          <div key={category} className="diagram-library__group">
            <div className="diagram-library__group-label">
              {PORTAL_CATEGORY_LABELS[category]}
            </div>
            <ul className="diagram-library__list">
              {items.map((entry) => (
                <li key={entry.definition.id}>
                  <button
                    type="button"
                    className={
                      entry.definition.id === selectedId
                        ? 'diagram-card diagram-card--active'
                        : 'diagram-card'
                    }
                    onClick={() => onSelect(entry.definition.id)}
                  >
                    <span className="diagram-card__title">
                      {entry.definition.title}
                    </span>
                    <span className="diagram-card__summary">{entry.summary}</span>
                    <div className="diagram-card__team-line">
                      {teamLabel(entry.teamId)}
                    </div>
                    <div className="diagram-card__badges">
                      <span
                        className={`diagram-card__status diagram-card__status--${entry.status}`}
                      >
                        {entry.status}
                      </span>
                      <span className="diagram-card__ver">v{entry.version}</span>
                    </div>
                    {entry.tags.length > 0 ? (
                      <div className="diagram-card__tags">
                        {entry.tags.map((t) => (
                          <span key={t} className="diagram-card__tag">
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <div className="diagram-card__meta">
                      {entry.owner ? <span>{entry.owner}</span> : null}
                      {entry.department ? (
                        <span className="diagram-card__dept">
                          {entry.department}
                        </span>
                      ) : null}
                    </div>
                    <div className="diagram-card__dates">
                      <span>Updated {entry.updatedAt}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="diagram-library__empty">No diagrams match your filters.</p>
      ) : null}
    </aside>
  )
}
