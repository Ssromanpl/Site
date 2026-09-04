// Генератор фото-заглушек. Настоящих снимков салона у нас нет и брать чужие
// из 2ГИС нельзя (права у авторов), поэтому на их местах — аккуратные
// плейсхолдеры в палитре сайта. Заменяются один в один по имени файла.
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const PALETTES = [
  ['#EFE4D8', '#DCC8B4', '#A65B3E'],
  ['#E7E3D8', '#CFC7B4', '#8A6A46'],
  ['#E9E2E6', '#D3C6CE', '#7A6B8A'],
  ['#E1E7E1', '#C6D2C6', '#5F7A6B'],
  ['#F0E3DC', '#DDC4B8', '#9A6B5A'],
];

const hash = (s) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
};

const registry = new Map();

function svgFor(name, label, w, h) {
  const seed = hash(name);
  const [bg, mid, accent] = PALETTES[seed % PALETTES.length];
  const cx = 0.3 + ((seed >> 3) % 40) / 100;
  const cy = 0.3 + ((seed >> 7) % 40) / 100;
  const r = 0.28 + ((seed >> 11) % 18) / 100;
  const rot = (seed >> 5) % 60 - 30;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label.replace(/[<>&"]/g, '')}">
<defs>
  <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="${mid}"/>
  </linearGradient>
  <clipPath id="c"><rect width="${w}" height="${h}"/></clipPath>
</defs>
<g clip-path="url(#c)">
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <circle cx="${Math.round(w * cx)}" cy="${Math.round(h * cy)}" r="${Math.round(Math.min(w, h) * r)}" fill="${accent}" opacity="0.14"/>
  <g transform="rotate(${rot} ${Math.round(w * 0.72)} ${Math.round(h * 0.7)})">
    <rect x="${Math.round(w * 0.55)}" y="${Math.round(h * 0.5)}" width="${Math.round(w * 0.42)}" height="${Math.round(h * 0.42)}" rx="${Math.round(Math.min(w, h) * 0.06)}" fill="${accent}" opacity="0.10"/>
  </g>
  <circle cx="${Math.round(w / 2)}" cy="${Math.round(h / 2 - h * 0.03)}" r="${Math.round(Math.min(w, h) * 0.085)}" fill="none" stroke="${accent}" stroke-opacity="0.5" stroke-width="${Math.max(1.5, Math.min(w, h) * 0.006)}"/>
  <circle cx="${Math.round(w / 2)}" cy="${Math.round(h / 2 - h * 0.03)}" r="${Math.round(Math.min(w, h) * 0.03)}" fill="${accent}" fill-opacity="0.45"/>
  <text x="${Math.round(w / 2)}" y="${Math.round(h / 2 + Math.min(w, h) * 0.17)}" text-anchor="middle"
        font-family="Manrope, Segoe UI, Helvetica, Arial, sans-serif" font-size="${Math.max(11, Math.round(Math.min(w, h) * 0.052))}"
        font-weight="600" fill="${accent}" fill-opacity="0.92">${label.replace(/[<>&]/g, '')}</text>
</g>
</svg>`;
}

/**
 * Регистрирует заглушку и возвращает готовый <img>.
 * @param {object} o
 * @param {string} o.name  имя файла без расширения — по нему кладут реальное фото
 * @param {string} o.label подпись внутри заглушки
 * @param {string} o.alt   alt для доступности и SEO
 */
export function photo({ name, label, alt, w = 800, h = 600, depth = 0, className = '', sizes = '', priority = false }) {
  registry.set(name, { label, w, h });
  const src = (depth ? '../'.repeat(depth) : '') + `assets/img/${name}.svg`;
  const cls = ['photo', className].filter(Boolean).join(' ');
  const load = priority ? 'fetchpriority="high"' : 'loading="lazy"';
  return `<img class="${cls}" src="${src}" width="${w}" height="${h}" alt="${alt.replace(/"/g, '&quot;')}" ${load} decoding="async"${sizes ? ` sizes="${sizes}"` : ''}>`;
}

export function writePlaceholders(outDir) {
  const dir = join(outDir, 'assets', 'img');
  mkdirSync(dir, { recursive: true });
  for (const [name, meta] of registry) {
    writeFileSync(join(dir, `${name}.svg`), svgFor(name, meta.label, meta.w, meta.h));
  }
  return registry.size;
}
