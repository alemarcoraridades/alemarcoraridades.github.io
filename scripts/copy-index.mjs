import { copyFileSync } from "node:fs";

copyFileSync("docs/index.html", "docs/404.html" );

console.log("docs/404.html criado com sucesso");

