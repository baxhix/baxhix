import { SectionTitle } from '@/components/common/section-title'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { METHODOLOGY } from '@/data/site-content'

export function MethodologySection() {
  return (
    <section id="metodologia" className="px-4 py-20 md:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <SectionTitle
          eyebrow="Metodo"
          title="Da estrategia a execucao com cadencia"
          description="Entregamos clareza de prioridade, alinhamento entre times e velocidade de implementacao."
        />

        <div className="grid gap-4 md:grid-cols-3">
          {METHODOLOGY.map((step, index) => (
            <Card key={step.title} className="rounded-2xl border-border/60 bg-card/80">
              <CardHeader>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.14em]">
                  Etapa {index + 1}
                </p>
                <CardTitle>{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{step.description}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
