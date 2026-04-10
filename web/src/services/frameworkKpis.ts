import type { DiagramCatalogEntry } from '../models/diagramTypes.ts'
import type { DiagramSourceCatalogFile } from '../data/diagram-sources/types.ts'
import type { ProcessFlowCatalogFile } from '../data/process-flows/types.ts'
import type { TeamProcessFlow } from '../data/process-flows/teams.ts'

/** Numbered standards 1–6 in navigation (Data through Definitions & document control). */
export const CORE_AI_STANDARDS_COUNT = 6

export type TeamKpiRow = {
  teamId: string
  label: string
  pdfs: number
  jsonSources: number
  mermaidSources: number
  /** Registered entries in the diagram standards repository for this team */
  diagramLibrary: number
}

export function buildTeamKpiRows(
  processFlows: ProcessFlowCatalogFile,
  diagramSources: DiagramSourceCatalogFile,
  diagramEntries: DiagramCatalogEntry[],
  teams: TeamProcessFlow[],
): TeamKpiRow[] {
  const libraryByTeam = new Map<string, number>()
  for (const e of diagramEntries) {
    libraryByTeam.set(
      e.teamId,
      (libraryByTeam.get(e.teamId) ?? 0) + 1,
    )
  }

  return teams.map((t) => ({
    teamId: t.id,
    label: t.label,
    pdfs: processFlows.documents[t.id]?.length ?? 0,
    jsonSources: diagramSources.json[t.id]?.length ?? 0,
    mermaidSources: diagramSources.mermaid[t.id]?.length ?? 0,
    diagramLibrary: libraryByTeam.get(t.id) ?? 0,
  }))
}

export type KpiTotals = {
  pdfs: number
  jsonSources: number
  mermaidSources: number
  diagramLibrary: number
}

export function sumKpiTotals(rows: TeamKpiRow[]): KpiTotals {
  return rows.reduce(
    (acc, r) => ({
      pdfs: acc.pdfs + r.pdfs,
      jsonSources: acc.jsonSources + r.jsonSources,
      mermaidSources: acc.mermaidSources + r.mermaidSources,
      diagramLibrary: acc.diagramLibrary + r.diagramLibrary,
    }),
    {
      pdfs: 0,
      jsonSources: 0,
      mermaidSources: 0,
      diagramLibrary: 0,
    },
  )
}
