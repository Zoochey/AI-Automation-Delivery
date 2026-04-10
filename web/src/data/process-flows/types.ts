export type ProcessFlowDocument = {
  id: string
  /** Short label in the PDF dropdown */
  title: string
  /** URL under site root, e.g. /process-flows/internal-it/map.pdf */
  path: string
}

export type ProcessFlowCatalogFile = {
  version: 1
  documents: Record<string, ProcessFlowDocument[]>
}
