#!/usr/bin/env node
/**
 * Однофайловая сборка сайта «Пафия».
 *
 * Берёт уже собранные страницы и склеивает их в один HTML-файл: стили, скрипт
 * и все картинки внутри, переходы между страницами — на хеш-роутере. Файл
 * открывается двойным кликом без сервера, его можно отправить в мессенджере
 * или показать клиенту с флешки.
 *
 * Обычная многофайловая версия остаётся основной — это для показа.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { site } from './src/data/site.mjs';
import { masters } from './src/data/masters.mjs';
import { techniques } from './src/data/techniques.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

/* Порядок важен: index идёт первым и отдаёт свою «обвязку» — шапку и подвал. */
const PAGES = [
  'index.html',
  'prices.html',
  'masters.html',
  ...masters.map((m) => `masters/${m.slug}.html`),
  ...techniques.map((t) => `services/${t.slug}.html`),
  'contacts.html',
  'booking.html',
  'privacy.html',
  'cookies.html',
  '404.html',
];

const routeOf = (page) => page.replace(/\.html$/, '');
const titleOf = (html) => (html.match(/<title>([^<]*)<\/title>/) || [])[1] || site.name;
const descOf = (html) => (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';

/* --- Картинки складываем в data: URI ------------------------------------- */
const assetCache = new Map();
function assetUri(path) {
  if (assetCache.has(path)) return assetCache.get(path);
  const bytes = readFileSync(join(ROOT, path));
  const type = path.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
  const uri = `data:${type};base64,${bytes.toString('base64')}`;
  assetCache.set(path, uri);
  return uri;
}

/**
 * Переписывает ссылки: страницы — на маршруты роутера, картинки — в data: URI,
 * внешние адреса и якоря внутри страницы оставляет как есть.
 */
function rewrite(html) {
  return html.replace(/(href|src)="([^"]*)"/g, (full, attr, value) => {
    if (/^(https?:|mailto:|tel:|viber:|data:|#)/.test(value)) return full;

    const clean = value.replace(/^(\.\.\/)+/, '');
    if (/^assets\/img\/.+\.(svg|png)$/.test(clean)) return `${attr}="${assetUri(clean)}"`;
    if (clean === 'assets/css/style.css' || clean === 'assets/js/main.js') return `${attr}="#"`;
    if (clean === 'sitemap.xml' || clean === 'site.webmanifest') return `${attr}="#"`;

    const [path, hash] = clean.split('#');
    if (path.endsWith('.html')) {
      const route = routeOf(path);
      return `${attr}="#/${route}${hash ? '@' + hash : ''}"`;
    }
    return full;
  });
}

/* --- Обвязка: всё, что вокруг <main> ------------------------------------- */
const home = read('index.html');
const bodyOf = (html) => html.slice(html.indexOf('<body'), html.lastIndexOf('</body>'));
const homeBody = bodyOf(home);

const shellTop = rewrite(homeBody.slice(homeBody.indexOf('>') + 1, homeBody.indexOf('<main id="main">')));
const shellBottom = rewrite(
  homeBody
    .slice(homeBody.indexOf('</main>') + '</main>'.length)
    .replace(/<script src="[^"]*"[^>]*><\/script>\s*$/, '')
    // «Карта сайта» в однофайловой версии никуда не ведёт
    .replace(/<a href="[^"]*">Карта сайта<\/a>/, '')
);

/* --- Страницы ------------------------------------------------------------ */
const seenIds = new Set();
const duplicates = [];
const routes = [];

for (const page of PAGES) {
  const html = read(page);
  const route = routeOf(page);
  let main = html.slice(html.indexOf('<main id="main">') + '<main id="main">'.length, html.indexOf('</main>'));
  main = rewrite(main);

  // Один документ на все страницы — значит, одинаковые id надо развести.
  const renames = new Map();
  for (const [, id] of main.matchAll(/\sid="([^"]+)"/g)) {
    if (seenIds.has(id)) renames.set(id, `${id}--${route.replace(/\//g, '-')}`);
    else seenIds.add(id);
  }
  for (const [id, unique] of renames) {
    main = main.split(` id="${id}"`).join(` id="${unique}"`);
    main = main.split(`href="#${id}"`).join(`href="#${unique}"`);
  }
  if (renames.size) duplicates.push(`${route}: ${[...renames.keys()].join(', ')}`);

  routes.push({ route, title: titleOf(html), description: descOf(html), main });
}

/* --- Скрипт: в однофайловой версии страницы живут в одном документе ------ */
const script = read('assets/js/main.js')
  .replace(
    "    var inlineForm = $('#booking-form-standalone');",
    `    // Страница записи существует всегда — важно, открыта ли она сейчас.
    var visibleInlineForm = function () {
      var f = $('#booking-form-standalone');
      var page = f && f.closest('[data-route]');
      return page && !page.hidden ? f : null;
    };`
  )
  .replace(
    `        if (inlineForm) {
          inlineForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
          var field = $('input[name="name"]', inlineForm);`,
    `        var inlineForm = visibleInlineForm();
        if (inlineForm) {
          inlineForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
          var field = $('input[name="name"]', inlineForm);`
  );

const router = `
/* Хеш-роутер однофайловой версии: #/prices, #/masters/larisa, #/index@services */
(function () {
  var TITLES = ${JSON.stringify(Object.fromEntries(routes.map((r) => [r.route, r.title])))};
  var pages = [].slice.call(document.querySelectorAll('[data-route]'));

  function show(hash) {
    var raw = (hash || '').replace(/^#\\//, '');
    var parts = raw.split('@');
    var route = parts[0] || 'index';
    var anchor = parts[1];
    if (!TITLES[route]) route = '404';

    pages.forEach(function (p) { p.hidden = p.getAttribute('data-route') !== route; });
    document.title = TITLES[route];

    document.querySelectorAll('.topbar__link').forEach(function (a) {
      var target = (a.getAttribute('href') || '').replace(/^#\\//, '').split('@')[0];
      a.classList.toggle('is-active', target === route && !anchor);
    });

    var menu = document.getElementById('mobile-menu');
    var burger = document.querySelector('.burger');
    if (menu && burger) { menu.hidden = true; burger.setAttribute('aria-expanded', 'false'); }

    if (anchor) {
      var el = document.getElementById(anchor);
      if (el) { el.scrollIntoView({ block: 'start' }); return; }
    }
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', function () {
    if (location.hash.indexOf('#/') === 0) show(location.hash);
  });
  show(location.hash);
})();
`;

const favicon = assetUri('assets/img/favicon.svg');

const out = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${routes[0].title}</title>
<meta name="description" content="${routes[0].description}">
<meta name="theme-color" content="#fbf8f4">
<meta name="format-detection" content="telephone=no">
<link rel="icon" href="${favicon}" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap">
<style>
${read('assets/css/style.css')}
</style>
</head>
<body class="page-home">
<a class="skip" href="#main">Перейти к содержанию</a>
${shellTop}
<main id="main">
${routes
  .map((r) => `<div data-route="${r.route}"${r.route === 'index' ? '' : ' hidden'}>\n${r.main}\n</div>`)
  .join('\n')}
</main>
${shellBottom}
<script>
${script}
${router}
</script>
</body>
</html>
`;

mkdirSync(join(ROOT, 'dist'), { recursive: true });
const file = 'dist/pafia-sayt.html';
writeFileSync(join(ROOT, file), out);
console.log(`${file} — ${routes.length} страниц, ${(Buffer.byteLength(out) / 1024 / 1024).toFixed(2)} МБ, картинок внутри: ${assetCache.size}`);
if (duplicates.length) console.log('Развели повторяющиеся id: ' + duplicates.join(' · '));
