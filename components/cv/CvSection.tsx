interface CvSectionProps {
  title: string
  children: React.ReactNode
}

export default function CvSection({ title, children }: CvSectionProps) {
  return (
    <section className="border-t border-neutral-200 pt-6 print:pt-4">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 print:mb-2">
        {title}
      </h2>
      <div className="space-y-6 print:space-y-4">{children}</div>
    </section>
  )
}
