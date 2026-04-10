/**
 * Executive alignment for reporting packs (organizational ownership).
 * Extend `OWNERSHIP_PACKS` or `BASE_ORG_ROWS` to add Syncfusion diagram nodes.
 */

export type OrgChartRow = {
  /** Unique key for Syncfusion data binding (must match ReportingPerson on children). */
  Name: string
  ReportingPerson?: string
  /** Primary label on the node. */
  Title: string
  /** Subtitle / domain line. */
  Domain: string
  /** Used for colouring in the diagram. */
  Role: string
}

/** Shared executive tree: CEO and direct reports. */
export const BASE_ORG_ROWS: OrgChartRow[] = [
  {
    Name: 'CEO',
    Title: 'Chief Executive Officer',
    Domain: 'Executive',
    Role: 'Executive',
  },
  {
    Name: 'CFO',
    ReportingPerson: 'CEO',
    Title: 'Chief Financial Officer',
    Domain: 'Finance',
    Role: 'Finance',
  },
  {
    Name: 'CIO',
    ReportingPerson: 'CEO',
    Title: 'Chief Information Officer',
    Domain: 'Internal IT / Systems',
    Role: 'IT',
  },
  {
    Name: 'CTO',
    ReportingPerson: 'CEO',
    Title: 'Chief Technology Officer',
    Domain: 'Product & Technology',
    Role: 'Technology',
  },
  {
    Name: 'COO',
    ReportingPerson: 'CEO',
    Title: 'COO (OptiComm)',
    Domain: 'Network Delivery / Construction',
    Role: 'Operations',
  },
  {
    Name: 'CCO',
    ReportingPerson: 'CEO',
    Title: 'Chief Customer Officer',
    Domain: 'Customer Operations',
    Role: 'Customer',
  },
  {
    Name: 'Legal',
    ReportingPerson: 'CEO',
    Title: 'Legal',
    Domain: 'Governance & Risk',
    Role: 'Legal',
  },
  {
    Name: 'People',
    ReportingPerson: 'CEO',
    Title: 'People',
    Domain: 'HR / Workforce',
    Role: 'HR',
  },
  {
    Name: 'RetailExec',
    ReportingPerson: 'CEO',
    Title: 'Retail Executive',
    Domain: 'Retail Delivery',
    Role: 'Retail',
  },
]

export type OwnershipPack = {
  id: string
  /** Short label in the selector. */
  label: string
  executiveRole: string
  domain: string
  /** `Name` field on the org chart node this pack aligns to (parent for seed + custom nodes). */
  chartParentName: string
  notes?: string
  /** Optional starter children under this executive (edit to add real reporting-pack components). */
  seedComponents?: OrgChartRow[]
}

export const OWNERSHIP_PACKS: OwnershipPack[] = [
  {
    id: 'ceo',
    label: 'CEO',
    executiveRole: 'CEO',
    domain: 'Executive',
    chartParentName: 'CEO',
    notes: 'Organisation-wide ownership; add executive-level components below as needed.',
  },
  {
    id: 'cfo',
    label: 'CFO',
    executiveRole: 'CFO',
    domain: 'Finance',
    chartParentName: 'CFO',
    notes: 'Finance reporting packs align here.',
    seedComponents: [
      {
        Name: 'Finance-ExamplePack',
        ReportingPerson: 'CFO',
        Title: 'Example reporting pack',
        Domain: 'Edit or remove in orgOwnershipPacks.ts',
        Role: 'Component',
      },
    ],
  },
  {
    id: 'cio',
    label: 'CIO',
    executiveRole: 'CIO',
    domain: 'Internal IT / Systems',
    chartParentName: 'CIO',
    notes: 'Internal IT and systems ownership.',
  },
  {
    id: 'cto',
    label: 'CTO',
    executiveRole: 'CTO',
    domain: 'Product & Technology',
    chartParentName: 'CTO',
    notes: 'Product and technology ownership.',
  },
  {
    id: 'coo',
    label: 'COO (OptiComm)',
    executiveRole: 'COO (OptiComm)',
    domain: 'Network Delivery / Construction',
    chartParentName: 'COO',
    notes: 'Network delivery and construction.',
  },
  {
    id: 'cco',
    label: 'CCO',
    executiveRole: 'CCO',
    domain: 'Customer Operations',
    chartParentName: 'CCO',
    notes: 'Customer operations ownership.',
  },
  {
    id: 'legal',
    label: 'Legal',
    executiveRole: 'Legal',
    domain: 'Governance & Risk',
    chartParentName: 'Legal',
    notes: 'Governance and risk alignment.',
  },
  {
    id: 'people',
    label: 'People (HR)',
    executiveRole: 'People',
    domain: 'HR / Workforce',
    chartParentName: 'People',
    notes: 'Workforce and HR-aligned packs.',
  },
  {
    id: 'retail',
    label: 'Retail Executive',
    executiveRole: 'Retail Executive',
    domain: 'Retail Delivery',
    chartParentName: 'RetailExec',
    notes: 'Retail delivery ownership.',
  },
]

export function mergeOrgChartData(
  base: OrgChartRow[],
  pack: OwnershipPack,
  extras: OrgChartRow[],
): OrgChartRow[] {
  const seed = pack.seedComponents ?? []
  const byName = new Map<string, OrgChartRow>()

  for (const row of base) {
    byName.set(row.Name, { ...row })
  }
  for (const row of seed) {
    byName.set(row.Name, { ...row })
  }
  for (const row of extras) {
    byName.set(row.Name, { ...row })
  }

  return Array.from(byName.values())
}
