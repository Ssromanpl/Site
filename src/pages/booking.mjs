import { layout, bookingForm } from '../lib/layout.mjs';
import { icon } from '../lib/icons.mjs';
import { site } from '../data/site.mjs';
import { masters } from '../data/masters.mjs';
import { crumbs } from '../lib/components.mjs';

export function bookingPage() {
  const content = `
${crumbs([{ name: 'Главная', path: 'index.html' }, { name: 'Запись' }], 0)}

<section class="pagehead">
  <div class="wrap">
    <h1 class="pagehead__title">Онлайн-запись</h1>
    <p class="pagehead__lead">
      Заполните форму — мы подтвердим запись в течение рабочего дня. Если нужно быстрее,
      позвоните: <a class="link" href="${site.phonePrimary.href}" data-goal="phone">${site.phonePrimary.label}</a>.
    </p>
  </div>
</section>

<div class="wrap section section--tight">
  <div class="booking">
    <div class="booking__form card">
      ${bookingForm({ id: 'booking-form-standalone' })}
    </div>
    <aside class="booking__text">
      <h2 class="h4">Что дальше</h2>
      <ul class="ticks ticks--tight">
        <li>${icon('check')}<span>Заявка приходит администратору салона.</span></li>
        <li>${icon('check')}<span>Мы перезваниваем, чтобы подтвердить мастера и время.</span></li>
        <li>${icon('check')}<span>Если выбранное время занято — предложим ближайшее свободное.</span></li>
      </ul>

      <h2 class="h4">Мастера</h2>
      <ul class="contacts__list">
        ${masters.map((m) => `<li><a href="masters/${m.slug}.html">${m.name}</a> — ${m.role.toLowerCase()}</li>`).join('')}
      </ul>

      <h2 class="h4">Если звонить удобнее</h2>
      <p><a class="link" href="${site.phonePrimary.href}" data-goal="phone">${site.phonePrimary.label}</a> — основной номер, на нём же Viber.</p>
      <p class="contacts__muted">${site.hoursShort}</p>
    </aside>
  </div>
</div>
`;

  return layout({
    title: 'Онлайн-запись в салон «Пафия» — Притыцкого 73, Минск',
    description:
      'Запишитесь в салон-парикмахерскую «Пафия» онлайн: выберите услугу, мастера и удобное время. Подтверждаем запись в течение рабочего дня.',
    path: 'booking.html',
    depth: 0,
    active: 'booking.html',
    bodyClass: 'page-booking',
    crumbs: [
      { name: 'Главная', path: 'index.html' },
      { name: 'Запись', path: 'booking.html' },
    ],
    content,
  });
}
