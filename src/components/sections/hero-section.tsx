import { ArrowUpRight, TrendingUp } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type HeroSectionProps = {
  whatsappNumber: string
}

export function HeroSection({ whatsappNumber }: HeroSectionProps) {
  return (
    <section id="top" className="relative overflow-hidden px-4 pb-20 pt-20 md:px-6 md:pt-28">
      <div className="pointer-events-none absolute left-1/2 top-4 -z-10 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl" />

      <div className="mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-[1.3fr_1fr] md:items-end">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Ecossistema Unified Commerce
          </p>
          <h1 className="text-4xl leading-tight font-semibold tracking-tight md:text-6xl">
            Performance previsivel para varejo de Farma, Beleza e Pet.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
            Estruturamos operacao, dados e growth para transformar a sua jornada omnichannel em crescimento com margem.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contato" className={cn(buttonVariants({ size: 'lg' }), 'rounded-full px-8')}>
              Quero diagnostico
              <ArrowUpRight className="size-4" />
            </a>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'rounded-full px-8')}
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card/80 p-6 backdrop-blur">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground">
            <TrendingUp className="size-3.5" />
            Foco em margem + escala
          </div>
          <div className="grid gap-6 sm:grid-cols-3 md:grid-cols-1">
            <div>
              <p className="text-3xl font-semibold">+30%</p>
              <p className="text-sm text-muted-foreground">Aumento medio de receita digital</p>
            </div>
            <div>
              <p className="text-3xl font-semibold">-20%</p>
              <p className="text-sm text-muted-foreground">Reducao media de ruptura</p>
            </div>
            <div>
              <p className="text-3xl font-semibold">90 dias</p>
              <p className="text-sm text-muted-foreground">Para validar ganhos concretos</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
