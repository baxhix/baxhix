import { CheckCircle2 } from 'lucide-react'

import { SectionTitle } from '@/components/common/section-title'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SOLUTION_PILLARS } from '@/data/site-content'

export function SolutionSection() {
  return (
    <section id="solucao" className="px-4 py-20 md:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <SectionTitle
          eyebrow="Solucao"
          title="Modelo de execucao orientado a resultado"
          description="Implementamos uma estrutura operacional que conecta tecnologia, comercial e dados."
        />

        <div className="grid gap-4 md:grid-cols-2">
          {SOLUTION_PILLARS.map((pillar) => (
            <Card key={pillar.title} className="rounded-2xl border-border/60 bg-card/80">
              <CardHeader className="flex flex-row items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 text-primary" />
                <div>
                  <CardTitle className="text-xl">{pillar.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{pillar.description}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
