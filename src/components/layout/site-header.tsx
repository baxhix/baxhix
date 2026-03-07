import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from '@/data/site-content'

type SiteHeaderProps = {
  whatsappNumber: string
}

export function SiteHeader({ whatsappNumber }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        <a href="#top" className="text-sm font-bold tracking-[0.24em] uppercase">
          RHEON
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ size: 'sm' }), 'rounded-full px-5')}
        >
          WhatsApp
        </a>
      </div>
    </header>
  )
}
