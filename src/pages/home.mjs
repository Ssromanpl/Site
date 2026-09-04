import { layout, esc, bookingForm } from '../lib/layout.mjs';
import { icon } from '../lib/icons.mjs';
import { site } from '../data/site.mjs';
import { masters } from '../data/masters.mjs';
import { topPrices, priceLabel, priceUpdated } from '../data/prices.mjs';
import { serviceBlocks, works, faq, entrance, aboutParagraphs, aboutFacts } from '../data/content.mjs';
import { techniques } from '../data/techniques.mjs';
import { photo } from '../lib/placeholders.mjs';
import { sectionHead, masterCard, ratingCard, ctaBand, faqList, priceRows, bookButton } from '../lib/components.mjs';

export function homePage() {
  const content = `
<section class="hero">
  <div class="wrap hero__inner">
    <div class="hero__text">
      <p class="eyebrow">Минск, Фрунзенский район · с 2011 года</p>
      <h1 class="hero__title">Стрижка, цвет и маникюр рядом с «Кунцевщиной»</h1>
      <p class="hero__lead">
        Небольшой салон на Притыцкого, 73. Два парикмахерских кресла, маникюрный стол и отдельный кабинет
        депиляции. К нам ходят к своим мастерам — по имени, а не по названию.
      </p>
      <div class="hero__actions">
        ${bookButton('Записаться', { cls: 'btn btn--primary btn--lg' })}
        <a class="btn btn--ghost btn--lg" href="prices.html">Посмотреть цены</a>
      </div>
      <ul class="hero__meta">
        <li>${icon('clock')}<span><strong data-today-hours>Пн–сб 9:00–21:00</strong><br><span data-today-state>вс 10:00–19:00</span></span></li>
        <li>${icon('pin')}<span><strong>Притыцкого, 73, офис 144</strong><br>260 м от метро «Кунцевщина»</span></li>
        <li>${icon('star')}<span><strong>${esc(site.rating.value)} на Google</strong><br>по ${site.rating.count} отзывам</span></li>
      </ul>
    </div>
    <div class="hero__media">
      ${photo({
        name: 'hero-hall',
        label: 'Парикмахерский зал',
        alt: 'Парикмахерский зал салона «Пафия» на Притыцкого, 73',
        w: 900,
        h: 1100,
        priority: true,
        className: 'hero__img',
      })}
      <div class="hero__badge">
        <span class="hero__badge-value">15 лет</span>
        <span class="hero__badge-label">на одном месте, без переездов</span>
      </div>
    </div>
  </div>
</section>

<section class="section section--tight" id="services">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Услуги',
      title: 'Что мы делаем',
      text: 'Полный прайс открыт: цены видно без записи и без звонка.',
      action: '<a class="btn btn--ghost" href="prices.html">Весь прайс</a>',
    })}
    <div class="grid grid--services">
      ${serviceBlocks
        .map(
          (s) => `
      <article class="scard">
        <span class="scard__icon" aria-hidden="true">${icon(s.icon)}</span>
        <h3 class="scard__title"><a href="${s.href}">${esc(s.title)}</a></h3>
        <p class="scard__text">${esc(s.text)}</p>
        <p class="scard__price">${esc(s.priceHint)}</p>
        ${
          s.links
            ? `<ul class="scard__links">${s.links
                .map((l) => `<li><a href="${l.href}">${esc(l.title)}</a></li>`)
                .join('')}</ul>`
            : ''
        }
      </article>`
        )
        .join('')}
    </div>
  </div>
</section>

<section class="section section--masters" id="masters">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Мастера',
      title: 'К кому вы идёте',
      text: 'В отзывах о нас пишут не «хожу в Пафию», а «хожу к Ларисе». Записаться можно сразу к конкретному человеку.',
      action: '<a class="btn btn--ghost" href="masters.html">Все мастера</a>',
    })}
    <div class="grid grid--masters">
      ${masters.map((m) => masterCard(m, 0)).join('')}
    </div>
  </div>
</section>

<section class="section" id="prices">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Цены',
      title: 'Десять позиций, которые спрашивают чаще всего',
      text: `Остальные 100 — на странице «Цены». Прайс обновлён ${esc(priceUpdated)}.`,
      action: '<a class="btn btn--ghost" href="prices.html">Полный прайс</a>',
    })}
    <ul class="pricelist pricelist--top">
      ${priceRows(topPrices)}
    </ul>
    <p class="note note--info">${icon('check')}<span>Цены на окрашивание указаны без учёта стоимости материалов. Точную сумму мастер называет после осмотра волос — до начала работы.</span></p>
  </div>
</section>

<section class="section section--soft" id="works">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Работы',
      title: 'Что получается',
      text: 'Работы наших мастеров. Никаких стоковых моделей — только то, что сделано здесь.',
    })}
    <div class="gallery">
      ${works
        .map(
          (w, i) => `
      <figure class="gallery__item${i === 0 ? ' gallery__item--wide' : ''}">
        ${photo({
          name: `work-${i + 1}`,
          label: w.tag,
          alt: `${w.title} — работа салона «Пафия»`,
          w: i === 0 ? 900 : 600,
          h: i === 0 ? 700 : 700,
          className: 'gallery__img',
        })}
        <figcaption class="gallery__cap">
          <span class="tag">${esc(w.tag)}</span>
          <span>${esc(w.title)}</span>
        </figcaption>
      </figure>`
        )
        .join('')}
    </div>
    <p class="gallery__note">Больше работ — в <a href="${site.instagram.url}" target="_blank" rel="noopener nofollow">Instagram ${esc(site.instagram.label)}</a> и на страницах мастеров.</p>
  </div>
</section>

<section class="section" id="reviews">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'Отзывы', title: 'Рейтинг, который можно проверить' })}
    <div class="reviews">
      ${ratingCard(0)}
      <div class="reviews__aside">
        <h3>Почему у нас нет стены с цитатами</h3>
        <p>
          Тексты отзывов на Google и 2ГИС принадлежат их авторам и площадкам — копировать их к себе на сайт
          нельзя. Поэтому мы показываем живой рейтинг и ссылку, а не подборку выбранных фраз пятилетней давности.
        </p>
        <p>
          Если вы у нас были и готовы, чтобы ваш отзыв появился на сайте с именем — напишите нам в
          <a href="${site.viber}" data-goal="viber">Viber</a>, мы спросим разрешение отдельно.
        </p>
      </div>
    </div>
  </div>
</section>

<section class="section section--about" id="about">
  <div class="wrap about">
    <div class="about__media">
      ${photo({
        name: 'about-interior',
        label: 'Зона ожидания',
        alt: 'Интерьер салона «Пафия»: зона ожидания',
        w: 800,
        h: 900,
        className: 'about__img',
      })}
    </div>
    <div class="about__text">
      ${sectionHead({ eyebrow: 'О салоне', title: 'Пятнадцать лет по одному адресу' })}
      ${aboutParagraphs.map((p) => `<p>${esc(p)}</p>`).join('')}
      <ul class="facts">
        ${aboutFacts
          .map((f) => `<li><span class="facts__value">${esc(f.value)}</span><span class="facts__label">${esc(f.label)}</span></li>`)
          .join('')}
      </ul>
    </div>
  </div>
</section>

<section class="section section--soft" id="entrance">
  <div class="wrap entrance">
    <div class="entrance__text">
      ${sectionHead({ eyebrow: 'Как найти', title: esc(entrance.title), text: esc(entrance.lead) })}
      <ol class="steps">
        ${entrance.steps
          .map(
            ([t, d], i) => `<li class="steps__item"><span class="steps__num">${i + 1}</span><div><h3>${esc(t)}</h3><p>${esc(d)}</p></div></li>`
          )
          .join('')}
      </ol>
      <a class="btn btn--ghost" href="contacts.html">Контакты и карта</a>
    </div>
    <div class="entrance__media">
      ${photo({
        name: 'entrance-facade',
        label: 'Фасад и вход',
        alt: 'Фасад здания на Притыцкого, 73 и вход в салон «Пафия»',
        w: 800,
        h: 600,
        className: 'entrance__img',
      })}
      ${photo({
        name: 'entrance-door',
        label: 'Офис 144',
        alt: 'Дверь салона «Пафия», офис 144',
        w: 800,
        h: 600,
        className: 'entrance__img',
      })}
    </div>
  </div>
</section>

<section class="section" id="techniques">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Окрашивание',
      title: 'Техники — подробно',
      text: 'Что это, кому подходит, сколько занимает и во сколько обойдётся. Без обещаний «блонд за один визит».',
    })}
    <div class="grid grid--tech">
      ${techniques
        .map(
          (t) => `
      <a class="tcard" href="services/${t.slug}.html">
        <h3 class="tcard__title">${esc(t.title)}</h3>
        <p class="tcard__text">${esc(t.lead)}</p>
        <p class="tcard__meta"><span>от ${t.priceFrom} руб.</span><span>${esc(t.duration)}</span></p>
        <span class="tcard__arrow" aria-hidden="true">${icon('arrow')}</span>
      </a>`
        )
        .join('')}
    </div>
  </div>
</section>

<section class="section section--soft" id="faq">
  <div class="wrap wrap--narrow">
    ${sectionHead({ eyebrow: 'Вопросы', title: 'Что спрашивают чаще всего' })}
    ${faqList(faq)}
  </div>
</section>

<section class="section" id="booking">
  <div class="wrap booking">
    <div class="booking__text">
      ${sectionHead({ eyebrow: 'Запись', title: 'Как записаться' })}
      <p>Через форму — выберите услугу, мастера и удобное время. Мы подтвердим запись в течение рабочего дня.</p>
      <p>Или позвоните: <a class="link" href="${site.phonePrimary.href}" data-goal="phone">${site.phonePrimary.label}</a>.
         На этом же номере <a class="link" href="${site.viber}" data-goal="viber">Viber</a> — если звонить неудобно, напишите.</p>
      <ul class="ticks">
        <li>${icon('check')}<span>Запись к конкретному мастеру, а не «в салон»</span></li>
        <li>${icon('check')}<span>Стоимость называем до начала работы</span></li>
        <li>${icon('check')}<span>Если время не подошло — перезвоним и предложим варианты</span></li>
      </ul>
    </div>
    <div class="booking__form card">
      ${bookingForm({ id: 'booking-form-page' })}
    </div>
  </div>
</section>

${ctaBand({ depth: 0 })}
`;

  return layout({
    title: 'Парикмахерская «Пафия» — Притыцкого 73, метро Кунцевщина, Минск',
    description:
      'Стрижки, окрашивание, маникюр и депиляция во Фрунзенском районе Минска. Работаем с 2011 года в 260 метрах от метро «Кунцевщина». Открытый прайс и запись онлайн.',
    path: 'index.html',
    depth: 0,
    active: 'index.html',
    bodyClass: 'page-home',
    content,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'OfferCatalog',
        name: 'Популярные услуги салона «Пафия»',
        url: `${site.origin}/prices.html`,
        itemListElement: topPrices.map((p, i) => ({
          '@type': 'Offer',
          position: i + 1,
          name: p.name,
          price: p.price,
          priceCurrency: 'BYN',
          description: priceLabel(p),
          availability: 'https://schema.org/InStock',
        })),
      },
    ],
  });
}
