import { type ContentSection, buildContentSections } from '@/editor/content-config'

type EditableTextNode = {
  index: number
  node: Text
}

type EditableAttrNode = {
  index: number
  el: Element
  attrName: 'placeholder' | 'value' | 'title' | 'aria-label'
}

function collectEditableNodes(doc: Document) {
  const textNodes: EditableTextNode[] = []
  const attrNodes: EditableAttrNode[] = []

  const textWalker = doc.createTreeWalker(doc.documentElement, NodeFilter.SHOW_TEXT)
  let textIndex = 0
  let current = textWalker.nextNode()
  while (current) {
    const node = current as Text
    const parent = node.parentElement
    const parentTag = parent?.tagName?.toUpperCase()
    const normalized = node.nodeValue?.replace(/\s+/g, ' ').trim() ?? ''

    if (normalized && parentTag !== 'SCRIPT' && parentTag !== 'STYLE' && parentTag !== 'NOSCRIPT') {
      textNodes.push({ index: textIndex, node })
      textIndex += 1
    }

    current = textWalker.nextNode()
  }

  const attrNames: Array<'placeholder' | 'value' | 'title' | 'aria-label'> = ['placeholder', 'value', 'title', 'aria-label']
  let attrIndex = 0
  for (const el of Array.from(doc.querySelectorAll('*'))) {
    for (const attrName of attrNames) {
      const raw = el.getAttribute(attrName)
      const normalized = raw?.replace(/\s+/g, ' ').trim() ?? ''
      if (!normalized) continue

      attrNodes.push({ index: attrIndex, el, attrName })
      attrIndex += 1
    }
  }

  return { textNodes, attrNodes }
}

export function applyLegacyContent(
  html: string,
  values: Record<string, string>,
  sections: ContentSection[] = buildContentSections(html),
) {
  const locatorFields: Array<{ locator: NonNullable<ContentSection['fields'][number]['locator']>; nextValue: string }> = []
  const manualFields: Array<{ source: string; original: string; nextValue: string }> = []

  for (const section of sections) {
    for (const field of section.fields) {
      const nextValue = values[field.id]
      if (!nextValue || nextValue === field.original) continue

      if (field.locator) {
        locatorFields.push({ locator: field.locator, nextValue })
      } else {
        manualFields.push({ source: field.source ?? field.original, original: field.original, nextValue })
      }
    }
  }

  let output = html

  if (locatorFields.length > 0 && typeof DOMParser !== 'undefined') {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const { textNodes, attrNodes } = collectEditableNodes(doc)

    for (const item of locatorFields) {
      if (item.locator.type === 'text') {
        const target = textNodes.find((node) => node.index === item.locator.index)
        if (target) {
          target.node.nodeValue = item.nextValue
        }
        continue
      }

      if (item.locator.type === 'attr' && item.locator.attrName) {
        const target = attrNodes.find(
          (node) => node.index === item.locator.index && node.attrName === item.locator.attrName,
        )
        if (target) {
          target.el.setAttribute(item.locator.attrName, item.nextValue)
        }
      }
    }

    output = `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`
  }

  for (const field of manualFields) {
    output = output.split(field.source).join(field.nextValue)

    if (field.source !== field.original) {
      output = output.split(field.original).join(field.nextValue)
    }
  }

  output = output.replace(/\(?\s*CANAIS DIGITAIS B2C,\s*B2B E D2C\s*\)?/gi, '')

  return output
}
