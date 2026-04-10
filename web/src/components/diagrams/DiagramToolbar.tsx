type Props = {
  title: string
  subtitle?: string
}

export function DiagramToolbar({ title, subtitle }: Props) {
  return (
    <div className="diagram-toolbar">
      <div className="diagram-toolbar__text">
        <h2 className="diagram-toolbar__title">{title}</h2>
        {subtitle ? (
          <p className="diagram-toolbar__subtitle">{subtitle}</p>
        ) : null}
      </div>
      <div className="diagram-toolbar__actions" aria-hidden="true">
        <span className="diagram-toolbar__hint">
          Pan and zoom with the diagram surface
        </span>
      </div>
    </div>
  )
}
