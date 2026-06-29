interface EntryHeaderProps {
  /** Primary line, left side (role, institution, award title). */
  title: string
  /** Secondary line under the title (company, qualification, issuer). */
  subtitle?: string
  /** Top-right meta (date range). */
  meta?: string
  /** Bottom-right meta under the date (location). */
  metaSub?: string
}

export default function EntryHeader({ title, subtitle, meta, metaSub }: EntryHeaderProps) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <div>
        <h3 className="font-medium text-neutral-900">{title}</h3>
        {subtitle && <p className="text-sm text-neutral-600">{subtitle}</p>}
      </div>
      {(meta || metaSub) && (
        <div className="shrink-0 text-right">
          {meta && (
            <p className="font-mono text-xs text-neutral-500 whitespace-nowrap">{meta}</p>
          )}
          {metaSub && <p className="text-sm text-neutral-500">{metaSub}</p>}
        </div>
      )}
    </div>
  )
}
