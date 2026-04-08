import { useEffect, useId, useRef } from 'react'
import mermaid from 'mermaid'

type Props = {
  chart: string
  'aria-label'?: string
}

export function MermaidDiagram({ chart, 'aria-label': ariaLabel }: Props) {
  const outRef = useRef<HTMLDivElement>(null)
  const reactId = useId()
  const safeId = `m-${reactId.replace(/:/g, '')}`
  const seqRef = useRef(0)

  useEffect(() => {
    const el = outRef.current
    if (!el) return

    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: dark ? 'dark' : 'default',
      flowchart: { htmlLabels: true, curve: 'basis' },
    })

    const graphId = `${safeId}-g-${++seqRef.current}`
    let cancelled = false
    mermaid
      .render(graphId, chart)
      .then(({ svg }) => {
        if (!cancelled && outRef.current) outRef.current.innerHTML = svg
      })
      .catch(() => {
        if (!cancelled && outRef.current) {
          outRef.current.innerHTML =
            '<p class="mermaid-error">Could not render diagram.</p>'
        }
      })

    return () => {
      cancelled = true
    }
  }, [chart, safeId])

  return (
    <div
      className="mermaid-wrap"
      ref={outRef}
      role="img"
      aria-label={ariaLabel ?? 'Framework delivery flow diagram'}
    />
  )
}
