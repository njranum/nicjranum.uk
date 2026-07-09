import type { Project } from '@/lib/projects'

const styles: Record<Project['status'], { label: string; className: string }> = {
  shipped: {
    label: 'Shipped',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  wip: {
    label: 'In Progress',
    className: 'border-amber-200 bg-amber-50 text-amber-700',
  },
}

export default function StatusBadge({ status }: { status: Project['status'] }) {
  const { label, className } = styles[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  )
}
