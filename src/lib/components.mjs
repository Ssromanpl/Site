import { esc, url } from './layout.mjs';
import { icon } from './icons.mjs';
import { site } from '../data/site.mjs';
import { priceLabel } from '../data/prices.mjs';
import { photo } from './placeholders.mjs';

export function sectionHead({ eyebrow, title, text = '', action = '', id = '' }) {
  return `
<div class="sechead"${id ? ` id="${id}"` : ''}>
  <div class="sechead__main">
    ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
    <h2 class="sechead__title">${title}</h2>
    ${text ? `<p class="sechead__text">${text}</p>` : ''}
  </div>
  ${action ? `<div class="sechead__action">${action}</div>` : ''}
</div>`;
}

export const bookButton = (label = 'Записаться', { master = '', service = '', cls = 'btn btn--primary' } = {}) =>
  `<button class="${cls}" type="button" data-book${master ? ` data-master="${esc(master)}"` : ''}${
    service ? ` data-service="${esc(service)}"` : ''
  }>${esc(label)}</button>`;

export function priceRows(items) {
  return items
    .map(
      (i) => `
    <li class="pricerow">
      <span class="pricerow__name">${esc(i.name)}${i.note ? `<span class="pricerow__note">${esc(i.note)}</span>` : ''}</span>
      <span class="pricerow__dots" aria-hidden="true"></span>
      <span class="pricerow__price${i.free ? ' pricerow__price--free' : ''}">${esc(priceLabel(i))}</span>
      ${bookButton('Записаться', { service: i.name, cls: 'pricerow__btn' })}
    </li>`
    )
    .join('');
}

export function masterCard(m, depth = 0, { level = 3 } = {}) {
  const href = url(`masters/${m.slug}.html`, depth);
  const H = `h${level}`;
  return `
<article class="mcard">
  <a class="mcard__media" href="${href}" tabindex="-1" aria-hidden="true">
    ${photo({
      name: `master-${m.slug}`,
      label: m.name,
      alt: `${m.name} — ${m.role.toLowerCase()} салона «Пафия»`,
      w: 640,
      h: 800,
      depth,
      className: 'mcard__img',
    })}
  </a>
  <div class="mcard__body">
    <p class="mcard__role">${esc(m.role)}</p>
    <${H} class="mcard__name"><a href="${href}">${esc(m.name)}</a></${H}>
    <p class="mcard__exp">${esc(m.experience)} · в «Пафии» с ${m.since}</p>
    <p class="mcard__text">${esc(m.card)}</p>
    <div class="mcard__actions">
      ${bookButton(`Записаться к ${m.dative}`, { master: m.name, cls: 'btn btn--primary btn--sm' })}
      <a class="link link--arrow" href="${href}">Подробнее ${icon('arrow')}</a>
    </div>
  </div>
</article>`;
}

export function ratingCard(depth = 0) {
  return `
<div class="rating">
  <div class="rating__score">
    <span class="rating__value">${esc(site.rating.value)}</span>
    <span class="rating__stars" aria-hidden="true">${icon('star').repeat(5)}</span>
    <span class="rating__count">${site.rating.count} отзывов на ${esc(site.rating.source)}</span>
  </div>
  <p class="rating__text">
    Это самый высокий рейтинг среди салонов на Притыцкого. Мы не переписываем чужие отзывы к себе на сайт —
    читайте их там, где они оставлены.
  </p>
  <a class="btn btn--ghost" href="${site.rating.url}" target="_blank" rel="noopener nofollow">Читать отзывы на Google</a>
</div>`;
}

export function ctaBand({ depth = 0, title = 'Записаться в «Пафию»', text = '' } = {}) {
  return `
<section class="cta">
  <div class="wrap cta__inner">
    <div class="cta__text">
      <h2 class="cta__title">${esc(title)}</h2>
      <p>${text || 'Выберите услугу, мастера и удобное время. Мы подтвердим запись в течение рабочего дня. Или позвоните — иногда получается вписать на сегодня.'}</p>
    </div>
    <div class="cta__actions">
      ${bookButton('Записаться онлайн', { cls: 'btn btn--primary btn--lg' })}
      <a class="btn btn--ghost btn--lg" href="${site.phonePrimary.href}" data-goal="phone">${icon('phone')} ${site.phonePrimary.label}</a>
      <a class="btn btn--link" href="${site.viber}" data-goal="viber">Написать в Viber</a>
    </div>
  </div>
</section>`;
}

export function crumbs(items, depth = 0) {
  const last = items.length - 1;
  return `
<nav class="crumbs" aria-label="Хлебные крошки">
  <div class="wrap">
    <ol>
      ${items
        .map((c, i) =>
          i === last
            ? `<li><span aria-current="page">${esc(c.name)}</span></li>`
            : `<li><a href="${url(c.path, depth)}">${esc(c.name)}</a></li>`
        )
        .join('')}
    </ol>
  </div>
</nav>`;
}

export function faqList(items, { open = 0 } = {}) {
  return `
<div class="faq">
  ${items
    .map(
      (f, i) => `
  <details class="faq__item"${i === open ? ' open' : ''}>
    <summary class="faq__q">${esc(f.q)}<span class="faq__mark" aria-hidden="true"></span></summary>
    <div class="faq__a"><p>${esc(f.a)}</p></div>
  </details>`
    )
    .join('')}
</div>`;
}

export const noteBox = (text, { kind = 'info' } = {}) =>
  `<p class="note note--${kind}">${icon(kind === 'warn' ? 'shield' : 'check')}<span>${text}</span></p>`;
