import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outputDir = "docs";
const sourceHtml = readFileSync(join(outputDir, "index.html"), "utf8");
const origin = "https://sonhocarroantigo.com.br";

const pages = [
  {
    route: "motorap",
    title: "Motor AP | Guia de Manutenção e Diagnóstico",
    description:
      "Aprenda a cuidar do motor AP com um guia prático sobre manutenção, diagnóstico de falhas, ignição, arrefecimento e lubrificação, explicado para iniciantes.",
    image: "/ebook_celular.png",
    heading: "Guia de manutenção e diagnóstico do motor AP",
  },
  {
    route: "carroantigo",
    title: "Carro Antigo | Guia de Avaliação Antes da Compra",
    description:
      "Aprenda a avaliar um carro antigo antes de comprar: carroceria, mecânica, test drive, documentação e negociação, com orientações para iniciantes.",
    image: "/ebook_carro_antigo_tablet.png",
    heading: "Guia para avaliar carros antigos antes da compra",
  },
  {
    route: "alemarco-motor",
    title: "AleMarco Motor | Manutenção de Carros Clássicos",
    description:
      "Acompanhe manutenção, sintomas, diagnóstico e histórico do seu carro clássico com o Alemarco Motor, um app para cuidar do veículo com mais previsibilidade.",
    image: "/alemarco-motor/icon.png",
    heading: "Alemarco Motor: manutenção e histórico para carros clássicos",
  },
  {
    route: "alemarco-classics",
    title: "AleMarco Classics | Avaliação de Carros Clássicos",
    description:
      "Avalie carros clássicos com o Alemarco Classics: inspeção guiada, critérios organizados e relatório claro para apoiar decisões de compra e cuidado.",
    image: "/alemarco-classics/icon.png",
    heading: "Alemarco Classics: avaliação guiada de carros clássicos",
  },
];

function escapeAttribute(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
}

function withMetadata(html, page) {
  const canonical = `${origin}/${page.route}/`;
  const title = escapeAttribute(page.title);
  const description = escapeAttribute(page.description);
  const image = `${origin}${page.image}`;

  let document = html
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\s+name=["']description["'][^>]*\/?\s*>/i, "")
    .replace(/<meta\s+name=["']keywords["'][^>]*\/?\s*>/i, "")
    .replace(/<meta\s+property=["'](?:og|twitter):[^"']+["'][^>]*\/?\s*>/gi, "")
    .replace(/<link\s+rel=["']canonical["'][^>]*\/?\s*>/i, "");

  const tags = `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${canonical}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="AleMarco" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${canonical}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />`;
  const fallback = `\n    <noscript><main><h1>${page.heading}</h1><p>${description}</p></main></noscript>\n  `;

  document = document.replace("</head>", `${tags}\n  </head>`);
  document = document.replace('<div id="root"></div>', `<div id="root"></div>${fallback}`);
  return document;
}

for (const page of pages) {
  const routeDir = join(outputDir, page.route);
  mkdirSync(routeDir, { recursive: true });
  writeFileSync(join(routeDir, "index.html"), withMetadata(sourceHtml, page));
}

copyFileSync(join(outputDir, "index.html"), join(outputDir, "404.html"));
console.log("HTMLs das quatro landing pages e fallback 404 criados.");
