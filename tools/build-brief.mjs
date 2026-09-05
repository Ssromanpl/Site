#!/usr/bin/env node
/**
 * Собирает документ «Тексты сайта для проверки» — весь текст будущего сайта
 * в одном файле, с пометками, что придумано, и графами для правок владельца.
 *
 * Запуск: node tools/build-brief.mjs
 * На выходе dist/pafia-teksty-dlya-klienta.html — открыть в браузере
 * и «Печать → Сохранить как PDF». Внешних библиотек не требует.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { site } from '../src/data/site.mjs';
import { priceCategories, priceUpdated, priceLabel } from '../src/data/prices.mjs';
import { masters } from '../src/data/masters.mjs';
import { techniques } from '../src/data/techniques.mjs';
import { faq, entrance, aboutParagraphs, serviceBlocks } from '../src/data/content.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Цены, которые удалось найти в открытых источниках, — их надо подтвердить, а не выдумывать заново. */
const FROM_SOURCES = new Set([
  'Модельная стрижка, короткие волосы',
  'Модельная короткая стрижка',
  'Аппаратный маникюр',
  'Подравнивание кончиков, до 13 лет',
  'Молекулярное восстановление «Ki-Power»',
  'Коррекция, окрашивание и моделирование формы',
]);

const mark = (kind) =>
  kind === 'demo'
    ? '<span class="tag tag--demo">● придумано</span>'
    : '<span class="tag tag--src">◆ из справочников</span>';

const fill = (hint = '') => `<td class="fill">${hint ? `<span class="hint">${esc(hint)}</span>` : ''}</td>`;

/* --- 1. Контакты ---------------------------------------------------------- */
const contactRows = [
  ['Название', site.name, false],
  ['Адрес', `${site.address.city}, ${site.address.street}`, false],
  ['Индекс, район', `${site.address.postalCode}, ${site.address.district}`, false],
  ['Метро', `«${site.metro.name}», ${site.metro.distance}`, false],
  ['Телефон основной', site.phonePrimary.label, false],
  ...site.phonesSecondary.map((p, i) => [`Телефон ${i + 2}-й`, p.label, false]),
  ['Viber', 'на номере ' + site.phonePrimary.label, false],
  ['Telegram', site.telegram, true],
  ['Instagram', site.instagram.label, false],
  ['Электронная почта', site.email.label, true],
  ['Адрес сайта в интернете', site.origin.replace('https://', ''), true],
];

const legalRows = [
  ['Юридическое лицо', site.legal.entity],
  ['УНП', site.legal.unp],
  ['Кем зарегистрировано', site.legal.registrar],
  ['Дата регистрации', site.legal.registeredAt],
  ['Юридический адрес', site.legal.legalAddress],
  ['Свидетельство ГИР', site.legal.gir],
  ['Торговый реестр', site.legal.tradeRegister],
  ['ОКЭД', site.legal.okved],
];

/* --- Сборка --------------------------------------------------------------- */
const priceCount = priceCategories.reduce((n, c) => n + c.groups.reduce((k, g) => k + g.items.length, 0), 0);

const html = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<title>Тексты сайта «Пафия» — для проверки</title>
<style>
@page { size: A4; margin: 16mm 14mm 18mm; }
* { box-sizing: border-box; }
body {
  margin: 0; background: #fff; color: #1a1a1a;
  font: 10.5pt/1.45 "DejaVu Sans", "Liberation Sans", -apple-system, "Segoe UI", Arial, sans-serif;
}
h1 { font-size: 20pt; margin: 0 0 6pt; letter-spacing: -.02em; }
h2 {
  font-size: 14pt; margin: 22pt 0 8pt; padding-bottom: 4pt;
  border-bottom: 1.5pt solid #a65b3e; color: #8a4931;
  break-after: avoid; page-break-after: avoid;
}
h3 { font-size: 11.5pt; margin: 14pt 0 5pt; break-after: avoid; page-break-after: avoid; }
h4 { font-size: 10.5pt; margin: 10pt 0 4pt; color: #55504a; break-after: avoid; page-break-after: avoid; }
p { margin: 0 0 6pt; }
ul, ol { margin: 0 0 8pt; padding-left: 16pt; }
li { margin-bottom: 3pt; }

.cover { padding-top: 30mm; text-align: center; break-after: page; page-break-after: always; }
.cover__mark { width: 54pt; height: 54pt; margin: 0 auto 14pt; border-radius: 50%; background: #a65b3e; color: #fff;
  font-size: 26pt; font-weight: bold; line-height: 54pt; }
.cover h1 { font-size: 26pt; }
.cover__sub { font-size: 12pt; color: #55504a; margin-bottom: 24pt; }
.cover__box { text-align: left; max-width: 135mm; margin: 0 auto; padding: 12pt 14pt;
  border: 1pt solid #e0d6c9; border-radius: 6pt; background: #fbf8f4; }
.cover__box h3 { margin-top: 0; }

table { width: 100%; border-collapse: collapse; margin-bottom: 10pt; font-size: 9.5pt; }
th, td { border: .6pt solid #d8ccbd; padding: 4pt 6pt; text-align: left; vertical-align: top; }
th { background: #f4ede4; font-weight: bold; }
thead { display: table-header-group; }
tr { break-inside: avoid; page-break-inside: avoid; }
td.num { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
td.fill { background: #fcfaf7; min-width: 32mm; }
.hint { color: #a99e90; font-size: 8pt; }

.tag { display: inline-block; padding: 0 4pt; border-radius: 3pt; font-size: 7.5pt; white-space: nowrap; }
.tag--demo { background: #f6e3dc; color: #8a4931; border: .5pt solid #e3c3b6; }
.tag--src { background: #e6ede6; color: #3f5b49; border: .5pt solid #c3d4c8; }

.lead { padding: 8pt 10pt; background: #fbf8f4; border-left: 2.5pt solid #a65b3e; margin-bottom: 12pt; }
.warn { padding: 8pt 10pt; background: #fdf4f0; border: .8pt solid #e8cec2; border-radius: 4pt; margin-bottom: 10pt; }
.q { padding: 6pt 0 6pt 0; border-bottom: .5pt dotted #d8ccbd; }
.q b { display: block; margin-bottom: 2pt; }
.blank { border-bottom: .6pt solid #cfc4b6; display: block; height: 13pt; margin-top: 4pt; }
.blank + .blank { margin-top: 7pt; }
.sec { break-before: page; page-break-before: always; }
.note { font-size: 9pt; color: #55504a; }
.legend { display: flex; gap: 14pt; font-size: 9pt; margin-bottom: 10pt; }
</style>
</head>
<body>

<section class="cover">
  <div class="cover__mark">П</div>
  <h1>Сайт салона «Пафия»</h1>
  <p class="cover__sub">Все тексты будущего сайта — для проверки и уточнения</p>
  <div class="cover__box">
    <h3>Что это за документ</h3>
    <p>Здесь собран весь текст, который сейчас стоит на макете сайта: контакты, ${priceCount} позиций
       с ценами, описания мастеров и все страницы целиком.</p>
    <p><b>Часть данных мы придумали</b> — чтобы показать, как сайт будет выглядеть.
       Такие места помечены <span class="tag tag--demo">● придумано</span> и обязательно
       требуют вашего ответа. Пометка <span class="tag tag--src">◆ из справочников</span> означает,
       что данные взяты из 2ГИС, Google или Slivki — их достаточно подтвердить или поправить.</p>
    <h3>Что нужно сделать</h3>
    <p>Пройдите по документу и в пустых графах справа впишите верные значения.
       Где всё верно — поставьте галочку. Можно распечатать и заполнить ручкой,
       можно написать ответы прямо в сообщении.</p>
    <p class="note">Без первых четырёх разделов сайт запускать нельзя: без цен, графика,
       списка мастеров и фотографий он не выполняет свою работу.</p>
  </div>
</section>

<h2>1. Контакты</h2>
<div class="legend">
  <span><span class="tag tag--demo">● придумано</span> — нужен ваш ответ</span>
  <span><span class="tag tag--src">◆ из справочников</span> — подтвердите или поправьте</span>
</div>
<table>
  <thead><tr><th style="width:34%">Что</th><th style="width:34%">Сейчас на сайте</th><th>Как правильно</th></tr></thead>
  <tbody>
    ${contactRows
      .map(([k, v, demo]) => `<tr><td>${esc(k)}${demo ? ' ' + mark('demo') : ''}</td><td>${esc(v)}</td>${fill()}</tr>`)
      .join('\n    ')}
  </tbody>
</table>
<div class="warn">
  <b>Четыре телефона — это много.</b> На сайте крупно показан один, остальные спрятаны в самом низу.
  Основным сейчас стоит ${esc(site.phonePrimary.label)}. Если удобнее другой — напишите какой.
</div>

<h3>Как найти вход <span class="tag tag--demo">● придумано целиком</span></h3>
<div class="warn">
  В здании на Притыцкого, 73 работают ещё барбершоп TOPGUN и салон Lady Lab, поэтому на сайте
  есть отдельный блок «Вход в салон». <b>Всё, что там написано, мы придумали</b> — проверьте
  каждый пункт, это важно: человек, который не найдёт дверь, просто уйдёт к соседям.
</div>
<table>
  <thead><tr><th style="width:22%">Шаг</th><th style="width:44%">Сейчас на сайте</th><th>Как на самом деле</th></tr></thead>
  <tbody>
    ${entrance.steps.map(([t, d]) => `<tr><td>${esc(t)}</td><td>${esc(d)}</td>${fill()}</tr>`).join('\n    ')}
  </tbody>
</table>
<p class="note">Отдельно нужен ответ: есть ли вывеска с улицы, на каком этаже офис 144,
   и есть ли у здания парковка для клиентов.</p>

<h3>Реквизиты для подвала сайта</h3>
<p class="note">По закону на сайте организации должны быть название, УНП и кто зарегистрировал.
   Данные взяты из ЕГР — проверьте, всё ли верно.</p>
<table>
  <thead><tr><th style="width:34%">Что</th><th style="width:40%">Сейчас на сайте</th><th>Поправка</th></tr></thead>
  <tbody>
    ${legalRows.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td>${fill()}</tr>`).join('\n    ')}
  </tbody>
</table>
<div class="warn">
  <b>Важно.</b> В Relax.by, 103.by и Slivki.by вы до сих пор значитесь как «ЧУП Пафия».
  По ЕГР компания преобразована в ООО ещё 20.10.2016. На сайте мы пишем ООО — заодно стоит
  подать заявки на исправление в справочники, иначе данные расходятся.
</div>

<h2>2. График работы</h2>
<div class="warn">
  <b>В справочниках расходится.</b> Google показывает воскресенье с 9:00, Slivki — что вы работаете
  9:00–21:00 все семь дней. Ошибка в часах — это человек, приехавший к закрытой двери.
</div>
<table>
  <thead><tr><th style="width:34%">День</th><th style="width:34%">Сейчас на сайте</th><th>Как правильно</th></tr></thead>
  <tbody>
    ${site.hours.map((h) => `<tr><td>${esc(h.days)}</td><td>${esc(h.time)}</td>${fill()}</tr>`).join('\n    ')}
    <tr><td>Выходные, санитарные дни</td><td>нет</td>${fill()}</tr>
    <tr><td>Обед</td><td>нет</td>${fill()}</tr>
  </tbody>
</table>

<h2 class="sec">3. Цены</h2>
<div class="lead">
  <b>Это главный раздел.</b> Сейчас на сайте ${priceCount} позиций, и почти все цены мы придумали —
  реального прайса нет ни в одном справочнике, там у вас везде «цена по запросу».
  Именно из-за этого человек, который ищет «стрижка Кунцевщина цена», до вас не доходит.
</div>
<div class="legend">
  <span><span class="tag tag--src">◆ из справочников</span> — цену нашли, подтвердите</span>
  <span><span class="tag tag--demo">● без значка</span> — придумано, впишите своё</span>
</div>
<p class="note">Обновлено на макете: ${esc(priceUpdated)}. Если услуги нет в списке — допишите внизу раздела.
   Если услугу не оказываете — зачеркните строку.</p>

${priceCategories
  .map(
    (c) => `
<h3>${esc(c.title)}</h3>
${c.lead ? `<p class="note">${esc(c.lead)}</p>` : ''}
${c.groups
  .map(
    (g) => `
<h4>${esc(g.title)}</h4>
<table>
  <thead><tr><th style="width:52%">Услуга</th><th style="width:16%">На сайте</th><th>Ваша цена</th></tr></thead>
  <tbody>
    ${g.items
      .map(
        (i) =>
          `<tr><td>${esc(i.name)}${FROM_SOURCES.has(i.name) ? ' ' + mark('src') : ''}${
            i.note ? `<br><span class="hint">${esc(i.note)}</span>` : ''
          }</td><td class="num">${esc(priceLabel(i))}</td>${fill()}</tr>`
      )
      .join('\n    ')}
  </tbody>
</table>`
  )
  .join('')}`
  )
  .join('')}

<h3>Чего не хватает в списке</h3>
<p class="note">Впишите услуги, которые вы оказываете, а мы не указали:</p>
${'<span class="blank"></span>'.repeat(6)}

<h2 class="sec">4. Мастера</h2>
<div class="lead">
  В отзывах о вас пишут не «хожу в Пафию», а «хожу к Ларисе». Поэтому мастера на сайте стоят
  выше цен, и к каждому можно записаться отдельной кнопкой. Имена мы собрали из отзывов
  за несколько лет — <b>кто-то мог уйти, кого-то мы не знаем</b>.
</div>
<div class="warn">
  <b>Нужно согласие каждого мастера</b> на публикацию имени и фотографии — этого требует закон
  о персональных данных. Устного достаточно, но лучше письменно.
</div>

${masters
  .map(
    (m) => `
<h3>${esc(m.name)} — ${esc(m.role.toLowerCase())}</h3>
<table>
  <thead><tr><th style="width:26%">Что</th><th style="width:40%">Сейчас на сайте</th><th>Как правильно</th></tr></thead>
  <tbody>
    <tr><td>Имя, фамилия</td><td>${esc(m.name)}</td>${fill('как писать на сайте')}</tr>
    <tr><td>Должность</td><td>${esc(m.role)}</td>${fill()}</tr>
    <tr><td>Стаж <span class="tag tag--demo">●</span></td><td>${esc(m.experience)}</td>${fill()}</tr>
    <tr><td>В салоне с года <span class="tag tag--demo">●</span></td><td>${m.since}</td>${fill()}</tr>
    <tr><td>Работает сейчас?</td><td>—</td>${fill('да / нет')}</tr>
    <tr><td>Согласие на фото и имя</td><td>—</td>${fill('да / нет')}</tr>
    <tr><td>Курсы, сертификаты</td><td>не указаны</td>${fill()}</tr>
    <tr><td>Личный Instagram</td><td>не указан</td>${fill()}</tr>
  </tbody>
</table>
<h4>Что написано о работе <span class="tag tag--demo">● придумано</span></h4>
${m.approach.map((p) => `<p class="note">— ${esc(p)}</p>`).join('\n')}
<p class="note"><b>Верно ли это?</b> Если нет — напишите в двух-трёх фразах, что вы на самом деле
   спрашиваете у клиента и на что обращаете внимание. Именно такие детали отличают ваш сайт
   от десятка одинаковых.</p>
${'<span class="blank"></span>'.repeat(3)}
<h4>Услуги, которые делает</h4>
<p class="note">${m.specialties.map(esc).join(' · ')}</p>
<p class="note">Поправьте, если список неверный:</p>
${'<span class="blank"></span>'.repeat(2)}`
  )
  .join('')}

<h3>Кого не хватает</h3>
<p class="note">Если работают и другие мастера — впишите имя, должность и стаж:</p>
${'<span class="blank"></span>'.repeat(5)}

<h2 class="sec">5. Тексты страниц</h2>
<p class="note">Прочитайте и скажите, что звучит не по-вашему. Мы писали спокойно и без
   «команды профессионалов» — но это ваш салон, и слова должны быть ваши.</p>

<h3>Первое, что видит человек на сайте</h3>
<table>
  <thead><tr><th style="width:26%">Что</th><th style="width:40%">Сейчас</th><th>Ваш вариант</th></tr></thead>
  <tbody>
    <tr><td>Заголовок</td><td>Стрижка, цвет и маникюр рядом с «Кунцевщиной»</td>${fill()}</tr>
    <tr><td>Подзаголовок</td><td>Небольшой салон на Притыцкого, 73. Два парикмахерских кресла, маникюрный стол и отдельный кабинет депиляции. К нам ходят к своим мастерам — по имени, а не по названию.</td>${fill()}</tr>
  </tbody>
</table>

<h3>О салоне</h3>
${aboutParagraphs.map((p) => `<p>${esc(p)}</p>`).join('\n')}
<div class="warn">
  Проверьте два места: <b>марки косметики</b> (${site.cosmetics.map(esc).join(', ')}) —
  на них ли вы работаете, и фразу про чай, кофе и плед — так ли это.
</div>
<p class="note">Что поправить:</p>
${'<span class="blank"></span>'.repeat(3)}

<h3>Разделы услуг на главной</h3>
<table>
  <thead><tr><th style="width:24%">Раздел</th><th style="width:46%">Описание на сайте</th><th>Поправки</th></tr></thead>
  <tbody>
    ${serviceBlocks.map((b) => `<tr><td>${esc(b.title)}</td><td>${esc(b.text)}</td>${fill()}</tr>`).join('\n    ')}
  </tbody>
</table>

<h3>Вопросы и ответы</h3>
<p class="note">Эти вопросы мы собрали по вашим отзывам — каждый закрывает жалобу, которая уже была.</p>
${faq
  .map(
    (f) => `
<div class="q">
  <b>${esc(f.q)}${f.demo ? ' ' + mark('demo') : ''}</b>
  <span class="note">${esc(f.a)}</span>
  <span class="blank"></span>
</div>`
  )
  .join('')}

<h2 class="sec">6. Окрашивание — отдельные страницы</h2>
<p class="note">Под балаяж, омбре, AirTouch и мелирование сделаны отдельные страницы: так вас находят
   по запросам вроде «балаяж Минск цена». <b>Все цифры здесь придуманы</b> — их нужно подтвердить.</p>
<table>
  <thead><tr><th style="width:20%">Техника</th><th style="width:18%">Цена на сайте</th><th style="width:14%">Время</th><th style="width:16%">Держится</th><th>Как правильно</th></tr></thead>
  <tbody>
    ${techniques
      .map(
        (t) =>
          `<tr><td>${esc(t.title)}</td><td class="num">от ${t.priceFrom} руб.</td><td>${esc(t.duration)}</td><td>${esc(t.keepsFor)}</td>${fill()}</tr>`
      )
      .join('\n    ')}
  </tbody>
</table>
<p class="note">Отдельный вопрос: кто из мастеров делает каждую технику? Сейчас на сайте везде указана Марина.</p>
${'<span class="blank"></span>'.repeat(2)}

<h2>7. Фотографии</h2>
<div class="warn">
  <b>Сейчас на сайте фотографий нет вообще</b> — вместо них заглушки. Снимки из 2ГИС взять нельзя:
  права на них у людей, которые их снимали. Без съёмки сайт не запустить.
</div>
<p>Что нужно снять:</p>
<table>
  <thead><tr><th style="width:36%">Что</th><th style="width:34%">Сколько</th><th>Готово</th></tr></thead>
  <tbody>
    <tr><td>Парикмахерский зал</td><td>2–3 кадра</td>${fill()}</tr>
    <tr><td>Маникюрное место</td><td>1–2 кадра</td>${fill()}</tr>
    <tr><td>Кабинет депиляции</td><td>1–2 кадра</td>${fill()}</tr>
    <tr><td>Зона ожидания</td><td>1 кадр</td>${fill()}</tr>
    <tr><td>Портреты мастеров</td><td>по 1 на каждого, одинаковый свет и фон</td>${fill()}</tr>
    <tr><td>Работы: окрашивания, стрижки, маникюр</td><td>от 10 на направление</td>${fill()}</tr>
    <tr><td>«До и после» для сложных окрашиваний</td><td>3–5 пар</td>${fill()}</tr>
    <tr><td>Фасад дома, вывеска, дверь офиса 144</td><td>по 1 кадру</td>${fill()}</tr>
  </tbody>
</table>
<p class="note">Снимать можно на телефон при дневном свете у окна — это лучше, чем студийные
   фотографии чужих людей из интернета.</p>

<h2>8. Остальные вопросы</h2>
<table>
  <thead><tr><th style="width:52%">Вопрос</th><th>Ответ</th></tr></thead>
  <tbody>
    <tr><td>Есть ли парковка у здания и сколько мест</td>${fill()}</tr>
    <tr><td>Принимаете ли карты, есть ли терминал</td>${fill()}</tr>
    <tr><td>Свадебная причёска: цена пробной укладки, предоплата, выезд</td>${fill()}</tr>
    <tr><td>Подарочные сертификаты: номиналы и срок действия</td>${fill()}</tr>
    <tr><td>Бонусы и скидки постоянным клиентам — какие условия</td>${fill()}</tr>
    <tr><td>Как удобнее принимать заявки с сайта: звонок, Viber, Telegram, почта</td>${fill()}</tr>
    <tr><td>Ведёте ли запись в программе (YClients, DIKIDI) или в тетради</td>${fill()}</tr>
    <tr><td>Какой адрес сайта купить: pafia.by, salon-pafia.by, другой</td>${fill()}</tr>
    <tr><td>Электронная почта, на которую слать заявки</td>${fill()}</tr>
  </tbody>
</table>

<h2>Что мешает запуску прямо сейчас</h2>
<div class="lead">
  <p>Всё остальное — мелочи, которые правятся за час. Без этих четырёх пунктов сайт
     не выполняет свою работу:</p>
  <ol>
    <li><b>Цены.</b> ${priceCount} позиций, почти все придуманы.</li>
    <li><b>График работы.</b> В справочниках расходится, нужен ваш ответ.</li>
    <li><b>Список мастеров</b> с согласием на публикацию имени и фото.</li>
    <li><b>Фотографии.</b> Сейчас на их местах заглушки.</li>
  </ol>
  <p class="note">Спасибо, что дочитали. Чем подробнее ответите — тем меньше правок будет потом.</p>
</div>

</body>
</html>
`;

mkdirSync(join(ROOT, 'dist'), { recursive: true });
const out = 'dist/pafia-teksty-dlya-klienta.html';
writeFileSync(join(ROOT, out), html);
console.log(`${out} — ${priceCount} позиций с ценами, ${masters.length} мастеров, ${faq.length} вопросов.`);
console.log('Откройте в браузере и «Печать → Сохранить как PDF».');
