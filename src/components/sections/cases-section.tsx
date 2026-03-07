import { SectionTitle } from '@/components/common/section-title'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CASES } from '@/data/site-content'

export function CasesSection() {
  return (
    <section id="cases" className="px-4 py-20 md:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <SectionTitle
          eyebrow="Cases"
          title="Resultados praticos em operacoes de varejo"
          description="Projetos com foco em impacto de negocio, sem perder governanca tecnica."
        />

        <div className="grid gap-4 md:grid-cols-3">
          {CASES.map((item) => (
            <Card key={item.name} className="rounded-2xl border-border/60 bg-card/80">
              <CardHeader>
                <Badge variant="outline" className="w-fit rounded-full">
                  {item.name}
                </Badge>
                <CardTitle className="text-lg leading-snug">{item.headline}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {item.metrics.map((metric) => (
                    <li key={metric}>• {metric}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
