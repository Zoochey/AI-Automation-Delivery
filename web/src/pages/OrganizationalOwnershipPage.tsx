import { lazy, Suspense, useMemo, useState } from 'react'

import {
  BASE_ORG_ROWS,
  mergeOrgChartData,
  OWNERSHIP_PACKS,
  type OrgChartRow,
  type OwnershipPack,
} from '../data/orgOwnershipPacks.ts'

const OwnershipOrgDiagram = lazy(() =>
  import('../components/OwnershipOrgDiagram.tsx').then((m) => ({
    default: m.OwnershipOrgDiagram,
  })),
)

function slugId(label: string) {
  const base = label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `cmp-${base}-${Date.now().toString(36)}`
}

export function OrganizationalOwnershipPage() {
  const [selectedPackId, setSelectedPackId] = useState(OWNERSHIP_PACKS[0].id)
  const [extraLabel, setExtraLabel] = useState('')
  const [extras, setExtras] = useState<OrgChartRow[]>([])

  const selectedPack = useMemo<OwnershipPack>(
    () =>
      OWNERSHIP_PACKS.find((p) => p.id === selectedPackId) ?? OWNERSHIP_PACKS[0],
    [selectedPackId],
  )

  const mergedRows = useMemo(
    () => mergeOrgChartData(BASE_ORG_ROWS, selectedPack, extras),
    [selectedPack, extras],
  )

  const diagramKey = `${selectedPackId}-${extras.length}-${extras.map((e) => e.Name).join('|')}`

  const addComponent = () => {
    const title = extraLabel.trim()
    if (!title) return

    const row: OrgChartRow = {
      Name: slugId(title),
      ReportingPerson: selectedPack.chartParentName,
      Title: title,
      Domain: 'Reporting-pack component',
      Role: 'Component',
    }
    setExtras((prev) => [...prev, row])
    setExtraLabel('')
  }

  const removeExtra = (name: string) => {
    setExtras((prev) => prev.filter((r) => r.Name !== name))
  }

  return (
    <>
      <header className="page-header">
        <h1>Organizational ownership (Syncfusion)</h1>
        <p className="lede">
          Executive alignment for reporting packs: pick a domain, view the org
          chart, and add component nodes under the selected owner without
          leaving the page.
        </p>
      </header>

      <section className="section">
        <h2>Executive alignment</h2>
        <p>
          Each reporting pack maps to organisational ownership. Extend the
          chart by adding components under the selected executive.
        </p>
        <div className="table-scroll">
          <table className="simple">
            <thead>
              <tr>
                <th>Executive role</th>
                <th>Domain</th>
              </tr>
            </thead>
            <tbody>
              {OWNERSHIP_PACKS.map((p) => (
                <tr key={p.id}>
                  <td>{p.executiveRole}</td>
                  <td>{p.domain}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <h2>Select ownership focus</h2>
        <label className="flow-selector" htmlFor="ownership-pack-select">
          Pack / executive
          <select
            id="ownership-pack-select"
            value={selectedPackId}
            onChange={(e) => {
              setSelectedPackId(e.target.value)
              setExtras([])
            }}
          >
            {OWNERSHIP_PACKS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label} — {p.domain}
              </option>
            ))}
          </select>
        </label>
        {selectedPack.notes ? <p>{selectedPack.notes}</p> : null}
      </section>

      <section className="section">
        <h2>Add components dynamically</h2>
        <p>
          New nodes attach under{' '}
          <strong>{selectedPack.executiveRole}</strong> (
          <code>{selectedPack.chartParentName}</code> in chart data). Edit{' '}
          <code>OWNERSHIP_PACKS</code> or <code>BASE_ORG_ROWS</code> in{' '}
          <code>src/data/orgOwnershipPacks.ts</code> for permanent structure.
        </p>
        <div className="ownership-add-row">
          <input
            type="text"
            className="ownership-add-input"
            placeholder="e.g. QBR automation pack, Control tower, RACI workflow"
            value={extraLabel}
            onChange={(e) => setExtraLabel(e.target.value)}
            aria-label="Component label to add under selected executive"
          />
          <button type="button" className="ownership-add-btn" onClick={addComponent}>
            Add component
          </button>
        </div>
        {extras.length > 0 ? (
          <ul className="ownership-extras-list">
            {extras.map((row) => (
              <li key={row.Name}>
                <span>{row.Title}</span>
                <button
                  type="button"
                  className="ownership-remove-btn"
                  onClick={() => removeExtra(row.Name)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="section">
        <h2>Organisation chart</h2>
        <p>
          Rendered with Syncfusion React Diagram (
          <strong>OrganizationalChart</strong> layout). Pan and zoom with the
          diagram controls.
        </p>
        <Suspense
          fallback={<p className="diagram-loading">Loading diagram…</p>}
        >
          <OwnershipOrgDiagram rows={mergedRows} diagramKey={diagramKey} />
        </Suspense>
      </section>
    </>
  )
}
