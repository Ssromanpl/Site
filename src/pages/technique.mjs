import { layout, esc, url } from '../lib/layout.mjs';
import { icon } from '../lib/icons.mjs';
import { site } from '../data/site.mjs';
import { techniqueBySlug } from '../data/techniques.mjs';
import { masterBySlug } from '../data/masters.mjs';
import { photo } from '../lib/placeholders.mjs';
import { crumbs, ctaBand, bookButton, sectionHead, masterCard } from '../lib/components.mjs';

export function techniquePage(t) {
  const depth = 1;
  const master = masterBySlug[t.masterSlug];
  const related = t.related.map((s) => techniqueBySlug[s]).filter(Boolean);

  const content = `
${crumbs(
  [
    { name: 'Главная', path: 'index.html' },
    { name: 'Цены', path: 'prices.html' },
    { name: t.title },
  ],
  depth
)}

<article class="tech">
  <header class="tech__head">
    <div class="wrap tech__head-inner">
      <div class="tech__intro">
        <p class="eyebrow">Окрашивание</p>
        <h1 class="tech__title">${esc(t.h1)}</h1>
        <p class="tech__lead">${esc(t.lead)}</p>
        <dl class="tech__specs">
          <div><dt>Цена</dt><dd>от ${t.priceFrom} руб.<span>${esc(t.priceNote)}</span></dd></div>
          <div><dt>Время</dt><dd>${esc(t.duration)}<span>закладывайте визит целиком</span></dd></div>
          <div><dt>Держится</dt><dd>${esc(t.keepsFor)}<span>тонирование можно обновлять чаще</span></dd></div>
        </dl>
        <div class="tech__actions">
          ${bookButton(`Записаться на ${t.accusative}`, {
            master: master ? master.name : '',
            service: t.title,
            cls: 'btn btn--primary btn--lg',
          })}
          <a class="btn btn--ghost btn--lg" href="${url('prices.html#color', depth)}">Все цены на окрашивание</a>
        </div>
      </div>
      <div class="tech__media">
        ${photo({
          name: `tech-${t.slug}`,
          label: t.title,
          alt: `${t.title} — работа салона «Пафия», Минск`,
          w: 800,
          h: 900,
          depth,
          priority: true,
          className: 'tech__img',
        })}
      </div>
    </div>
  </header>

  <section class="section section--tight">
    <div class="wrap wrap--narrow prose">
      <h2>Что это такое</h2>
      ${t.what.map((p) => `<p>${esc(p)}</p>`).join('')}
    </div>
  </section>

  <section class="section section--soft">
    <div class="wrap">
      <div class="cols2">
        <div class="card card--tight">
          <h2 class="h4">Подойдёт, если</h2>
          <ul class="ticks ticks--tight">
            ${t.suits.map((s) => `<li>${icon('check')}<span>${esc(s)}</span></li>`).join('')}
          </ul>
        </div>
        <div class="card card--tight">
          <h2 class="h4">Лучше выбрать другое, если</h2>
          <ul class="ticks ticks--tight ticks--muted">
            ${t.notSuits.map((s) => `<li>${icon('minus')}<span>${esc(s)}</span></li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      ${sectionHead({ title: 'Как проходит визит' })}
      <ol class="steps steps--grid">
        ${t.steps
          .map(
            ([title, text], i) =>
              `<li class="steps__item"><span class="steps__num">${i + 1}</span><div><h3>${esc(title)}</h3><p>${esc(text)}</p></div></li>`
          )
          .join('')}
      </ol>
      <p class="note note--warn">${icon('shield')}<span>Цена указана без учёта стоимости материалов: расход зависит от длины и густоты волос. Мастер называет итоговую сумму после осмотра, до того как что-то смешает.</span></p>
    </div>
  </section>

  <section class="section section--soft">
    <div class="wrap wrap--narrow prose">
      <h2>Уход после окрашивания</h2>
      <ul class="ticks">
        ${t.aftercare.map((a) => `<li>${icon('check')}<span>${esc(a)}</span></li>`).join('')}
      </ul>
    </div>
  </section>

  ${
    master
      ? `<section class="section">
    <div class="wrap">
      ${sectionHead({ title: 'Кто делает', text: `${esc(t.title)} в «Пафии» — это к ${esc(master.dative)}.` })}
      <div class="grid grid--masters grid--masters-one">
        ${masterCard(master, depth)}
      </div>
    </div>
  </section>`
      : ''
  }

  <section class="section section--soft">
    <div class="wrap">
      ${sectionHead({ title: 'Другие техники' })}
      <div class="grid grid--tech">
        ${related
          .map(
            (r) =>
              `<a class="tcard" href="${url('services/' + r.slug + '.html', depth)}"><h3 class="tcard__title">${esc(r.title)}</h3><p class="tcard__text">${esc(r.lead)}</p><p class="tcard__meta"><span>от ${r.priceFrom} руб.</span><span>${esc(r.duration)}</span></p><span class="tcard__arrow" aria-hidden="true">${icon('arrow')}</span></a>`
          )
          .join('')}
      </div>
    </div>
  </section>
</article>

${ctaBand({ depth, title: `Записаться на ${t.accusative}` })}
`;

  return layout({
    title: t.metaTitle,
    description: t.metaDescription,
    path: `services/${t.slug}.html`,
    depth,
    active: 'prices.html',
    bodyClass: 'page-tech',
    crumbs: [
      { name: 'Главная', path: 'index.html' },
      { name: 'Цены', path: 'prices.html' },
      { name: t.title, path: `services/${t.slug}.html` },
    ],
    content,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: t.title,
        serviceType: `${t.title} — окрашивание волос`,
        description: t.lead,
        url: `${site.origin}/services/${t.slug}.html`,
        provider: { '@id': `${site.origin}/#salon` },
        areaServed: { '@type': 'City', name: 'Минск' },
        offers: {
          '@type': 'Offer',
          price: t.priceFrom,
          priceCurrency: 'BYN',
          description: `от ${t.priceFrom} руб., ${t.priceNote}`,
          availability: 'https://schema.org/InStock',
        },
      },
    ],
  });
}
