# eduardoms.dev

Portfólio pessoal de desenvolvedor Fullstack Sênior, com direção visual "HUD tático".

## Stack

- **[Astro](https://astro.build)** — arquitetura de ilhas, output estático
- **[Svelte](https://svelte.dev)** — componentes interativos (toggle de idioma, contadores animados, visual 3D do hero)
- **[Tailwind CSS v4](https://tailwindcss.com)** — via plugin nativo do Vite, tema definido em CSS
- **[GSAP](https://gsap.com)** + ScrollTrigger — timeline de entrada do hero e reveals no scroll
- **[Three.js](https://threejs.org)** — visual 3D do hero, carregado sob demanda (`client:idle`), com fallback estático em SVG
- **TypeScript** (strict)
- Deploy na **[Vercel](https://vercel.com)** (`@astrojs/vercel`)

## Rodando localmente

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # gera ./dist e ./.vercel/output
npm run preview   # serve o build de produção localmente
```

Node.js 22.12+ é exigido (ver `engines` em `package.json`).

## Live

_(em breve)_
