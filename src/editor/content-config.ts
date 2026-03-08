export type ContentField = {
  id: string
  label: string
  original: string
  source?: string
  kind?: 'line' | 'area'
}

export type ContentSection = {
  id: string
  title: string
  fields: ContentField[]
}

const BASE_CONTENT_SECTIONS: ContentSection[] = [
  {
    id: 'hero',
    title: 'Hero',
    fields: [
      {
        id: 'hero_title',
        label: 'Título principal',
        original: 'Do físico ao digital — sem fricção.',
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
      {
        id: 'layer_01_title',
        label: 'Camada 01 - Título',
        original: 'App Commerce',
        kind: 'line',
      },
      {
        id: 'layer_01_desc',
        label: 'Camada 01 - Descrição',
        original:
          'Lean App — iOS e Android nativos. +20% de receita online após implantação. Go-live em 25 dias úteis.',
        kind: 'area',
      },
      {
        id: 'layer_02_title',
        label: 'Camada 02 - Título',
        original: 'E-commerce & Marketplace',
        kind: 'line',
      },
      {
        id: 'layer_02_desc',
        label: 'Camada 02 - Descrição',
        original:
          'Plataforma enterprise com recursos exclusivos para Farma: SNGPC, PBMs, convênios, catálogo regulado.',
        kind: 'area',
      },
      {
        id: 'layer_03_title',
        label: 'Camada 03 - Título',
        original: 'Full Points — Fidelização',
        kind: 'line',
      },
      {
        id: 'layer_03_desc',
        label: 'Camada 03 - Descrição',
        original: 'CRM e cashback omnichannel. +5% de retenção pode gerar até 95% de crescimento em lucro.',
        kind: 'area',
      },
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
      {
        id: 'case_02_headline',
        label: 'Case 02 - Título',
        original: 'App cresceu 6,5x mais que o site em 2 anos.',
        kind: 'line',
      },
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
      {
        id: 'framework_01_title',
        label: 'Card 01 - Título',
        original: 'Alinhamento Estratégico',
        kind: 'line',
      },
      {
        id: 'framework_01_desc',
        label: 'Card 01 - Descrição',
        original: 'Escopo validado e plano de execução',
        kind: 'area',
      },
      {
        id: 'framework_02_title',
        label: 'Card 02 - Título',
        original: 'Onboarding e Execução',
        kind: 'line',
      },
      {
        id: 'framework_02_desc',
        label: 'Card 02 - Descrição',
        original: 'Operação homologada conforme plano validado',
        kind: 'area',
      },
      {
        id: 'framework_03_title',
        label: 'Card 03 - Título',
        original: 'Go-live e Evolução',
        kind: 'line',
      },
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
      {
        id: 'cta_title',
        label: 'Título CTA',
        original: 'Vamos construir o futuro da sua operação?',
        kind: 'line',
      },
      {
        id: 'cta_sub',
        label: 'Subtítulo CTA',
        original:
          'Fale com nossos especialistas e descubra como o ecossistema Rheon pode transformar sua operação.',
        kind: 'area',
      },
      { id: 'contact_form_title', label: 'Título do formulário', original: 'Envie uma mensagem', kind: 'line' },
      {
        id: 'contact_side_title',
        label: 'Título lateral',
        original: 'Fale com<br>quem decide<br>junto com você.',
        kind: 'area',
      },
    ],
  },
  {
    id: 'market-headings',
    title: 'Títulos Gerais',
    fields: [
      { id: 'section_market', label: 'Contexto de mercado', original: 'Contexto de mercado', kind: 'line' },
      { id: 'section_problem', label: 'O desafio', original: 'O desafio', kind: 'line' },
      { id: 'section_numbers', label: 'Estrutura consolidada', original: 'Estrutura consolidada', kind: 'line' },
    ],
  },
]

function normalizeText(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

function shouldIncludeText(value: string) {
  if (value.length < 2) return false
  return /[A-Za-zÀ-ÿ0-9]/.test(value)
}

function stripIgnoredHtml(rawHtml: string) {
  return rawHtml
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
}

function buildAutoFields(html: string, coveredNormalizedTexts: Set<string>) {
  const output: ContentField[] = []
  const seenNormalized = new Set<string>()
  const safeHtml = stripIgnoredHtml(html)

  const textRegex = />([^<>]+)</g
  let textMatch = textRegex.exec(safeHtml)
  while (textMatch) {
    const source = textMatch[1] ?? ''
    const normalized = normalizeText(source)

    if (shouldIncludeText(normalized) && !coveredNormalizedTexts.has(normalized) && !seenNormalized.has(normalized)) {
      const nextIndex = output.length + 1
      output.push({
        id: `auto_${String(nextIndex).padStart(4, '0')}`,
        label: normalized.length > 80 ? `${normalized.slice(0, 80)}...` : normalized,
        original: normalized,
        source,
        kind: normalized.length <= 80 ? 'line' : 'area',
      })
      seenNormalized.add(normalized)
    }

    textMatch = textRegex.exec(safeHtml)
  }

  const attrRegex = /\b(placeholder|value|title|aria-label)=(["'])(.*?)\2/gi
  let attrMatch = attrRegex.exec(safeHtml)
  while (attrMatch) {
    const source = attrMatch[3] ?? ''
    const normalized = normalizeText(source)

    if (shouldIncludeText(normalized) && !coveredNormalizedTexts.has(normalized) && !seenNormalized.has(normalized)) {
      const nextIndex = output.length + 1
      output.push({
        id: `auto_${String(nextIndex).padStart(4, '0')}`,
        label: normalized.length > 80 ? `${normalized.slice(0, 80)}...` : normalized,
        original: normalized,
        source,
        kind: 'line',
      })
      seenNormalized.add(normalized)
    }

    attrMatch = attrRegex.exec(safeHtml)
  }

  return output
}

export function buildContentSections(legacyHtml: string): ContentSection[] {
  const coveredNormalizedTexts = new Set(
    BASE_CONTENT_SECTIONS.flatMap((section) => section.fields.map((field) => normalizeText(field.original))),
  )

  const autoFields = buildAutoFields(legacyHtml, coveredNormalizedTexts)

  if (autoFields.length === 0) {
    return BASE_CONTENT_SECTIONS
  }

  return [
    ...BASE_CONTENT_SECTIONS,
    {
      id: 'extra',
      title: 'Textos Adicionais do Site',
      fields: autoFields,
    },
  ]
}

export function buildDefaultTextValues(sections: ContentSection[]) {
  return Object.fromEntries(sections.flatMap((section) => section.fields.map((field) => [field.id, field.original])))
}

export const CONTENT_SECTIONS = BASE_CONTENT_SECTIONS
export const DEFAULT_TEXT_VALUES = buildDefaultTextValues(BASE_CONTENT_SECTIONS)
