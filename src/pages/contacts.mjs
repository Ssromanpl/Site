import { layout, esc } from '../lib/layout.mjs';
import { icon } from '../lib/icons.mjs';
import { site } from '../data/site.mjs';
import { entrance } from '../data/content.mjs';
import { photo } from '../lib/placeholders.mjs';
import { crumbs, ctaBand, bookButton, sectionHead } from '../lib/components.mjs';

export function contactsPage() {
  const mapQuery = encodeURIComponent('Минск, улица Притыцкого, 73');
  const yandexLink = `https://yandex.by/maps/?ll=${site.geo.lon}%2C${site.geo.lat}&z=17&text=${mapQuery}`;
  const mapEmbed = `https://yandex.by/map-widget/v1/?ll=${site.geo.lon}%2C${site.geo.lat}&z=17&pt=${site.geo.lon},${site.geo.lat},pm2rdm&text=${mapQuery}`;

  const content = `
${crumbs([{ name: 'Главная', path: 'index.html' }, { name: 'Контакты' }], 0)}

<section class="pagehead">
  <div class="wrap">
    <h1 class="pagehead__title">Контакты</h1>
    <p class="pagehead__lead">
      Минск, ул. Притыцкого, 73, офис 144. 260 метров от метро «Кунцевщина» — примерно четыре минуты пешком.
    </p>
    <div class="pagehead__actions">
      ${bookButton('Записаться', { cls: 'btn btn--primary' })}
      <a class="btn btn--ghost" href="${site.phonePrimary.href}" data-goal="phone">${icon('phone')} ${site.phonePrimary.label}</a>
      <a class="btn btn--ghost" href="${site.viber}" data-goal="viber">${icon('chat')} Viber</a>
    </div>
  </div>
</section>

<div class="wrap section section--tight">
  <div class="contacts">
    <div class="contacts__col card card--tight">
      <h2 class="h4">${icon('pin')} Адрес</h2>
      <p class="contacts__big">${esc(site.address.city)},<br>${esc(site.address.street)}</p>
      <p class="contacts__muted">${esc(site.address.postalCode)}, ${esc(site.address.district)} район<br>метро «${esc(site.metro.name)}», ${esc(site.metro.distance)}</p>
      <a class="link link--arrow" href="${yandexLink}" target="_blank" rel="noopener">Открыть в Яндекс.Картах ${icon('arrow')}</a>
    </div>

    <div class="contacts__col card card--tight">
      <h2 class="h4">${icon('clock')} Часы работы</h2>
      <ul class="hourslist">
        ${site.hours.map((h) => `<li><span>${esc(h.days)}</span><strong>${esc(h.time)}</strong></li>`).join('')}
      </ul>
      <p class="contacts__muted">Работаем без выходных.<br><span data-today-hours></span> <span data-today-state class="tag tag--soft"></span></p>
    </div>

    <div class="contacts__col card card--tight">
      <h2 class="h4">${icon('phone')} Телефоны</h2>
      <p class="contacts__big"><a href="${site.phonePrimary.href}" data-goal="phone">${site.phonePrimary.label}</a></p>
      <p class="contacts__muted">Основной номер, на нём же Viber. Если звонить неудобно — напишите, отвечаем в течение рабочего дня.</p>
      <ul class="contacts__list">
        ${site.phonesSecondary.map((p) => `<li><a href="${p.href}" data-goal="phone">${p.label}</a></li>`).join('')}
        <li><a href="${site.email.href}">${site.email.label}</a></li>
        <li><a href="${site.instagram.url}" target="_blank" rel="noopener nofollow">${site.instagram.label}</a></li>
      </ul>
    </div>
  </div>
</div>

<section class="section section--soft" id="entrance">
  <div class="wrap entrance">
    <div class="entrance__text">
      ${sectionHead({ eyebrow: 'Как найти', title: esc(entrance.title), text: esc(entrance.lead) })}
      <ol class="steps">
        ${entrance.steps
          .map(
            ([t, d], i) =>
              `<li class="steps__item"><span class="steps__num">${i + 1}</span><div><h3>${esc(t)}</h3><p>${esc(d)}</p></div></li>`
          )
          .join('')}
      </ol>
      <p class="note note--info">${icon('check')}<span>Если запутались — позвоните от входа, администратор объяснит, куда идти.</span></p>
    </div>
    <div class="entrance__media">
      ${photo({
        name: 'entrance-facade-2',
        label: 'Фасад дома 73',
        alt: 'Здание на улице Притыцкого, 73 в Минске',
        w: 800,
        h: 600,
        className: 'entrance__img',
      })}
      ${photo({
        name: 'entrance-sign',
        label: 'Вывеска «Пафия»',
        alt: 'Вывеска салона-парикмахерской «Пафия»',
        w: 800,
        h: 600,
        className: 'entrance__img',
      })}
      ${photo({
        name: 'entrance-door-2',
        label: 'Офис 144',
        alt: 'Вход в салон «Пафия», офис 144',
        w: 800,
        h: 600,
        className: 'entrance__img',
      })}
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    ${sectionHead({ title: 'На карте' })}
    <div class="map" data-map data-map-src="${mapEmbed}">
      <div class="map__cover">
        <p class="map__text">
          Карта загружается с серверов Яндекса — вместе с ней подгружаются их файлы cookie.
          Нажмите, чтобы показать карту.
        </p>
        <button class="btn btn--primary" type="button" data-map-load>Показать карту</button>
        <a class="link" href="${yandexLink}" target="_blank" rel="noopener">Или открыть в приложении</a>
      </div>
    </div>
    <p class="contacts__muted">Координаты: ${site.geo.lat}, ${site.geo.lon}</p>
  </div>
</section>

${ctaBand({ depth: 0, title: 'Записаться', text: 'Мы работаем без выходных: пн–сб с 9:00 до 21:00, в воскресенье с 10:00 до 19:00.' })}
`;

  return layout({
    title: 'Контакты салона «Пафия» — Притыцкого 73, Минск',
    description:
      'Как нас найти: 260 метров от метро «Кунцевщина», Притыцкого, 73, офис 144. Телефоны, график работы, карта и подсказка, где вход.',
    path: 'contacts.html',
    depth: 0,
    active: 'contacts.html',
    bodyClass: 'page-contacts',
    crumbs: [
      { name: 'Главная', path: 'index.html' },
      { name: 'Контакты', path: 'contacts.html' },
    ],
    content,
  });
}
