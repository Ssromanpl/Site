#!/usr/bin/env node
/**
 * Сборка сайта салона «Пафия».
 * Никаких зависимостей: `node build.mjs` — и в корне готовые HTML-файлы,
 * которые можно залить на любой хостинг или отдать через GitHub Pages.
 */
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { site } from './src/data/site.mjs';
import { masters } from './src/data/masters.mjs';
import { techniques } from './src/data/techniques.mjs';
import { homePage } from './src/pages/home.mjs';
import { pricesPage } from './src/pages/prices.mjs';
import { mastersIndexPage, masterPage } from './src/pages/masters.mjs';
import { techniquePage } from './src/pages/technique.mjs';
import { contactsPage } from './src/pages/contacts.mjs';
import { bookingPage } from './src/pages/booking.mjs';
import { privacyPage, cookiesPage, notFoundPage } from './src/pages/legal.mjs';
import { writePlaceholders } from './src/lib/placeholders.mjs';
import { Canvas } from './src/lib/png.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const write = (rel, content) => {
  const file = join(ROOT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
  return rel;
};

/* --- Страницы ------------------------------------------------------------ */
const pages = [
  ['index.html', homePage(), { priority: '1.0', changefreq: 'weekly' }],
  ['prices.html', pricesPage(), { priority: '0.9', changefreq: 'weekly' }],
  ['masters.html', mastersIndexPage(), { priority: '0.9', changefreq: 'monthly' }],
  ['contacts.html', contactsPage(), { priority: '0.8', changefreq: 'monthly' }],
  ['booking.html', bookingPage(), { priority: '0.8', changefreq: 'monthly' }],
  ...masters.map((m) => [`masters/${m.slug}.html`, masterPage(m), { priority: '0.7', changefreq: 'monthly' }]),
  ...techniques.map((t) => [`services/${t.slug}.html`, techniquePage(t), { priority: '0.7', changefreq: 'monthly' }]),
  ['privacy.html', privacyPage(), { priority: '0.3', changefreq: 'yearly' }],
  ['cookies.html', cookiesPage(), { priority: '0.3', changefreq: 'yearly' }],
  ['404.html', notFoundPage(), null],
];

// Старые сборки подстраниц удаляем, чтобы не оставалось «сирот».
for (const dir of ['masters', 'services']) {
  const p = join(ROOT, dir);
  if (existsSync(p)) rmSync(p, { recursive: true, force: true });
}

const written = pages.map(([path, html]) => write(path, html));

/* --- Заглушки фотографий ------------------------------------------------- */
const placeholders = writePlaceholders(ROOT);

/* --- Иконки и og-превью -------------------------------------------------- */
const PAPER = [251, 248, 244];
const ACCENT = [166, 91, 62];
const INK = [35, 32, 29];

write(
  'assets/img/favicon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="14" fill="#a65b3e"/>
  <path d="M20 18h24v6H20zM20 18h6v28h-6zM38 18h6v28h-6z" fill="#fff"/>
</svg>`
);

write(
  'assets/img/logo.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 64" width="240" height="64">
  <circle cx="32" cy="32" r="24" fill="#a65b3e"/>
  <path d="M22 21h20v5H22zM22 21h5v22h-5zM37 21h5v22h-5z" fill="#fff"/>
  <text x="72" y="41" font-family="Manrope, Segoe UI, Arial, sans-serif" font-size="28" font-weight="800" fill="#23201d">Пафия</text>
</svg>`
);

const touch = new Canvas(180, 180, PAPER);
touch.fill(0, 0, 180, 180, ACCENT);
touch.letterP(90, 90, 92, [255, 255, 255]);
write('assets/img/apple-touch-icon.png', touch.toPNG());

const og = new Canvas(1200, 630, PAPER);
og.gradient([252, 249, 245], [240, 231, 221]);
og.circle(980, 210, 300, ACCENT, 0.1);
og.circle(150, 560, 220, ACCENT, 0.07);
og.circle(150, 150, 78, ACCENT);
og.letterP(150, 150, 74, [255, 255, 255]);
og.fill(80, 300, 420, 8, ACCENT);
og.fill(80, 372, 700, 4, INK, 0.12);
og.fill(80, 420, 560, 4, INK, 0.12);
og.fill(80, 468, 620, 4, INK, 0.12);
write('assets/img/og.png', og.toPNG());

/* --- robots.txt, sitemap.xml, манифест ----------------------------------- */
const today = new Date().toISOString().slice(0, 10);
const loc = (p) => `${site.origin}/${p}`.replace(/\/index\.html$/, '/');

write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .filter(([, , meta]) => meta)
  .map(
    ([path, , meta]) =>
      `  <url>\n    <loc>${loc(path)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${meta.changefreq}</changefreq>\n    <priority>${meta.priority}</priority>\n  </url>`
  )
  .join('\n')}
</urlset>
`
);

// В режиме черновика закрываем сайт от поисковиков целиком.
write(
  'robots.txt',
  process.env.DEMO === '1'
    ? `User-agent: *
Disallow: /
`
    : `User-agent: *
Allow: /
Disallow: /404.html

Sitemap: ${site.origin}/sitemap.xml
Host: ${site.origin.replace('https://', '')}
`
);

write(
  'site.webmanifest',
  JSON.stringify(
    {
      name: site.name,
      short_name: 'Пафия',
      description: 'Салон-парикмахерская на Притыцкого, 73 в Минске: стрижки, окрашивание, маникюр, депиляция.',
      lang: 'ru',
      start_url: '/',
      display: 'standalone',
      background_color: '#fbf8f4',
      theme_color: '#fbf8f4',
      icons: [
        { src: '/assets/img/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
        { src: '/assets/img/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
    null,
    2
  ) + '\n'
);

// GitHub Pages не должен прогонять файлы через Jekyll.
write('.nojekyll', '');

console.log(`Готово: ${written.length} страниц, ${placeholders} фото-заглушек.`);
written.forEach((f) => console.log('  ' + f));
