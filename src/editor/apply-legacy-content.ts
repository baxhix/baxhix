import {
  type ContentSection,
  buildContentSections,
} from '@/editor/content-config'

export function applyLegacyContent(
  html: string,
  values: Record<string, string>,
  sections: ContentSection[] = buildContentSections(html),
) {
  // Conteudo do painel desativado: o site passa a usar apenas o texto fixo do HTML legado.
  void values
  void sections
  return html
}
