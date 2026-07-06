// Gera public/sitemap.xml em tempo de build — ver 12-SEO_E_MARKETING.md.
// Roda antes do `vite build` (ver script "build" do package.json) para que o
// arquivo seja copiado de public/ para dist/ junto com os outros assets.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";

function loadEnvLocal() {
  const envPath = path.join(root, ".env.local");
  if (!existsSync(envPath)) return {};
  const content = readFileSync(envPath, "utf-8");
  const env = {};
  for (const line of content.split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match) env[match[1]] = match[2];
  }
  return env;
}

const env = { ...loadEnvLocal(), ...process.env };
const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY;
const SITE_URL = env.VITE_SITE_URL || "https://panico.morning-mouse-a96d.workers.dev";

const staticRoutes = ["/", "/planos", "/obituarios", "/cemiterio", "/coroas", "/blog"];

async function fetchColumn(table, select, filter) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}&${filter}`;
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) return [];
  return res.json();
}

const obituaries = await fetchColumn("obituaries", "id", "status=eq.published");
const posts = await fetchColumn("blog_posts", "slug", "status=eq.published");

const urls = [
  ...staticRoutes,
  ...obituaries.map((o) => `/obituarios/${o.id}`),
  ...posts.map((p) => `/blog/${p.slug}`),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE_URL}${u}</loc></url>`).join("\n")}
</urlset>
`;

writeFileSync(path.join(root, "public", "sitemap.xml"), xml);
console.log(`sitemap.xml gerado com ${urls.length} URLs.`);
