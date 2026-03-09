import {
  type ContentSection,
  buildContentSections,
  normalizeText,
  shouldIncludeText,
} from '@/editor/content-config'

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
    const insideProblem = Boolean(parent?.closest('#problema'))
    const normalized = normalizeText(node.nodeValue ?? '')

    if (
      !insideProblem &&
      parentTag !== 'SCRIPT' &&
      parentTag !== 'STYLE' &&
      parentTag !== 'NOSCRIPT' &&
      shouldIncludeText(normalized)
    ) {
      textNodes.push({ index: textIndex, node })
      textIndex += 1
    }

    current = textWalker.nextNode()
  }

  const attrNames: Array<'placeholder' | 'value' | 'title' | 'aria-label'> = ['placeholder', 'value', 'title', 'aria-label']
  let attrIndex = 0
  for (const el of Array.from(doc.querySelectorAll('*'))) {
    const insideProblem = Boolean(el.closest('#problema'))
    if (insideProblem) continue
    for (const attrName of attrNames) {
      const raw = el.getAttribute(attrName)
      const normalized = normalizeText(raw ?? '')
      if (!shouldIncludeText(normalized)) continue

      attrNodes.push({ index: attrIndex, el, attrName })
      attrIndex += 1
    }
  }

  return { textNodes, attrNodes }
}

function replaceFirst(source: string, searchValue: string, replaceValue: string) {
  if (!searchValue) return source
  const index = source.indexOf(searchValue)
  if (index < 0) return source
  return source.slice(0, index) + replaceValue + source.slice(index + searchValue.length)
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
    output = replaceFirst(output, field.source, field.nextValue)

    if (field.source !== field.original) {
      output = replaceFirst(output, field.original, field.nextValue)
    }
  }

  return output
}
