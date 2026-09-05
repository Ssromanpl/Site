import { site, nav } from '../data/site.mjs';
import { icon } from './icons.mjs';
import { priceCategories } from '../data/prices.mjs';
import { masters } from '../data/masters.mjs';
import { techniques } from '../data/techniques.mjs';

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Относительный путь: страницы в подпапках получают «../». */
export const url = (path, depth = 0) => (depth ? '../'.repeat(depth) + path : path);

const serviceOptions = () =>
  priceCategories
    .map(
      (c) =>
        `<optgroup label="${esc(c.title)}">` +
        c.groups
          .flatMap((g) => g.items)
          .map((i) => `<option value="${esc(i.name)}">${esc(i.name)}</option>`)
          .join('') +
        '</optgroup>'
    )
    .join('');

const masterOptions = () =>
  masters.map((m) => `<option value="${esc(m.name)}">${esc(m.name)} — ${esc(m.role.toLowerCase())}</option>`).join('');

/** Форма записи. Используется и в модалке, и на отдельной странице /booking. */
export function bookingForm({ id = 'booking-form', compact = false, depth = 0 } = {}) {
  return `
<form class="form${compact ? ' form--compact' : ''}" id="${id}" novalidate>
  <div class="form__row">
    <label class="field">
      <span class="field__label">Как вас зовут</span>
      <input class="field__input" type="text" name="name" autocomplete="name" required placeholder="Имя">
      <span class="field__error" data-error-for="name"></span>
    </label>
    <label class="field">
      <span class="field__label">Телефон</span>
      <input class="field__input" type="tel" name="phone" autocomplete="tel" required inputmode="tel"
             placeholder="+375 29 000-00-00" data-phone>
      <span class="field__error" data-error-for="phone"></span>
    </label>
  </div>
  <div class="form__row">
    <label class="field">
      <span class="field__label">Услуга</span>
      <select class="field__input" name="service" data-service-select>
        <option value="">Ещё не решили — подскажем</option>
        ${serviceOptions()}
      </select>
    </label>
    <label class="field">
      <span class="field__label">Мастер</span>
      <select class="field__input" name="master" data-master-select>
        <option value="">Любой свободный</option>
        ${masterOptions()}
      </select>
    </label>
  </div>
  <div class="form__row">
    <label class="field">
      <span class="field__label">Удобный день</span>
      <input class="field__input" type="date" name="date" data-date>
    </label>
    <label class="field">
      <span class="field__label">Удобное время</span>
      <select class="field__input" name="time">
        <option value="">Не принципиально</option>
        <option>Утро, 9:00–12:00</option>
        <option>День, 12:00–16:00</option>
        <option>Вечер, 16:00–21:00</option>
      </select>
    </label>
  </div>
  <label class="field">
    <span class="field__label">Комментарий <span class="field__opt">— необязательно</span></span>
    <textarea class="field__input" name="comment" rows="2" placeholder="Например: хочу балаяж, волосы ниже лопаток, крашусь впервые"></textarea>
  </label>
  <label class="check">
    <input type="checkbox" name="consent" value="yes" required>
    <span>Согласен(на) на обработку персональных данных в соответствии с <a href="${url('privacy.html', depth)}">политикой обработки персональных данных</a></span>
  </label>
  <span class="field__error" data-error-for="consent"></span>
  <button class="btn btn--primary btn--block" type="submit">Записаться</button>
  <p class="form__note">Мы подтвердим запись в течение рабочего дня. Или позвоните: <a href="${site.phonePrimary.href}">${site.phonePrimary.label}</a> — на этом же номере Viber.</p>
  <div class="form__done" role="status" hidden>
    <strong>Записались.</strong> Перезвоним, чтобы подтвердить время.
  </div>
</form>`;
}

function header(depth, active) {
  const u = (p) => url(p, depth);
  const links = nav
    .map((n) => {
      const isActive = active && n.href === active;
      return `<a class="topbar__link${isActive ? ' is-active' : ''}" href="${u(n.href)}">${esc(n.title)}</a>`;
    })
    .join('');
  return `
<header class="topbar" id="top">
  <div class="wrap topbar__inner">
    <a class="logo" href="${u('index.html')}">
      <span class="logo__mark" aria-hidden="true">П</span>
      <span class="logo__text">
        <span class="logo__name">Пафия</span>
        <span class="logo__sub">салон-парикмахерская · Притыцкого, 73</span>
      </span>
    </a>
    <nav class="topbar__nav" aria-label="Основное меню">${links}</nav>
    <div class="topbar__actions">
      <a class="topbar__phone" href="${site.phonePrimary.href}" data-goal="phone">
        ${icon('phone')}<span>${site.phonePrimary.label}</span>
      </a>
      <button class="btn btn--primary btn--sm" type="button" data-book>Записаться</button>
      <button class="burger" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Меню">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
  <div class="mobile-menu" id="mobile-menu" hidden>
    <div class="wrap">
      <nav class="mobile-menu__nav" aria-label="Меню">
        ${nav.map((n) => `<a href="${u(n.href)}">${esc(n.title)}</a>`).join('')}
        <a href="${u('booking.html')}">Онлайн-запись</a>
      </nav>
      <div class="mobile-menu__meta">
        <p>${esc(site.hoursShort)}</p>
        <a class="link" href="${site.phonePrimary.href}">${site.phonePrimary.label}</a>
      </div>
    </div>
  </div>
</header>`;
}

function footer(depth) {
  const u = (p) => url(p, depth);
  const l = site.legal;
  return `
<footer class="footer">
  <div class="wrap">
    <div class="footer__grid">
      <div class="footer__col footer__col--brand">
        <a class="logo logo--footer" href="${u('index.html')}">
          <span class="logo__mark" aria-hidden="true">П</span>
          <span class="logo__text"><span class="logo__name">Пафия</span></span>
        </a>
        <p class="footer__addr">${esc(site.address.city)}, ${esc(site.address.street)}<br>метро «${esc(site.metro.name)}», ${esc(site.metro.distance)}</p>
        <p class="footer__hours">${esc(site.hours[0].days)}: ${esc(site.hours[0].time)}<br>${esc(site.hours[1].days)}: ${esc(site.hours[1].time)}</p>
        <p class="footer__social">
          <a href="${site.instagram.url}" rel="noopener nofollow" target="_blank">${icon('instagram')}<span>${site.instagram.label}</span></a>
        </p>
      </div>

      <div class="footer__col">
        <h2 class="footer__title">Услуги</h2>
        <ul class="footer__list">
          <li><a href="${u('prices.html#hair')}">Стрижки и укладки</a></li>
          <li><a href="${u('prices.html#color')}">Окрашивание</a></li>
          <li><a href="${u('prices.html#nails')}">Маникюр и педикюр</a></li>
          <li><a href="${u('prices.html#depil')}">Депиляция</a></li>
          <li><a href="${u('prices.html#brows')}">Брови и визаж</a></li>
        </ul>
      </div>

      <div class="footer__col">
        <h2 class="footer__title">Окрашивание</h2>
        <ul class="footer__list">
          ${techniques.map((t) => `<li><a href="${u('services/' + t.slug + '.html')}">${esc(t.title)}</a></li>`).join('')}
        </ul>
      </div>

      <div class="footer__col">
        <h2 class="footer__title">Мастера</h2>
        <ul class="footer__list">
          ${masters.map((m) => `<li><a href="${u('masters/' + m.slug + '.html')}">${esc(m.name)}</a></li>`).join('')}
        </ul>
      </div>

      <div class="footer__col">
        <h2 class="footer__title">Связаться</h2>
        <ul class="footer__list footer__list--contacts">
          <li><a href="${site.phonePrimary.href}" data-goal="phone">${site.phonePrimary.label}</a> <span class="tag tag--soft">основной, Viber</span></li>
          ${site.phonesSecondary.map((p) => `<li><a href="${p.href}" data-goal="phone">${p.label}</a></li>`).join('')}
          <li><a href="${site.email.href}">${site.email.label}</a></li>
          <li><a href="${u('contacts.html')}">Как найти вход</a></li>
        </ul>
      </div>
    </div>

    <div class="footer__legal">
      <p class="footer__entity">
        <strong>${esc(l.entity)}</strong>, УНП ${esc(l.unp)}.
        Зарегистрировано ${esc(l.registrar)} ${esc(l.registeredAt)}.
        Юридический адрес: ${esc(l.legalAddress)}.
        Режим работы: ${esc(site.hoursShort)}.
      </p>
      <p class="footer__entity footer__entity--muted">
        Свидетельство о внесении в Государственный информационный ресурс ${esc(l.gir)}.
        Торговый реестр Республики Беларусь ${esc(l.tradeRegister)}.
        ОКЭД ${esc(l.okved)}.
      </p>
      <p class="footer__entity footer__entity--muted">
        Информация на сайте не является публичной офертой. Окончательную стоимость услуги
        мастер называет после осмотра — до начала работы.
      </p>
      <div class="footer__bottom">
        <span>© ${new Date().getFullYear()} ${esc(l.entity)}</span>
        <nav class="footer__policies" aria-label="Правовые документы">
          <a href="${u('privacy.html')}">Обработка персональных данных</a>
          <a href="${u('cookies.html')}">Файлы cookie</a>
          <a href="${u('sitemap.xml')}">Карта сайта</a>
        </nav>
      </div>
    </div>
  </div>
</footer>

<div class="actionbar" aria-label="Быстрые действия">
  <a class="actionbar__btn" href="${site.phonePrimary.href}" data-goal="phone">${icon('phone')}<span>Позвонить</span></a>
  <a class="actionbar__btn" href="${site.viber}" data-goal="viber">${icon('chat')}<span>Viber</span></a>
  <button class="actionbar__btn actionbar__btn--primary" type="button" data-book>${icon('calendar')}<span>Записаться</span></button>
</div>

<dialog class="modal" id="booking-modal" aria-labelledby="booking-modal-title">
  <div class="modal__inner">
    <button class="modal__close" type="button" data-close-modal aria-label="Закрыть">&times;</button>
    <h2 class="modal__title" id="booking-modal-title">Запись в «Пафию»</h2>
    <p class="modal__lead">Выберите услугу, мастера и удобное время. Мы подтвердим запись в течение рабочего дня.</p>
    ${bookingForm({ id: 'booking-form-modal', compact: true, depth })}
  </div>
</dialog>

<div class="cookiebar" id="cookiebar" hidden>
  <div class="wrap cookiebar__inner">
    <p>Мы используем файлы cookie и Яндекс.Метрику, чтобы понимать, как посетители пользуются сайтом.
      Подробности — в <a href="${u('cookies.html')}">политике использования cookie</a>.</p>
    <div class="cookiebar__actions">
      <button class="btn btn--ghost btn--sm" type="button" data-cookie="decline">Только необходимые</button>
      <button class="btn btn--primary btn--sm" type="button" data-cookie="accept">Принять</button>
    </div>
  </div>
</div>`;
}

function jsonLdOrganization() {
  const l = site.legal;
  return {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    '@id': `${site.origin}/#salon`,
    name: site.name,
    alternateName: 'Пафия',
    legalName: l.entity,
    taxID: l.unp,
    url: `${site.origin}/`,
    image: `${site.origin}/assets/img/og.png`,
    logo: `${site.origin}/assets/img/logo.svg`,
    description:
      'Салон-парикмахерская во Фрунзенском районе Минска: стрижки, окрашивание, маникюр, педикюр, депиляция и визаж. Работаем с 2011 года у метро «Кунцевщина».',
    foundingDate: '2011-03-17',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lon },
    telephone: site.phonePrimary.raw,
    email: site.email.label,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '21:00',
      },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '10:00', closes: '19:00' },
    ],
    priceRange: '$$',
    currenciesAccepted: 'BYN',
    paymentAccepted: 'Наличные, банковские карты',
    publicAccess: true,
    sameAs: [site.instagram.url],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: site.rating.count,
      bestRating: '5',
    },
    areaServed: [
      { '@type': 'Place', name: 'Кунцевщина, Минск' },
      { '@type': 'Place', name: 'Каменная Горка, Минск' },
      { '@type': 'Place', name: 'Фрунзенский район, Минск' },
    ],
  };
}

function breadcrumbs(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${site.origin}/${it.path}`.replace(/\/index\.html$/, '/'),
    })),
  };
}

/**
 * Режим черновика: DEMO=1 npm run build.
 * Добавляет заметную плашку и закрывает страницы от поисковиков — чтобы
 * выложенный на показ макет с придуманными ценами не нашли по запросу
 * «Пафия Притыцкого» и не приняли за настоящий сайт салона.
 */
const DEMO = process.env.DEMO === '1';

const demoBar = DEMO
  ? `<div class="demobar">
  <div class="wrap demobar__inner">
    <strong>Демо-версия сайта.</strong>
    Цены, тексты и фотографии предварительные — их ещё предстоит заменить на настоящие.
  </div>
</div>`
  : '';

export function layout({
  title,
  description,
  path,
  depth = 0,
  active = '',
  bodyClass = '',
  crumbs = null,
  jsonLd = [],
  content,
}) {
  const u = (p) => url(p, depth);
  const canonical = `${site.origin}/${path}`.replace(/\/index\.html$/, '/');
  const schemas = [jsonLdOrganization(), ...(crumbs ? [breadcrumbs(crumbs)] : []), ...jsonLd];

  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#fbf8f4">
${DEMO ? '<meta name="robots" content="noindex, nofollow">' : ''}
<meta name="format-detection" content="telephone=no">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Салон-парикмахерская «Пафия»">
<meta property="og:locale" content="ru_RU">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${site.origin}/assets/img/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${u('assets/img/favicon.svg')}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${u('assets/img/apple-touch-icon.png')}">
<link rel="manifest" href="${u('site.webmanifest')}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="${u('assets/css/style.css')}">
${schemas.map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n')}
</head>
<body class="${bodyClass}">
<a class="skip" href="#main">Перейти к содержанию</a>
${demoBar}
${header(depth, active)}
<main id="main">
${content}
</main>
${footer(depth)}
<script src="${u('assets/js/main.js')}" defer></script>
</body>
</html>
`;
}
