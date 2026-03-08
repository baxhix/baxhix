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
- `npm run start:vps`: sobe API + site estatico (requer `dist` gerado e Postgres configurado)
- `npm run preview`: preview do build
- `npm run lint`: analise estatica
- `npm run typecheck`: checagem de tipos

## Fluxo de edicao recomendado
1. Edite textos/listas em `src/data/site-content.ts`.
2. Edite layout por secao em `src/components/sections/*`.
3. Reaproveite componentes de `src/components/ui` e `src/components/common`.
4. Rode `npm run lint` e `npm run build` antes de publicar.

## Deploy
### VPS (Docker)
1. Ajuste credenciais em `docker-compose.yml` (usuario/senha e `CMS_AUTH_SECRET`).
2. Suba containers:
```bash
docker compose up -d --build
```
3. App fica em `http://SEU_IP:3000`.
4. Painel: `http://SEU_IP:3000/?admin=1`.

### VPS (sem Docker)
1. Crie `.env` baseado em `.env.vps.example`.
2. Instale dependencias e gere build:
```bash
npm install
npm run build
```
3. Suba servidor:
```bash
npm run start:vps
```

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
