import { MessageCircle } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type WhatsappFloatProps = {
  whatsappNumber: string
}

export function WhatsappFloat({ whatsappNumber }: WhatsappFloatProps) {
  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Abrir WhatsApp"
      className={cn(buttonVariants({ size: 'icon-lg' }), 'fixed right-5 bottom-5 z-50 rounded-full shadow-lg')}
    >
      <MessageCircle className="size-5" />
    </a>
  )
}
