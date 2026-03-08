import { type ContentSection, buildContentSections } from '@/editor/content-config'

export function applyLegacyContent(
  html: string,
  values: Record<string, string>,
  sections: ContentSection[] = buildContentSections(html),
) {
  let output = html

  for (const section of sections) {
    for (const field of section.fields) {
      const nextValue = values[field.id]
      if (!nextValue || nextValue === field.original) continue
      const source = field.source ?? field.original
      output = output.split(source).join(nextValue)
    }
  }

  return output
}
