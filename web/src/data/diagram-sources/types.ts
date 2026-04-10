export type DiagramSourceDocument = {
  id: string
  title: string
  /** URL under site root, e.g. /diagram-sources/executive/sample.json */
  path: string
}

export type DiagramSourceCatalogFile = {
  version: 1
  json: Record<string, DiagramSourceDocument[]>
  mermaid: Record<string, DiagramSourceDocument[]>
}
