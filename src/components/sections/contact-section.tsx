import { useState } from 'react'
import type { FormEvent } from 'react'

import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CONTACT } from '@/data/site-content'
import { cn } from '@/lib/utils'

type ContactSectionProps = {
  whatsappNumber: string
}

export function ContactSection({ whatsappNumber }: ContactSectionProps) {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '')
    const company = String(formData.get('company') ?? '')
    const phone = String(formData.get('phone') ?? '')
    const segment = String(formData.get('segment') ?? '')
    const message = String(formData.get('message') ?? '')

    const text = encodeURIComponent(
      [
        `Ola! Me chamo ${name}.`,
        company ? `Empresa: ${company}` : '',
        segment ? `Segmento: ${segment}` : '',
        phone ? `Telefone: ${phone}` : '',
        message ? `Mensagem: ${message}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
    )

    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank', 'noopener,noreferrer')
    setSubmitted(true)
  }

  return (
    <section id="contato" className="px-4 py-20 md:px-6">
      <div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-[1fr_1.3fr]">
        <Card className="rounded-3xl border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle className="text-2xl">Vamos construir seu plano de crescimento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Em uma conversa de 30 minutos mapeamos o cenario atual e os ganhos mais rapidos para o seu negocio.
            </p>
            <a className="block hover:text-foreground" href={`mailto:${CONTACT.email}`}>
              {CONTACT.email}
            </a>
            <p>{CONTACT.phoneLabel}</p>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: 'outline' }), 'mt-2 w-full rounded-full')}
            >
              Falar agora no WhatsApp
            </a>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle>Solicitar diagnostico</CardTitle>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm">
                Obrigado! Abrimos uma conversa no WhatsApp com seus dados preenchidos.
              </div>
            ) : (
              <form className="grid gap-3" onSubmit={handleSubmit}>
                <Input name="name" required placeholder="Nome" />
                <Input name="company" required placeholder="Empresa" />
                <Input name="phone" placeholder="Telefone" />
                <Input name="segment" placeholder="Segmento (Farma, Beleza, Pet...)" />
                <Textarea name="message" placeholder="Contexto e objetivo" rows={5} />
                <Button type="submit" className="mt-1 rounded-full">
                  Enviar para WhatsApp
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
