export type ContentField = {
  id: string
  label: string
  original: string
  source?: string
  kind?: 'line' | 'area'
  locator?: {
    type: 'text' | 'attr'
    index: number
    attrName?: 'placeholder' | 'value' | 'title' | 'aria-label'
  }
}

export type ContentSection = {
  id: string
  title: string
  fields: ContentField[]
}

type PanelSectionId =
  | 'hero'
  | 'solution'
  | 'cases'
  | 'testimonials'
  | 'framework'
  | 'contact'
  | 'contact-form'
  | 'market-headings'

const BASE_CONTENT_SECTIONS: ContentSection[] = [
  {
    id: 'hero',
    title: 'Hero',
    fields: [
      {
        id: 'hero_title',
        label: 'Título principal',
        original: 'O ecossistema completo para Farma, Beleza e Pet',
        kind: 'line',
      },
      {
        id: 'hero_sub',
        label: 'Subtítulo',
        original:
          'A infraestrutura especializada para Farma, Beleza e Pet. Compliance, escala e experiência integrados em um único ecossistema.',
        kind: 'area',
      },
      { id: 'hero_cta_primary', label: 'Botão principal', original: 'Conhecer o ecossistema', kind: 'line' },
      { id: 'hero_cta_secondary', label: 'Botão secundário', original: 'Ver cases', kind: 'line' },
    ],
  },
  {
    id: 'solution',
    title: 'A Solução Especializada',
    fields: [
      { id: 'section_solution', label: 'Título da seção', original: 'A solução especializada', kind: 'line' },
    ],
  },
  {
    id: 'cases',
    title: 'Cases',
    fields: [
      { id: 'section_cases', label: 'Título da seção', original: 'Cases de sucesso', kind: 'line' },
      {
        id: 'case_01_headline',
        label: 'Case 01 - Título',
        original: 'Escala comprovada em operação de alta demanda.',
        kind: 'line',
      },
      {
        id: 'case_01_detail',
        label: 'Case 01 - Descrição',
        original:
          'Plataforma digital gerenciada desde 2019. Site e app em produção ininterrupta há +7 anos, atendendo picos de 45K pedidos/dia sem degradação de performance.',
        kind: 'area',
      },
      { id: 'case_02_headline', label: 'Case 02 - Título', original: 'App cresceu 6,5x mais que o site em 2 anos.', kind: 'line' },
      {
        id: 'case_02_detail',
        label: 'Case 02 - Descrição',
        original:
          'De 0% a 45% do faturamento digital em 3 anos. Na Black Friday 2025, processou 2,1× o volume médio com 149K usuários ativos simultâneos.',
        kind: 'area',
      },
    ],
  },
  {
    id: 'testimonials',
    title: 'Depoimentos',
    fields: [
      { id: 'section_testimonials', label: 'Título da seção', original: 'Depoimentos', kind: 'line' },
      {
        id: 'testimonial_01',
        label: 'Depoimento 01',
        original:
          '"A Leanwork trouxe muito conhecimento e agilidade com um atendimento bastante próximo, tornando uma extensão da nossa equipe interna. Consideramos a Leanwork hoje uma peça importante para o nosso crescimento."',
        kind: 'area',
      },
      {
        id: 'testimonial_02',
        label: 'Depoimento 02',
        original:
          '"O tempo de desenvolvimento e a qualidade da entrega, além da flexibilidade de migração, nos fez migrar com muita segurança. Quebramos o recorde histórico do canal nos primeiros 60 dias."',
        kind: 'area',
      },
    ],
  },
  {
    id: 'framework',
    title: 'Framework de Entrega',
    fields: [
      { id: 'section_framework', label: 'Título da seção', original: 'Framework de entrega', kind: 'line' },
      { id: 'framework_01_title', label: 'Card 01 - Título', original: 'Alinhamento Estratégico', kind: 'line' },
      { id: 'framework_01_desc', label: 'Card 01 - Descrição', original: 'Escopo validado e plano de execução', kind: 'area' },
      { id: 'framework_02_title', label: 'Card 02 - Título', original: 'Onboarding e Execução', kind: 'line' },
      {
        id: 'framework_02_desc',
        label: 'Card 02 - Descrição',
        original: 'Operação homologada conforme plano validado',
        kind: 'area',
      },
      { id: 'framework_03_title', label: 'Card 03 - Título', original: 'Go-live e Evolução', kind: 'line' },
      {
        id: 'framework_03_desc',
        label: 'Card 03 - Descrição',
        original: 'Publicação em produção e sustentação pós-venda',
        kind: 'area',
      },
    ],
  },
  {
    id: 'contact',
    title: 'Fale Conosco',
    fields: [
      { id: 'cta_title', label: 'Título CTA', original: 'Vamos construir o futuro da sua operação?', kind: 'line' },
      {
        id: 'cta_sub',
        label: 'Subtítulo CTA',
        original:
          'Fale com nossos especialistas e descubra como o ecossistema Rheon pode transformar sua operação.',
        kind: 'area',
      },
      { id: 'contact_side_title', label: 'Título lateral', original: 'Fale com<br>quem decide<br>junto com você.', kind: 'area' },
    ],
  },
  {
    id: 'contact-form',
    title: 'Formulário de Contato',
    fields: [
      { id: 'contact_form_heading', label: 'Título do formulário', original: 'Envie uma mensagem', kind: 'line' },
      { id: 'contact_form_name_label', label: 'Label - Nome', original: 'Nome', kind: 'line' },
      { id: 'contact_form_name_placeholder', label: 'Placeholder - Nome', original: 'Seu nome', kind: 'line' },
      { id: 'contact_form_company_label', label: 'Label - Empresa', original: 'Empresa', kind: 'line' },
      { id: 'contact_form_company_placeholder', label: 'Placeholder - Empresa', original: 'Nome da empresa', kind: 'line' },
      { id: 'contact_form_email_label', label: 'Label - E-mail', original: 'E-mail', kind: 'line' },
      { id: 'contact_form_email_placeholder', label: 'Placeholder - E-mail', original: 'seu@email.com.br', kind: 'line' },
      { id: 'contact_form_phone_label', label: 'Label - WhatsApp', original: 'WhatsApp', kind: 'line' },
      { id: 'contact_form_phone_placeholder', label: 'Placeholder - WhatsApp', original: '(43) 99999-9999', kind: 'line' },
      { id: 'contact_form_segment_label', label: 'Label - Segmento', original: 'Segmento', kind: 'line' },
      {
        id: 'contact_form_segment_placeholder',
        label: 'Opção padrão - Segmento',
        original: 'Selecione seu segmento',
        kind: 'line',
      },
      { id: 'contact_form_segment_option_farma', label: 'Opção - Farma', original: 'Farmacêutico / Drogaria', kind: 'line' },
      { id: 'contact_form_segment_option_beleza', label: 'Opção - Beleza', original: 'Beleza / Cosméticos', kind: 'line' },
      { id: 'contact_form_segment_option_pet', label: 'Opção - Pet', original: 'Pet Shop', kind: 'line' },
      { id: 'contact_form_segment_option_outro', label: 'Opção - Outro', original: 'Outro', kind: 'line' },
      { id: 'contact_form_message_label', label: 'Label - Mensagem', original: 'Como podemos ajudar?', kind: 'line' },
      {
        id: 'contact_form_message_placeholder',
        label: 'Placeholder - Mensagem',
        original: 'Descreva brevemente sua operação e o que você busca...',
        kind: 'area',
      },
      { id: 'contact_form_submit', label: 'Botão enviar', original: 'Enviar mensagem', kind: 'line' },
      { id: 'contact_form_success_title', label: 'Sucesso - Título', original: 'Mensagem enviada!', kind: 'line' },
      {
        id: 'contact_form_success_desc',
        label: 'Sucesso - Descrição',
        original: 'Nosso time entrará em contato em breve.',
        kind: 'line',
      },
    ],
  },
  {
    id: 'market-headings',
    title: 'Títulos Gerais',
    fields: [
      { id: 'section_market', label: 'Contexto de mercado', original: 'Contexto de mercado', kind: 'line' },
      { id: 'section_numbers', label: 'Estrutura consolidada', original: 'Estrutura consolidada', kind: 'line' },
    ],
  },
]

export function normalizeText(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

export function shouldIncludeText(value: string) {
  if (value.length < 2) return false
  return /[A-Za-zÀ-ÿ0-9]/.test(value)
}

function resolvePanelSectionId(el: Element | null): PanelSectionId {
  const section = el?.closest('section')
  const id = section?.id?.toLowerCase() ?? ''
  const cls = section?.className?.toString().toLowerCase() ?? ''

  if (id === 'home') return 'hero'
  if (id === 'solucao') return 'solution'
  if (id === 'cases' || cls.includes('clients')) return 'cases'
  if (id === 'metodologia') return 'framework'
  if (el?.closest('#contactForm') || el?.closest('.contact-form-side')) return 'contact-form'
  if (id === 'contato') return 'contact'
  if (id === 'mercado' || id === 'problema' || id === 'numeros') return 'market-headings'
  if (cls.includes('testimonials')) return 'testimonials'

  return 'market-headings'
}

type EditableTarget = {
  type: 'text' | 'attr'
  sectionId: PanelSectionId
  source: string
  normalized: string
  index: number
  attrName?: 'placeholder' | 'value' | 'title' | 'aria-label'
}

export function collectEditableTargets(html: string): EditableTarget[] {
  if (typeof DOMParser === 'undefined') return []

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const output: EditableTarget[] = []

  const textWalker = doc.createTreeWalker(doc.documentElement, NodeFilter.SHOW_TEXT)
  let textIndex = 0
  let current = textWalker.nextNode()
  while (current) {
    const node = current as Text
    const parent = node.parentElement
    const parentTag = parent?.tagName?.toUpperCase()
    const insideProblem = Boolean(parent?.closest('#problema'))
    const insidePlatformRisks = Boolean(parent?.closest('#riscos-plataforma'))
    const insideUnifiedArchitecture = Boolean(parent?.closest('#arquitetura-unificada'))

    if (
      !insideProblem &&
      !insidePlatformRisks &&
      !insideUnifiedArchitecture &&
      parentTag !== 'SCRIPT' &&
      parentTag !== 'STYLE' &&
      parentTag !== 'NOSCRIPT'
    ) {
      const source = node.nodeValue ?? ''
      const normalized = normalizeText(source)
      if (shouldIncludeText(normalized)) {
        output.push({
          type: 'text',
          sectionId: resolvePanelSectionId(parent),
          source,
          normalized,
          index: textIndex,
        })
        textIndex += 1
      }
    }

    current = textWalker.nextNode()
  }

  const attrNames: Array<'placeholder' | 'value' | 'title' | 'aria-label'> = ['placeholder', 'value', 'title', 'aria-label']
  let attrIndex = 0
  for (const el of Array.from(doc.querySelectorAll('*'))) {
    const insideProblem = Boolean(el.closest('#problema'))
    const insidePlatformRisks = Boolean(el.closest('#riscos-plataforma'))
    const insideUnifiedArchitecture = Boolean(el.closest('#arquitetura-unificada'))
    if (insideProblem || insidePlatformRisks || insideUnifiedArchitecture) continue
    for (const attrName of attrNames) {
      const source = el.getAttribute(attrName) ?? ''
      const normalized = normalizeText(source)
      if (!shouldIncludeText(normalized)) continue

      output.push({
        type: 'attr',
        sectionId: resolvePanelSectionId(el),
        source,
        normalized,
        index: attrIndex,
        attrName,
      })
      attrIndex += 1
    }
  }

  return output
}

function attachLocatorsToBaseSections(baseSections: ContentSection[], targets: EditableTarget[]): ContentSection[] {
  const used = new Set<string>()

  return baseSections.map((section) => {
    const nextFields = section.fields.map((field) => {
      if (field.locator) return field
      const normalizedOriginal = normalizeText(field.original)
      const match = targets.find((target) => {
        if (target.sectionId !== section.id) return false
        if (target.normalized !== normalizedOriginal) return false
        const key = `${target.type}:${target.index}:${target.attrName ?? ''}`
        return !used.has(key)
      })

      if (!match) return field

      const key = `${match.type}:${match.index}:${match.attrName ?? ''}`
      used.add(key)

      return {
        ...field,
        source: match.source,
        locator: {
          type: match.type,
          index: match.index,
          attrName: match.attrName,
        },
      }
    })

    return {
      ...section,
      fields: nextFields,
    }
  })
}

function buildAutoFieldsBySection(html: string, coveredNormalizedTexts: Set<string>) {
  const bySection: Record<PanelSectionId, ContentField[]> = {
    hero: [],
    solution: [],
    cases: [],
    testimonials: [],
    framework: [],
    contact: [],
    'contact-form': [],
    'market-headings': [],
  }

  const counters: Record<PanelSectionId, number> = {
    hero: 0,
    solution: 0,
    cases: 0,
    testimonials: 0,
    framework: 0,
    contact: 0,
    'contact-form': 0,
    'market-headings': 0,
  }

  const seenLabelCount = new Map<string, number>()

  for (const target of collectEditableTargets(html)) {
    if (coveredNormalizedTexts.has(target.normalized)) continue

    counters[target.sectionId] += 1
    const baseLabel = target.normalized.length > 80 ? `${target.normalized.slice(0, 80)}...` : target.normalized
    const k = `${target.sectionId}:${baseLabel}`
    const occurrence = (seenLabelCount.get(k) ?? 0) + 1
    seenLabelCount.set(k, occurrence)

    bySection[target.sectionId].push({
      id: `auto_v2_${target.sectionId}_${String(counters[target.sectionId]).padStart(3, '0')}`,
      label: occurrence > 1 ? `${baseLabel} (${occurrence})` : baseLabel,
      original: target.normalized,
      source: target.source,
      kind: target.type === 'attr' || target.normalized.length <= 80 ? 'line' : 'area',
      locator: {
        type: target.type,
        index: target.index,
        attrName: target.attrName,
      },
    })
  }

  return bySection
}

export function buildContentSections(legacyHtml: string): ContentSection[] {
  const targets = collectEditableTargets(legacyHtml)
  const baseSections = attachLocatorsToBaseSections(BASE_CONTENT_SECTIONS, targets)
  const coveredNormalizedTexts = new Set(
    baseSections.flatMap((section) => section.fields.map((field) => normalizeText(field.original))),
  )

  const autoFieldsBySection = buildAutoFieldsBySection(legacyHtml, coveredNormalizedTexts)

  return baseSections.map((section) => {
    const autoFields = autoFieldsBySection[section.id as PanelSectionId] ?? []
    if (autoFields.length === 0) return section
    return {
      ...section,
      fields: [...section.fields, ...autoFields],
    }
  })
}

export function buildDefaultTextValues(sections: ContentSection[]) {
  return Object.fromEntries(sections.flatMap((section) => section.fields.map((field) => [field.id, field.original])))
}

export const CONTENT_SECTIONS = BASE_CONTENT_SECTIONS
export const DEFAULT_TEXT_VALUES = buildDefaultTextValues(BASE_CONTENT_SECTIONS)
