import { Separator } from '@/components/ui/separator'
import { CONTACT, NAV_ITEMS } from '@/data/site-content'

export function SiteFooter() {
  return (
    <footer className="px-4 pb-10 md:px-6">
      <div className="mx-auto w-full max-w-6xl rounded-3xl border border-border/60 bg-card/70 p-6 md:p-10">
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold tracking-[0.24em] uppercase">RHEON</p>
            <p className="mt-2 text-sm text-muted-foreground">Ecossistema Unified Commerce</p>
          </div>
          <div className="flex flex-wrap gap-4">
            {NAV_ITEMS.map((item) => (
              <a key={item.href} href={item.href} className="text-sm text-muted-foreground hover:text-foreground">
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:justify-between">
          <a href={`mailto:${CONTACT.email}`} className="hover:text-foreground">
            {CONTACT.email}
          </a>
          <span>{CONTACT.phoneLabel}</span>
        </div>
      </div>
    </footer>
  )
}
