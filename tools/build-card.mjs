#!/usr/bin/env node
/**
 * Карточка проекта — одна страница для владелицы салона.
 * Отправляется вместе со ссылкой: что за сайт, что уже готово,
 * что нужно от неё и к кому обращаться.
 *
 * Запуск: node tools/build-card.mjs
 * Свои данные подставляются через окружение, значения по умолчанию —
 * заготовки в угловых скобках, их видно и не забудешь заменить:
 *   AUTHOR_NAME="Роман" AUTHOR_CONTACT="+375 29 000-00-00" node tools/build-card.mjs
 *
 * На выходе dist/pafia-kartochka-proekta.html — «Печать → Сохранить как PDF».
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { site } from '../src/data/site.mjs';
import { priceCategories } from '../src/data/prices.mjs';
import { masters } from '../src/data/masters.mjs';
import { techniques } from '../src/data/techniques.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const SITE_URL = process.env.SITE_URL || 'https://ssromanpl.github.io/Site/';
const AUTHOR_NAME = process.env.AUTHOR_NAME || '‹ваше имя›';
const AUTHOR_CONTACT = process.env.AUTHOR_CONTACT || '‹телефон или Telegram›';

const priceCount = priceCategories.reduce((n, c) => n + c.groups.reduce((k, g) => k + g.items.length, 0), 0);
const pageCount = 8 + masters.length + techniques.length; // основные + мастера + техники

/* QR ведёт на сайт: навести камеру проще, чем набирать адрес руками. */
const qrPath = join(ROOT, 'assets', 'img', 'qr-site.png');
const qr = existsSync(qrPath)
  ? `<img class="qr" src="data:image/png;base64,${readFileSync(qrPath).toString('base64')}" alt="QR-код со ссылкой на сайт">`
  : '';

const html = `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><title>Сайт салона «Пафия» — карточка проекта</title>
<style>
@page { size: A4; margin: 14mm; }
* { box-sizing: border-box; }
body { margin: 0; color: #23201d; background: #fff;
  font: 10pt/1.42 "DejaVu Sans", "Liberation Sans", Arial, sans-serif; }
h1 { font-size: 19pt; margin: 0 0 2pt; letter-spacing: -.02em; }
h2 { font-size: 10pt; margin: 0 0 5pt; color: #8a4931;
  text-transform: uppercase; letter-spacing: .05em; }
p { margin: 0 0 5pt; }
ul { margin: 0; padding-left: 15pt; }
li { margin-bottom: 3pt; }
.muted { color: #55504a; }
.small { font-size: 9.5pt; }

.head { display: flex; align-items: center; gap: 11pt; padding-bottom: 8pt;
  border-bottom: 2pt solid #a65b3e; margin-bottom: 10pt; }
.mark { width: 40pt; height: 40pt; flex: none; border-radius: 50%; background: #a65b3e;
  color: #fff; font-size: 20pt; font-weight: bold; text-align: center; line-height: 40pt; }
.head p { margin: 0; color: #55504a; }

.link { display: flex; gap: 13pt; align-items: center; padding: 9pt 12pt; margin-bottom: 10pt;
  background: #fbf8f4; border: 1pt solid #e0d6c9; border-radius: 7pt; }
.link__text { flex: 1; }
.link__url { font-size: 13pt; font-weight: bold; color: #8a4931; word-break: break-all; margin: 3pt 0; }
.qr { width: 74pt; height: 74pt; flex: none; }

.cols { display: flex; gap: 14pt; margin-bottom: 10pt; }
.col { flex: 1; }
.facts { list-style: none; padding: 0; margin: 0; }
.facts li { display: flex; gap: 7pt; margin-bottom: 4pt; }
.facts b { flex: none; min-width: 34pt; color: #8a4931; }

.need { padding: 9pt 12pt; background: #fdf4f0; border: 1pt solid #e8cec2; border-radius: 7pt; margin-bottom: 10pt; }
.need ol { margin: 5pt 0 0; padding-left: 15pt; }
.need li { margin-bottom: 3pt; }

.docs { border: 1pt solid #e0d6c9; border-radius: 7pt; padding: 9pt 12pt; margin-bottom: 10pt; }
.docs table { width: 100%; border-collapse: collapse; font-size: 9.5pt; }
.docs td { padding: 3pt 0; vertical-align: top; }
.docs td:first-child { width: 44%; font-weight: bold; padding-right: 8pt; }

.foot { display: flex; gap: 12pt; align-items: stretch; padding-top: 9pt; border-top: 1pt solid #e0d6c9; }
.foot__me { flex: 1 1 auto; min-width: 0; }
.foot__me h2 { white-space: nowrap; }
.fill { border-bottom: .8pt solid #cfc4b6; display: inline-block; min-width: 42mm; }
.demo { flex: 0 0 64mm; padding: 8pt 10pt; background: #a65b3e; color: #fff;
  border-radius: 5pt; font-size: 9pt; line-height: 1.38; }
.demo b { display: block; margin-bottom: 2pt; }
</style></head><body>

<div class="head">
  <div class="mark">П</div>
  <div>
    <h1>Сайт салона «Пафия»</h1>
    <p>Черновик — посмотрите и скажите, что поправить</p>
  </div>
</div>

<div class="link">
  <div class="link__text">
    <h2>Сайт открывается здесь</h2>
    <div class="link__url">${esc(SITE_URL)}</div>
    <p class="small muted">Наведите камеру телефона на квадратик справа — откроется сам.
       Работает и на телефоне, и на компьютере, ничего устанавливать не надо.</p>
  </div>
  ${qr}
</div>

<div class="cols">
  <div class="col">
    <h2>Что уже готово</h2>
    <ul class="facts">
      <li><b>${pageCount}</b><span>страниц: услуги, цены, мастера, контакты</span></li>
      <li><b>${priceCount}</b><span>услуг с ценами, разбиты по разделам</span></li>
      <li><b>${masters.length}</b><span>мастеров — к каждому отдельная кнопка записи</span></li>
      <li><b>${techniques.length}</b><span>страницы про окрашивание: балаяж, омбре, AirTouch, мелирование</span></li>
      <li><b>—</b><span>форма записи, карта, кликабельные телефоны и Viber</span></li>
    </ul>
  </div>
  <div class="col">
    <h2>Как это устроено</h2>
    <p class="small">Сайт сделан под телефон: с него ищут чаще всего. Крупные кнопки
       «Позвонить» и «Записаться» видны всегда.</p>
    <p class="small">Мастера стоят выше цен — в отзывах о вас пишут не «хожу в Пафию»,
       а «хожу к Ларисе». Записаться можно сразу к человеку.</p>
    <p class="small">Все цены открыты: чтобы их увидеть, посетителю не нужно
       оставлять телефон.</p>
  </div>
</div>

<div class="need">
  <h2>Что нужно от вас</h2>
  <p class="small">Без этих четырёх пунктов сайт запускать нельзя — остальное правится за час.</p>
  <ol>
    <li><b>Цены.</b> Сейчас на сайте ${priceCount} позиций, и почти все проставлены наугад — реального прайса нет ни в одном справочнике.</li>
    <li><b>График работы.</b> В справочниках расходится: где-то воскресенье с 9:00, где-то с 10:00.</li>
    <li><b>Список мастеров</b> — кто работает сейчас, и согласие каждого на публикацию имени и фото.</li>
    <li><b>Фотографии.</b> Пока на их местах заглушки. Снимки из 2ГИС взять нельзя — права на них у авторов.</li>
  </ol>
</div>

<div class="docs">
  <h2>Два документа к этой карточке</h2>
  <table>
    <tr>
      <td>Тексты сайта для проверки</td>
      <td class="muted">Весь текст и все цены с пустой графой для правок. Можно распечатать и заполнить ручкой.</td>
    </tr>
    <tr>
      <td>Макет сайта в картинках</td>
      <td class="muted">Как сайт выглядит, страница за страницей. Листы пронумерованы — пишите «лист 7, тут поменять».</td>
    </tr>
  </table>
</div>

<div class="foot">
  <div class="foot__me">
    <h2>С вопросами — ко мне</h2>
    <p>${esc(AUTHOR_NAME)}<br><span class="muted">${esc(AUTHOR_CONTACT)}</span></p>
    <p class="small muted">Замечания удобнее одним списком: так я внесу их за раз.</p>
  </div>
  <div class="demo">
    <b>Это демо-версия</b>
    Цены, тексты и фотографии предварительные.
    Сайт закрыт от поисковиков — посторонние его не найдут.
  </div>
</div>

</body></html>
`;

mkdirSync(join(ROOT, 'dist'), { recursive: true });
writeFileSync(join(ROOT, 'dist', 'pafia-kartochka-proekta.html'), html);
console.log('dist/pafia-kartochka-proekta.html');
console.log(`  ссылка: ${SITE_URL}`);
console.log(`  подпись: ${AUTHOR_NAME}, ${AUTHOR_CONTACT}`);
console.log(qr ? '  QR-код встроен' : '  QR-кода нет: assets/img/qr-site.png не найден');
