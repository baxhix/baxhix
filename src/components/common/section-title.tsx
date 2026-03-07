import { Badge } from '@/components/ui/badge'

type SectionTitleProps = {
  eyebrow: string
  title: string
  description: string
}

export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1 uppercase tracking-[0.14em]">
        {eyebrow}
      </Badge>
      <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      <p className="mt-4 text-muted-foreground md:text-lg">{description}</p>
    </div>
  )
}
