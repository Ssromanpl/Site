import { layout, esc, url } from '../lib/layout.mjs';
import { icon } from '../lib/icons.mjs';
import { site } from '../data/site.mjs';
import { masters } from '../data/masters.mjs';
import { techniques } from '../data/techniques.mjs';
import { photo } from '../lib/placeholders.mjs';
import { crumbs, masterCard, ctaBand, bookButton, sectionHead } from '../lib/components.mjs';

export function mastersIndexPage() {
  const content = `
${crumbs([{ name: 'Главная', path: 'index.html' }, { name: 'Мастера' }], 0)}

<section class="pagehead">
  <div class="wrap">
    <h1 class="pagehead__title">Мастера</h1>
    <p class="pagehead__lead">
      Салон небольшой, и это не минус: у каждого мастера своя база клиентов, которые ходят годами.
      Выберите человека — запись идёт к нему, а не в общую очередь.
    </p>
  </div>
</section>

<div class="wrap section section--tight">
  <div class="grid grid--masters grid--masters-wide">
    ${masters.map((m) => masterCard(m, 0, { level: 2 })).join('')}
  </div>
</div>

<section class="section section--soft">
  <div class="wrap wrap--narrow">
    ${sectionHead({ title: 'Не знаете, к кому записаться?' })}
    <p>
      Позвоните и опишите, что хотите — администратор подскажет, кто из мастеров сейчас свободен и кто
      лучше подойдёт под задачу. Сложный цвет — это к Марине, педикюр и наращивание — к Елене,
      депиляция — к Ольге.
    </p>
    <p class="pagehead__actions">
      <a class="btn btn--primary" href="${site.phonePrimary.href}" data-goal="phone">${icon('phone')} ${site.phonePrimary.label}</a>
      ${bookButton('Записаться к любому свободному', { cls: 'btn btn--ghost' })}
    </p>
  </div>
</section>

${ctaBand({ depth: 0 })}
`;

  return layout({
    title: 'Мастера салона «Пафия» — парикмахеры и мастера маникюра, Минск',
    description:
      'Наши парикмахеры, мастера ногтевого сервиса и депиляции на Притыцкого, 73. Стаж, специализация и запись к конкретному мастеру.',
    path: 'masters.html',
    depth: 0,
    active: 'masters.html',
    bodyClass: 'page-masters',
    crumbs: [
      { name: 'Главная', path: 'index.html' },
      { name: 'Мастера', path: 'masters.html' },
    ],
    content,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Мастера салона «Пафия»',
        itemListElement: masters.map((m, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${site.origin}/masters/${m.slug}.html`,
          name: m.name,
        })),
      },
    ],
  });
}

export function masterPage(m) {
  const depth = 1;
  const others = masters.filter((x) => x.slug !== m.slug).slice(0, 3);
  const relatedTech = techniques.filter((t) => t.masterSlug === m.slug);

  const content = `
${crumbs(
  [
    { name: 'Главная', path: 'index.html' },
    { name: 'Мастера', path: 'masters.html' },
    { name: m.name },
  ],
  depth
)}

<article class="master">
  <header class="master__head">
    <div class="wrap master__head-inner">
      <div class="master__portrait">
        ${photo({
          name: `master-${m.slug}-portrait`,
          label: m.name,
          alt: `${m.name} — ${m.role.toLowerCase()} салона «Пафия»`,
          w: 720,
          h: 880,
          depth,
          priority: true,
          className: 'master__img',
        })}
      </div>
      <div class="master__intro">
        <p class="eyebrow">${esc(m.role)}</p>
        <h1 class="master__name">${esc(m.name)}</h1>
        <p class="master__lead">${esc(m.lead)}</p>
        <ul class="master__facts">
          <li><span>${esc(m.experience)}</span></li>
          <li><span>В «Пафии» с ${m.since} года</span></li>
          <li><span>Притыцкого, 73, офис 144</span></li>
        </ul>
        <div class="master__actions">
          ${bookButton(`Записаться к ${m.dative}`, { master: m.name, cls: 'btn btn--primary btn--lg' })}
          <a class="btn btn--ghost btn--lg" href="${site.phonePrimary.href}" data-goal="phone">${icon('phone')} Позвонить</a>
        </div>
      </div>
    </div>
  </header>

  <section class="section section--tight">
    <div class="wrap master__body">
      <div class="master__col">
        <h2 class="h3">Как работает</h2>
        ${m.approach.map((p) => `<p>${esc(p)}</p>`).join('')}
      </div>
      <aside class="master__col master__col--aside">
        <div class="card card--tight">
          <h2 class="h4">Делает</h2>
          <ul class="ticks ticks--tight">
            ${m.specialties.map((s) => `<li>${icon('check')}<span>${esc(s)}</span></li>`).join('')}
          </ul>
          <a class="link link--arrow" href="${url('prices.html', depth)}">Цены на эти услуги ${icon('arrow')}</a>
        </div>
      </aside>
    </div>
  </section>

  <section class="section section--soft">
    <div class="wrap">
      ${sectionHead({ eyebrow: 'Портфолио', title: `Работы ${esc(m.genitive)}` })}
      <div class="gallery gallery--six">
        ${m.portfolio
          .map(
            (p, i) => `
        <figure class="gallery__item">
          ${photo({
            name: `work-${m.slug}-${i + 1}`,
            label: p,
            alt: `${p} — работа мастера ${m.name}, салон «Пафия»`,
            w: 600,
            h: 700,
            depth,
            className: 'gallery__img',
          })}
          <figcaption class="gallery__cap"><span>${esc(p)}</span></figcaption>
        </figure>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap wrap--narrow booking-inline card">
      <h2 class="h3">Записаться к ${esc(m.dative)}</h2>
      <p>Выберите день — мы подтвердим время в течение рабочего дня. К ${esc(m.dative)} запись бывает плотной, лучше планировать заранее.</p>
      <p class="pagehead__actions">
        ${bookButton('Открыть форму записи', { master: m.name, cls: 'btn btn--primary btn--lg' })}
        <a class="btn btn--ghost btn--lg" href="${site.viber}" data-goal="viber">Написать в Viber</a>
      </p>
    </div>
  </section>

  ${
    relatedTech.length
      ? `<section class="section section--soft">
    <div class="wrap">
      ${sectionHead({ title: 'Техники окрашивания', text: `Подробно про то, что делает ${esc(m.short)}.` })}
      <div class="grid grid--tech">
        ${relatedTech
          .map(
            (t) => `<a class="tcard" href="${url('services/' + t.slug + '.html', depth)}"><h3 class="tcard__title">${esc(t.title)}</h3><p class="tcard__text">${esc(t.lead)}</p><p class="tcard__meta"><span>от ${t.priceFrom} руб.</span><span>${esc(t.duration)}</span></p><span class="tcard__arrow" aria-hidden="true">${icon('arrow')}</span></a>`
          )
          .join('')}
      </div>
    </div>
  </section>`
      : ''
  }

  <section class="section">
    <div class="wrap">
      ${sectionHead({ title: 'Другие мастера' })}
      <div class="grid grid--masters">
        ${others.map((o) => masterCard(o, depth)).join('')}
      </div>
    </div>
  </section>
</article>

${ctaBand({ depth })}
`;

  return layout({
    title: `${m.name} — ${m.role.toLowerCase()} салона «Пафия», Минск`,
    description: `${m.name}: ${m.role.toLowerCase()}, ${m.experience}. ${m.card} Запись на Притыцкого, 73, метро «Кунцевщина».`,
    path: `masters/${m.slug}.html`,
    depth,
    active: 'masters.html',
    bodyClass: 'page-master',
    crumbs: [
      { name: 'Главная', path: 'index.html' },
      { name: 'Мастера', path: 'masters.html' },
      { name: m.name, path: `masters/${m.slug}.html` },
    ],
    content,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: m.name,
        jobTitle: m.role,
        url: `${site.origin}/masters/${m.slug}.html`,
        image: `${site.origin}/assets/img/master-${m.slug}-portrait.svg`,
        knowsAbout: m.specialties,
        worksFor: { '@id': `${site.origin}/#salon` },
      },
    ],
  });
}
