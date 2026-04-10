/** JSON-first diagram definitions for Syncfusion rendering and future API/DB storage. */

export type PortalCategory =
  | 'organisation-maps'
  | 'process-flows'
  | 'bpmn-models'
  | 'report-lineage'
  | 'data-structures'
  | 'standards-controls'
  | 'appendices'

export type DiagramStatus = 'draft' | 'review' | 'published' | 'archived'

export type SourceType = 'manual' | 'mermaid' | 'imported'

export type DiagramKind =
  | 'org-chart'
  | 'flowchart'
  | 'process-map'
  | 'report-lineage'
  | 'tree-view'

export type FlowShapeHint =
  | 'Process'
  | 'Terminator'
  | 'Decision'
  | 'Data'

export type DiagramLayoutHint = {
  orientation?: 'TopToBottom' | 'BottomToTop' | 'LeftToRight' | 'RightToLeft'
  horizontalSpacing?: number
  verticalSpacing?: number
}

export type DiagramNode = {
  id: string
  label: string
  category?: string
  description?: string
  metadata?: Record<string, string | number | boolean | null>
  styleHint?: {
    flowShape?: FlowShapeHint
    fill?: string
    width?: number
    height?: number
  }
  /** Hierarchy layouts: parent node id; omit or empty for root */
  parentId?: string
}

export type DiagramEdge = {
  id: string
  source: string
  target: string
  label?: string
  category?: string
  metadata?: Record<string, string | number | boolean | null>
}

export type DiagramDefinition = {
  id: string
  title: string
  type: DiagramKind
  description?: string
  layout?: DiagramLayoutHint
  nodes: DiagramNode[]
  edges: DiagramEdge[]
  metadata?: Record<string, unknown>
}

export type DiagramCatalogEntry = {
  definition: DiagramDefinition
  category: PortalCategory
  /** Aligns with org-chart segments (`TEAM_PROCESS_FLOWS` ids). */
  teamId: string
  tags: string[]
  summary: string
  owner?: string
  department?: string
  version: string
  status: DiagramStatus
  createdAt: string
  updatedAt: string
  sourceType: SourceType
}

export const PORTAL_CATEGORY_LABELS: Record<PortalCategory, string> = {
  'organisation-maps': 'Organisation maps',
  'process-flows': 'Process flows',
  'bpmn-models': 'BPMN models',
  'report-lineage': 'Report lineage',
  'data-structures': 'Data structures',
  'standards-controls': 'Standards & controls',
  appendices: 'Appendices',
}
