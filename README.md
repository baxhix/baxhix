# Rheon Onepage

Projeto refatorado para **React + Vite + TypeScript + Tailwind v4 + shadcn/ui**,
com arquitetura modular para facilitar manutencao e evolucao sem regressao.

## Stack
- React 19
- Vite 7
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- ESLint

## Estrutura
- `src/components/ui`: componentes base do shadcn
- `src/components/layout`: estrutura global (header/footer)
- `src/components/sections`: secoes da landing page
- `src/components/common`: componentes compartilhados
- `src/data`: conteudo e dados da pagina
- `src/lib`: utilitarios
- `legacy/rheon-onepage-v3.html`: versao original preservada

## Scripts
- `npm run dev`: ambiente local
- `npm run build`: build de producao
- `npm run preview`: preview do build
- `npm run lint`: analise estatica
- `npm run typecheck`: checagem de tipos

## Fluxo de edicao recomendado
1. Edite textos/listas em `src/data/site-content.ts`.
2. Edite layout por secao em `src/components/sections/*`.
3. Reaproveite componentes de `src/components/ui` e `src/components/common`.
4. Rode `npm run lint` e `npm run build` antes de publicar.

## Deploy
### Vercel
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

### Netlify
- Build command: `npm run build`
- Publish directory: `dist`

## Execucao local
```bash
npm install
npm run dev
```
