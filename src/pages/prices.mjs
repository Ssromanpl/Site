import { layout, esc } from '../lib/layout.mjs';
import { icon } from '../lib/icons.mjs';
import { site } from '../data/site.mjs';
import { priceCategories, priceUpdated, priceLabel } from '../data/prices.mjs';
import { crumbs, priceRows, ctaBand, bookButton } from '../lib/components.mjs';

export function pricesPage() {
  const anchors = priceCategories
    .map((c) => `<a class="anchors__link" href="#${c.id}">${esc(c.title)}</a>`)
    .join('');

  const sections = priceCategories
    .map(
      (c) => `
<section class="pricesec" id="${c.id}">
  <h2 class="pricesec__title">${esc(c.title)}</h2>
  ${c.lead ? `<p class="pricesec__lead">${esc(c.lead)}</p>` : ''}
  ${c.groups
    .map(
      (g) => `
  <div class="pricegroup">
    <h3 class="pricegroup__title">${esc(g.title)}</h3>
    ${g.note ? `<p class="note note--info">${icon('check')}<span>${esc(g.note)}</span></p>` : ''}
    <ul class="pricelist">${priceRows(g.items)}</ul>
  </div>`
    )
    .join('')}
</section>`
    )
    .join('');

  const content = `
${crumbs([{ name: 'Главная', path: 'index.html' }, { name: 'Цены' }], 0)}

<section class="pagehead">
  <div class="wrap">
    <h1 class="pagehead__title">Цены</h1>
    <p class="pagehead__lead">
      Весь прайс открыт: чтобы увидеть цену, не нужно оставлять телефон и заполнять форму.
      Обновлён ${esc(priceUpdated)}.
    </p>
    <div class="pagehead__actions">
      ${bookButton('Записаться', { cls: 'btn btn--primary' })}
      <a class="btn btn--ghost" href="${site.phonePrimary.href}" data-goal="phone">${icon('phone')} ${site.phonePrimary.label}</a>
    </div>
  </div>
</section>

<div class="wrap">
  <nav class="anchors" aria-label="Разделы прайса">${anchors}</nav>

  <div class="prices-notes">
    <p class="note note--warn">${icon('shield')}<span><strong>Окрашивание, мелирование и колорирование</strong> — цены без учёта стоимости материалов. Расход краски зависит от длины и густоты волос, поэтому сумму мастер называет после осмотра, до начала работы.</span></p>
    <p class="note note--warn">${icon('shield')}<span><strong>Детский тариф действует до 13 лет.</strong> С 13 лет стрижка считается взрослой. Скажите возраст ребёнка при записи — назовём точную цену сразу, а не на кассе.</span></p>
  </div>

  <div class="prices">${sections}</div>

  <div class="prices-foot card">
    <h2>Не нашли свою услугу?</h2>
    <p>
      Позвоните — мы делаем и то, чего нет в списке: плетение, дреды, восстановление после неудачного
      окрашивания, макияж на выпускной. Подскажем, сколько это займёт и во сколько обойдётся.
    </p>
    <p class="prices-foot__actions">
      <a class="btn btn--primary" href="${site.phonePrimary.href}" data-goal="phone">${icon('phone')} ${site.phonePrimary.label}</a>
      <a class="btn btn--ghost" href="${site.viber}" data-goal="viber">Написать в Viber</a>
    </p>
  </div>
</div>

${ctaBand({ depth: 0, title: 'Записаться по этой цене' })}
`;

  const offers = priceCategories.flatMap((c) =>
    c.groups.flatMap((g) =>
      g.items.map((i) => ({
        '@type': 'Offer',
        name: i.name,
        price: i.price,
        priceCurrency: 'BYN',
        description: priceLabel(i),
        category: c.title,
        availability: 'https://schema.org/InStock',
      }))
    )
  );

  return layout({
    title: 'Цены на стрижки, окрашивание и маникюр — салон «Пафия», Минск',
    description:
      'Полный прайс салона на Притыцкого, 73. Женская стрижка от 45 руб., мужская от 40 руб., аппаратный маникюр 30 руб., шугаринг от 10 руб. Без скрытых доплат.',
    path: 'prices.html',
    depth: 0,
    active: 'prices.html',
    bodyClass: 'page-prices',
    crumbs: [
      { name: 'Главная', path: 'index.html' },
      { name: 'Цены', path: 'prices.html' },
    ],
    content,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'OfferCatalog',
        name: 'Прайс-лист салона-парикмахерской «Пафия»',
        url: `${site.origin}/prices.html`,
        numberOfItems: offers.length,
        itemListElement: offers,
      },
    ],
  });
}
