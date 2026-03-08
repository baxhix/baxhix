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
    const value = node.nodeValue?.replace(/\s+/g, ' ').trim() ?? ''
    if (value && parentTag !== 'SCRIPT' && parentTag !== 'STYLE' && parentTag !== 'NOSCRIPT') {
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
  let output = html
  const parser = typeof DOMParser !== 'undefined' ? new DOMParser() : null
  const doc = parser ? parser.parseFromString(html, 'text/html') : null
  const editableNodes = doc ? collectEditableNodes(doc) : null
  const fallbackReplacements: Array<{ source: string; nextValue: string }> = []

  for (const section of sections) {
    for (const field of section.fields) {
      const nextValue = values[field.id]
      if (!nextValue || nextValue === field.original) continue

      if (doc && editableNodes && field.locator) {
        if (field.locator.type === 'text') {
          const target = editableNodes.textNodes.find((item) => item.index === field.locator?.index)
          if (target) {
            target.node.nodeValue = nextValue
            continue
          }
        }

        if (field.locator.type === 'attr' && field.locator.attrName) {
          const target = editableNodes.attrNodes.find(
            (item) => item.index === field.locator?.index && item.attrName === field.locator.attrName,
          )
          if (target) {
            target.el.setAttribute(field.locator.attrName, nextValue)
            continue
          }
        }
      }

      const source = field.source ?? field.original
      fallbackReplacements.push({ source, nextValue })
      output = output.split(source).join(nextValue)
    }
  }

  if (doc) {
    let serialized = `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`
    for (const item of fallbackReplacements) {
      serialized = serialized.split(item.source).join(item.nextValue)
    }
    return serialized
  }

  return output
}
