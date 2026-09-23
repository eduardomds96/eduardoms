export interface L10n {
  pt: string;
  en: string;
}

export interface CtaLink {
  label: L10n;
  href: string;
}

export interface CtaAnchor {
  label: L10n;
  anchor: string;
}

export interface ServiceItem {
  id: string;
  title: L10n;
  summary: L10n;
  tags: string[];
  scope: L10n;
}

export interface StatItem {
  id: string;
  /** Numeric target for the count-up animation. Keep as "TODO" text fields until real numbers exist. */
  value: number | "TODO";
  suffix?: string;
  label: L10n;
}

export interface ClientItem {
  id: string;
  name: string;
  /** Path under /public, e.g. "/clients/todo-logo.svg". Placeholder until real logos are supplied. */
  logoSrc: string;
  /** For solid-black-on-transparent logos that would otherwise stay invisible on the dark card at rest. */
  invertOnHover?: boolean;
}

export interface StackCategory {
  name: L10n;
  items: string[];
}

/**
 * Single source of truth for all site copy, PT + EN.
 * Every field that depends on real, verifiable user data is a literal "TODO" —
 * never a fabricated number or placeholder link that looks real.
 */
export const siteContent = {
  meta: {
    name: "Eduardo Mendonça",
    domain: "eduardoms.dev",
    description: {
      pt: "Frontend Sênior com visão de arquitetura e atuação full-stack, especializado em Web & Mobile. Sites, e-commerce e apps que entregam performance real.",
      en: "Senior Frontend Engineer with an architecture mindset and full-stack range, specialized in Web & Mobile. Websites, e-commerce and apps that deliver real performance.",
    } satisfies L10n,
  },

  person: {
    name: "Eduardo Mendonça",
    role: {
      pt: "Frontend Sênior com visão de arquitetura e atuação full-stack · Web & Mobile",
      en: "Senior Frontend Engineer with an architecture mindset and full-stack range · Web & Mobile",
    } satisfies L10n,
  },

  nav: {
    portfolio: { pt: "Portfólio", en: "Portfolio" } satisfies L10n,
    skills: { pt: "Skills", en: "Skills" } satisfies L10n,
    contact: { pt: "Contato", en: "Contact" } satisfies L10n,
  },

  availabilityBadge: {
    pt: "Disponível para projetos",
    en: "Available for projects",
  } satisfies L10n,

  sections: {
    hero: {
      index: "01",
      eyebrow: { pt: "Operador", en: "Operator" } satisfies L10n,
    },
    services: {
      index: "02",
      eyebrow: { pt: "Serviços", en: "Services" } satisfies L10n,
      heading: { pt: "Me contrate para", en: "Hire me for" } satisfies L10n,
    },
    stats: {
      index: "03",
      eyebrow: { pt: "Métricas", en: "Metrics" } satisfies L10n,
      heading: { pt: "Prova em números", en: "Numbers that prove it" } satisfies L10n,
    },
    clients: {
      index: "04",
      eyebrow: { pt: "Confiança", en: "Trust" } satisfies L10n,
      heading: { pt: "Clientes & produtos que atuei", en: "Clients & products I worked on" } satisfies L10n,
    },
    stack: {
      index: "05",
      eyebrow: { pt: "Arsenal", en: "Arsenal" } satisfies L10n,
      heading: { pt: "Stack & ferramentas", en: "Stack & tools" } satisfies L10n,
    },
    contact: {
      index: "06",
      eyebrow: { pt: "Contato", en: "Contact" } satisfies L10n,
    },
  },

  servicesUi: {
    viewScope: { pt: "Ver escopo", en: "View scope" } satisfies L10n,
    hideScope: { pt: "Fechar escopo", en: "Hide scope" } satisfies L10n,
  },

  hero: {
    headline: {
      pt: "Eduardo Mendonça",
      en: "Eduardo Mendonça",
    } satisfies L10n,
    subheadline: {
      pt: "Frontend Sênior com visão de arquitetura e atuação full-stack · Web & Mobile",
      en: "Senior Frontend Engineer with an architecture mindset and full-stack range · Web & Mobile",
    } satisfies L10n,
    marquee: [
      { pt: "Disponível para projetos", en: "Available for projects" },
      { pt: "React · React Native · Node", en: "React · React Native · Node" },
      { pt: "Web · Mobile · E-commerce", en: "Web · Mobile · E-commerce" },
      { pt: "TypeScript · GraphQL · Prisma", en: "TypeScript · GraphQL · Prisma" },
      { pt: "Core Web Vitals · SEO", en: "Core Web Vitals · SEO" },
      { pt: "Remoto", en: "Remote" },
    ] satisfies L10n[],
    ctaPrimary: {
      label: { pt: "Agendar conversa", en: "Book a call" },
      href: "https://calendly.com/eduardomendoncasilva9/30min",
    } satisfies CtaLink,
    ctaSecondary: {
      label: { pt: "Ver stack", en: "See stack" },
      anchor: "#stack",
    } satisfies CtaAnchor,
  },

  services: [
    {
      id: "sites",
      title: {
        pt: "Sites institucionais & landing pages",
        en: "Business sites & landing pages",
      },
      summary: {
        pt: "Presença digital rápida, otimizada para conversão e SEO, do zero ou em WordPress/Webflow.",
        en: "Fast digital presence, optimized for conversion and SEO, from scratch or on WordPress/Webflow.",
      },
      tags: ["wordpress", "webflow", "seo"],
      scope: {
        pt: "Descoberta e arquitetura de conteúdo · design responsivo · implementação em Astro, WordPress ou Webflow · SEO técnico on-page · deploy e monitoramento de Core Web Vitals.",
        en: "Discovery and content architecture · responsive design · build in Astro, WordPress or Webflow · technical on-page SEO · deploy and Core Web Vitals monitoring.",
      },
    },
    {
      id: "ecommerce",
      title: {
        pt: "E-commerce / loja virtual",
        en: "E-commerce / online store",
      },
      summary: {
        pt: "Lojas performáticas, headless quando faz sentido, com Core Web Vitals no verde e checkout otimizado.",
        en: "High-performance stores, headless when it makes sense, with green Core Web Vitals and an optimized checkout.",
      },
      tags: ["headless", "graphql", "prisma", "tray", "shopify", "nuvemshop", "salesforce commerce cloud"],
      scope: {
        pt: "Arquitetura headless (storefront + CMS/API) · catálogo e carrinho performáticos · checkout otimizado para conversão · integração de pagamentos e frete · Core Web Vitals no verde.",
        en: "Headless architecture (storefront + CMS/API) · performant catalog and cart · conversion-optimized checkout · payment and shipping integrations · green Core Web Vitals.",
      },
    },
    {
      id: "mobile",
      title: {
        pt: "Aplicativos mobile",
        en: "Mobile apps",
      },
      summary: {
        pt: "Apps React Native/Expo, publicação nas lojas, integração com back-end Node/TypeScript.",
        en: "React Native/Expo apps, store publishing, integration with a Node/TypeScript back-end.",
      },
      tags: ["react native", "expo", "typescript"],
      scope: {
        pt: "Prototipagem e UI em React Native/Expo · integração com back-end Node/TypeScript · autenticação e notificações push · publicação na App Store e Google Play · monitoramento pós-lançamento.",
        en: "Prototyping and UI in React Native/Expo · integration with a Node/TypeScript back-end · authentication and push notifications · App Store and Google Play publishing · post-launch monitoring.",
      },
    },
  ] satisfies ServiceItem[],

  // FICTÍCIO: valores de exemplo para visualizar o layout. Troque por números reais e verificáveis antes do lançamento.
  stats: [
    { id: "projects", value: 42, label: { pt: "Projetos entregues", en: "Projects delivered" } },
    { id: "years", value: 8, label: { pt: "Anos de experiência", en: "Years of experience" } },
    {
      id: "lighthouse",
      value: 98,
      suffix: "/100",
      label: { pt: "Core Web Vitals médio (Lighthouse)", en: "Average Core Web Vitals (Lighthouse)" },
    },
    { id: "apps", value: 12, label: { pt: "Apps publicados nas lojas", en: "Apps published on app stores" } },
    { id: "clients", value: 25, label: { pt: "Clientes atendidos", en: "Clients served" } },
  ] satisfies StatItem[],

  // TODO: replace remaining placeholders with real client/product logos in /public/clients/.
  clients: [
    { id: "seara", name: "Seara Food Solutions", logoSrc: "/clients/seara.png" },
    { id: "dove", name: "Dove", logoSrc: "/clients/dove.png" },
    { id: "alelo", name: "Alelo", logoSrc: "/clients/alelo.svg" },
    { id: "ze-delivery", name: "Zé Delivery", logoSrc: "/clients/ze.webp", invertOnHover: true },
    { id: "tv-cultura", name: "TV Cultura", logoSrc: "/clients/tv-cultura.png" },
    { id: "ambev", name: "Ambev", logoSrc: "/clients/ambev.webp" },
    { id: "poder360", name: "Poder360", logoSrc: "/clients/poder360.svg" },
    { id: "opovo", name: "O Povo", logoSrc: "/clients/opovo.svg" },
    { id: "giga", name: "Giga+", logoSrc: "/clients/giga.webp" },
    { id: "sao-vicente", name: "Supermercados São Vicente", logoSrc: "/clients/saovicente.webp" },
    { id: "mobifacil", name: "MobiFácil", logoSrc: "/clients/mobifacil.webp" },
  ] satisfies ClientItem[],

  stack: {
    categories: [
      {
        name: { pt: "Front-end", en: "Front-end" },
        items: ["HTML5", "CSS3", "Tailwind", "React", "React Native", "Expo", "Vue", "Svelte", "jQuery"],
      },
      {
        name: { pt: "Back-end", en: "Back-end" },
        items: ["Node.js", "TypeScript", "GraphQL", "Prisma"],
      },
      {
        name: { pt: "CMS / No-code", en: "CMS / No-code" },
        items: ["WordPress", "Webflow", "Salesforce Commerce Cloud"],
      },
      {
        name: { pt: "Workflow", en: "Workflow" },
        items: ["Git", "GitFlow"],
      },
      {
        name: { pt: "Performance & SEO", en: "Performance & SEO" },
        items: ["Core Web Vitals", "SEO técnico"],
      },
    ] satisfies StackCategory[],
  },

  contact: {
    headline: {
      pt: "Precisa de alguém que entrega do zero ao deploy?",
      en: "Need someone who delivers from zero to deploy?",
    } satisfies L10n,
    ctaPrimary: {
      label: { pt: "Agendar 15 min", en: "Book 15 min" },
      href: "https://calendly.com/eduardomendoncasilva9/30min",
    } satisfies CtaLink,
    ctaSecondary: {
      label: { pt: "Enviar e-mail", en: "Send an email" },
      href: "mailto:eduardomendoncasilva9@gmail.com",
    } satisfies CtaLink,
  },

  social: {
    github: "https://github.com/eduardomds96/",
    linkedin: "https://www.linkedin.com/in/eduardo-mendonca-frontend/",
    instagram: "TODO_INSTAGRAM_URL",
  },

  // TODO: confirm base location shown in header/footer.
  location: {
    pt: "Remoto · Brasil",
    en: "Remote · Brazil",
  } satisfies L10n,

  bottomBar: {
    madeWith: {
      pt: "Feito com Astro + Svelte + GSAP",
      en: "Made with Astro + Svelte + GSAP",
    } satisfies L10n,
  },
} as const;

export type SiteContent = typeof siteContent;
