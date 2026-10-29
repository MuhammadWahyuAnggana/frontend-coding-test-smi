type Props = {
  label: string
  value: string
  note: string
  accent?: boolean
}

export function MetricCard({ label, value, note, accent = false }: Props) {
  return (
    <article className={`metric-card${accent ? ' metric-card--accent' : ''}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  )
}
