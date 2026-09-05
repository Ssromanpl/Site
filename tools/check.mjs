// Проверка собранного сайта: JSON-LD, метатеги, битые ссылки и якоря,
// баланс тегов. Запуск: npm run check
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

import { fileURLToPath } from 'node:url';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const walk = (d, out = []) => {
  for (const f of readdirSync(d)) {
    if (['.git', 'node_modules', 'src', 'tools', 'dist'].includes(f)) continue;
    const p = join(d, f);
    statSync(p).isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
};
const htmls = walk(ROOT).filter((f) => f.endsWith('.html'));
let errors = 0;
const err = (m) => { console.log('  ✗ ' + m); errors++; };

for (const file of htmls) {
  const rel = file.replace(ROOT + '/', '');
  const html = readFileSync(file, 'utf8');
  console.log('— ' + rel);

  // JSON-LD
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch (e) { err('битый JSON-LD: ' + e.message); }
  }
  // базовые теги
  if (!/<html lang="ru">/.test(html)) err('нет lang="ru"');
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) err(`h1 в количестве ${h1}`);
  if (!/<meta name="description" content="[^"]{50,}"/.test(html)) err('description короткий или отсутствует');
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  if (title.length < 20 || title.length > 75) err(`title длиной ${title.length}: ${title}`);
  // незакрытые/подозрительные шаблоны
  if (html.includes('${')) err('невыполненная подстановка ${...}');
  if (html.includes('undefined')) err('в разметке есть "undefined"');
  if (/\.fix|\[object Object\]/.test(html)) err('следы отладки');

  // ссылки и ресурсы
  const dir = dirname(file);
  const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|viber:|data:|#)/.test(ref)) continue;
    const [path, hash] = ref.split('#');
    if (!path) continue;
    const target = resolve(dir, path);
    if (!existsSync(target)) err(`битая ссылка: ${ref}`);
    else if (hash && target.endsWith('.html')) {
      const t = readFileSync(target, 'utf8');
      if (!new RegExp(`id="${hash}"`).test(t)) err(`нет якоря #${hash} в ${path}`);
    }
  }
  // баланс тегов
  for (const tag of ['div', 'section', 'article', 'ul', 'ol', 'li', 'form', 'dialog', 'figure']) {
    const open = (html.match(new RegExp(`<${tag}[\\s>]`, 'g')) || []).length;
    const close = (html.match(new RegExp(`</${tag}>`, 'g')) || []).length;
    if (open !== close) err(`несбалансированный <${tag}>: ${open} открыто, ${close} закрыто`);
  }
}
console.log(errors ? `\nОШИБОК: ${errors}` : `\nВсё чисто: ${htmls.length} страниц`);
process.exit(errors ? 1 : 0);
