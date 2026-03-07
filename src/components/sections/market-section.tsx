import { SectionTitle } from '@/components/common/section-title'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MARKET_SEGMENTS } from '@/data/site-content'

export function MarketSection() {
  return (
    <section id="mercado" className="px-4 py-20 md:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <SectionTitle
          eyebrow="Mercado"
          title="Especializacao setorial para cenarios complexos"
          description="Atuamos em mercados com alta exigencia de operacao, recorrencia e governanca de margem."
        />

        <div className="grid gap-4 md:grid-cols-3">
          {MARKET_SEGMENTS.map((segment) => (
            <Card key={segment.title} className="rounded-2xl border-border/60 bg-card/80">
              <CardHeader>
                <CardTitle>{segment.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{segment.description}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
