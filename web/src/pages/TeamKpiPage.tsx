import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import diagramSourcesCatalog from '../data/diagram-sources/catalog.json'
import { DIAGRAM_CATALOG } from '../data/diagrams/catalog.ts'
import processFlowsCatalog from '../data/process-flows/catalog.json'
import type { DiagramSourceCatalogFile } from '../data/diagram-sources/types.ts'
import type { ProcessFlowCatalogFile } from '../data/process-flows/types.ts'
import { TEAM_PROCESS_FLOWS } from '../data/process-flows/teams.ts'
import {
  buildTeamKpiRows,
  CORE_AI_STANDARDS_COUNT,
  sumKpiTotals,
} from '../services/frameworkKpis.ts'

type MetricSeries = 'pdf' | 'json' | 'mermaid' | 'library'

function Metric({
  value,
  label,
  hint,
  series,
  activeSeries,
}: {
  value: number
  label: string
  hint: string
  series: MetricSeries
  activeSeries: MetricSeries | null
}) {
  const isActive = activeSeries === null || activeSeries === series
  return (
    <div
      className={`kpi-team-card__metric kpi-metric kpi-metric--${series} ${
        isActive ? 'kpi-metric--active' : 'kpi-metric--muted'
      }`}
    >
      <span className="kpi-team-card__value" aria-label={`${label}: ${value}`}>
        {value}
      </span>
      <span className="kpi-team-card__label">{label}</span>
      <span className="kpi-team-card__hint">{hint}</span>
    </div>
  )
}

export function TeamKpiPage() {
  const [activeSeries, setActiveSeries] = useState<MetricSeries | null>(null)
  const rows = useMemo(
    () =>
      buildTeamKpiRows(
        processFlowsCatalog as ProcessFlowCatalogFile,
        diagramSourcesCatalog as DiagramSourceCatalogFile,
        DIAGRAM_CATALOG,
        TEAM_PROCESS_FLOWS,
      ),
    [],
  )

  const totals = useMemo(() => sumKpiTotals(rows), [rows])

  return (
    <div className="kpi-page">
      <header className="page-header kpi-page__header">
        <h1>KPI snapshot</h1>
        <p className="lede kpi-page__lede">
          High-level counts by executive segment: process PDFs, JSON and Mermaid
          sources under <code>diagram-sources</code>, and diagram library
          entries. Figures come from the local catalogues shipped with this app.
        </p>
      </header>

      <section className="kpi-page__hero" aria-label="Framework summary">
        <article className="kpi-hero-card kpi-hero-card--standards">
          <p className="kpi-hero-card__eyebrow">Framework</p>
          <p
            className="kpi-hero-card__figure"
            aria-label={`${CORE_AI_STANDARDS_COUNT} core AI standards`}
          >
            {CORE_AI_STANDARDS_COUNT}
          </p>
          <h2 className="kpi-hero-card__title">Core AI standards</h2>
          <p className="kpi-hero-card__body">
            Numbered standards from Data through Definitions — the baseline
            policy set in this draft framework.
          </p>
          <Link className="kpi-hero-card__link" to="/standards/data">
            Open standards →
          </Link>
        </article>

        <article className="kpi-hero-card kpi-hero-card--totals">
          <p className="kpi-hero-card__eyebrow">Across all teams</p>
          <h2 className="kpi-hero-card__title">Document inventory</h2>
          <ul className="kpi-totals-list">
            <li className="kpi-totals--pdf">
              <button
                type="button"
                className={`kpi-totals-list__button ${
                  activeSeries === 'pdf' ? 'kpi-totals-list__button--active' : ''
                }`}
                onClick={() =>
                  setActiveSeries((prev) => (prev === 'pdf' ? null : 'pdf'))
                }
                aria-pressed={activeSeries === 'pdf'}
              >
                <span className="kpi-totals-list__value">{totals.pdfs}</span>
                <span className="kpi-totals-list__label">
                  Process PDFs
                  <span className="kpi-totals-list__hint">Highlight team PDF KPIs</span>
                </span>
              </button>
            </li>
            <li className="kpi-totals--json">
              <button
                type="button"
                className={`kpi-totals-list__button ${
                  activeSeries === 'json' ? 'kpi-totals-list__button--active' : ''
                }`}
                onClick={() =>
                  setActiveSeries((prev) => (prev === 'json' ? null : 'json'))
                }
                aria-pressed={activeSeries === 'json'}
              >
                <span className="kpi-totals-list__value">{totals.jsonSources}</span>
                <span className="kpi-totals-list__label">
                  JSON sources
                  <span className="kpi-totals-list__hint">Highlight team JSON KPIs</span>
                </span>
              </button>
            </li>
            <li className="kpi-totals--mermaid">
              <button
                type="button"
                className={`kpi-totals-list__button ${
                  activeSeries === 'mermaid' ? 'kpi-totals-list__button--active' : ''
                }`}
                onClick={() =>
                  setActiveSeries((prev) => (prev === 'mermaid' ? null : 'mermaid'))
                }
                aria-pressed={activeSeries === 'mermaid'}
              >
                <span className="kpi-totals-list__value">
                  {totals.mermaidSources}
                </span>
                <span className="kpi-totals-list__label">
                  Mermaid files
                  <span className="kpi-totals-list__hint">Highlight Mermaid KPIs</span>
                </span>
              </button>
            </li>
            <li className="kpi-totals--library">
              <button
                type="button"
                className={`kpi-totals-list__button ${
                  activeSeries === 'library'
                    ? 'kpi-totals-list__button--active'
                    : ''
                }`}
                onClick={() =>
                  setActiveSeries((prev) => (prev === 'library' ? null : 'library'))
                }
                aria-pressed={activeSeries === 'library'}
              >
                <span className="kpi-totals-list__value">
                  {totals.diagramLibrary}
                </span>
                <span className="kpi-totals-list__label">
                  Library diagrams
                  <span className="kpi-totals-list__hint">Highlight library KPIs</span>
                </span>
              </button>
            </li>
          </ul>
        </article>
      </section>

      <section className="kpi-page__teams" aria-label="KPIs by team">
        <h2 className="kpi-page__section-title">By team</h2>
        <p className="kpi-page__section-lede">
          Same segment labels as business process flows and diagram ownership.
          Colours match metric type for consistency with future dashboards (e.g.{' '}
          Power BI).
        </p>
        <p className="kpi-page__legend">
          <span className="kpi-page__legend-item">
            <span className="kpi-page__legend-swatch kpi-page__legend-swatch--pdf" />
            PDFs
          </span>
          <span className="kpi-page__legend-item">
            <span className="kpi-page__legend-swatch kpi-page__legend-swatch--json" />
            JSON
          </span>
          <span className="kpi-page__legend-item">
            <span className="kpi-page__legend-swatch kpi-page__legend-swatch--mermaid" />
            Mermaid
          </span>
          <span className="kpi-page__legend-item">
            <span className="kpi-page__legend-swatch kpi-page__legend-swatch--library" />
            Library
          </span>
        </p>
        <div className="kpi-team-grid">
          {rows.map((row) => (
            <article
              key={row.teamId}
              className="kpi-team-card"
              aria-label={`${row.label} metrics`}
            >
              <h3 className="kpi-team-card__title">{row.label}</h3>
              <div className="kpi-team-card__metrics">
                <Metric
                  value={row.pdfs}
                  label="PDFs"
                  hint="Process maps"
                  series="pdf"
                  activeSeries={activeSeries}
                />
                <Metric
                  value={row.jsonSources}
                  label="JSON"
                  hint="Source files"
                  series="json"
                  activeSeries={activeSeries}
                />
                <Metric
                  value={row.mermaidSources}
                  label="Mermaid"
                  hint=".mmd files"
                  series="mermaid"
                  activeSeries={activeSeries}
                />
                <Metric
                  value={row.diagramLibrary}
                  label="Library"
                  hint="Catalogue"
                  series="library"
                  activeSeries={activeSeries}
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
