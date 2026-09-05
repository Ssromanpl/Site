/* Салон «Пафия» — клиентская логика.
   Без зависимостей: меню, модалка записи, валидация формы, cookie-баннер,
   отложенная загрузка карты и цели аналитики. */
(function () {
  'use strict';

  /* --------------------------------------------------------------------
     Настройки интеграций. Перед запуском подставить реальные значения.
     BOOKING_ENDPOINT — URL, куда уходит заявка (бот в Telegram, YClients,
     DIKIDI или собственный обработчик). Пока пусто — форма работает
     в демо-режиме: показывает подтверждение и пишет заявку в консоль.
     -------------------------------------------------------------------- */
  var CONFIG = window.PAFIA_CONFIG || {};
  var BOOKING_ENDPOINT = CONFIG.bookingEndpoint || '';
  var METRIKA_ID = CONFIG.metrikaId || '';
  var COOKIE_KEY = 'pafia-cookie-choice';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* --- Мобильное меню ------------------------------------------------- */
  (function menu() {
    var burger = $('.burger');
    var panel = $('#mobile-menu');
    if (!burger || !panel) return;

    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
    });

    $$('a', panel).forEach(function (a) {
      a.addEventListener('click', function () {
        burger.setAttribute('aria-expanded', 'false');
        panel.hidden = true;
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        burger.setAttribute('aria-expanded', 'false');
        panel.hidden = true;
        burger.focus();
      }
    });
  })();

  /* --- Модалка записи -------------------------------------------------- */
  (function modal() {
    var dialog = $('#booking-modal');
    if (!dialog) return;
    var lastFocused = null;

    function open(master, service) {
      var form = $('#booking-form-modal');
      if (form) {
        if (master) setSelect($('[data-master-select]', form), master);
        if (service) setSelect($('[data-service-select]', form), service);
      }
      lastFocused = document.activeElement;
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
      var first = $('input[name="name"]', dialog);
      if (first) setTimeout(function () { first.focus(); }, 40);
    }

    function close() {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
      if (lastFocused) lastFocused.focus();
    }

    function setSelect(select, value) {
      if (!select) return;
      var match = Array.prototype.find.call(select.options, function (o) {
        return o.value === value || o.textContent.indexOf(value) === 0;
      });
      if (match) select.value = match.value;
    }

    // На странице /booking форма уже открыта — там ведём к ней, а не дублируем
    // её в модалке.
    var inlineForm = $('#booking-form-standalone');

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-book]');
      if (trigger) {
        e.preventDefault();
        if (inlineForm) {
          inlineForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
          var field = $('input[name="name"]', inlineForm);
          if (field) field.focus({ preventScroll: true });
          return;
        }
        open(trigger.getAttribute('data-master'), trigger.getAttribute('data-service'));
        return;
      }
      if (e.target.closest('[data-close-modal]')) close();
      // Клик по подложке диалога
      if (e.target === dialog) close();
    });
  })();

  /* --- Форма записи ---------------------------------------------------- */
  function normalizePhone(value) {
    var digits = value.replace(/\D/g, '');
    if (digits.indexOf('375') === 0) digits = digits.slice(3);
    else if (digits.indexOf('80') === 0) digits = digits.slice(2);
    if (digits.length !== 9) return null;
    return '+375' + digits;
  }

  function setError(form, name, message) {
    var box = $('[data-error-for="' + name + '"]', form);
    var input = form.elements[name];
    // Место под сообщение зарезервировано в стилях, поэтому смена текста
    // не двигает то, что расположено ниже.
    if (box) box.textContent = message || '';
    if (input && input.setAttribute) input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  $$('form.form').forEach(function (form) {
    var dateInput = $('[data-date]', form);
    if (dateInput) {
      var today = new Date();
      var pad = function (n) { return String(n).padStart(2, '0'); };
      dateInput.min = today.getFullYear() + '-' + pad(today.getMonth() + 1) + '-' + pad(today.getDate());
    }

    var phone = $('[data-phone]', form);
    if (phone) {
      phone.addEventListener('blur', function () {
        if (!phone.value.trim()) return;
        var normalized = normalizePhone(phone.value);
        if (normalized) {
          phone.value = normalized.replace(/^(\+375)(\d{2})(\d{3})(\d{2})(\d{2})$/, '$1 $2 $3-$4-$5');
          setError(form, 'phone', '');
        }
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;

      var name = form.elements.name;
      if (!name.value.trim()) { setError(form, 'name', 'Напишите, как к вам обращаться'); ok = false; }
      else setError(form, 'name', '');

      // В Беларуси национальный номер — всегда 9 цифр после +375.
      var normalized = normalizePhone(form.elements.phone.value);
      if (!normalized) {
        setError(form, 'phone', 'Проверьте номер телефона — нужен формат +375 XX XXX-XX-XX');
        ok = false;
      } else setError(form, 'phone', '');

      var consent = form.elements.consent;
      if (!consent.checked) { setError(form, 'consent', 'Без согласия на обработку данных мы не можем принять заявку'); ok = false; }
      else setError(form, 'consent', '');

      if (!ok) {
        var firstBad = $('[aria-invalid="true"]', form) || $('[name="consent"]', form);
        if (firstBad) firstBad.focus();
        return;
      }

      var payload = {
        name: name.value.trim(),
        phone: normalized,
        service: form.elements.service.value || 'не выбрана',
        master: form.elements.master.value || 'любой свободный',
        date: form.elements.date.value || 'не указана',
        time: form.elements.time.value || 'не принципиально',
        comment: form.elements.comment.value.trim(),
        page: location.pathname,
      };

      var button = $('button[type="submit"]', form);
      if (button) { button.disabled = true; button.textContent = 'Отправляем…'; }

      send(payload)
        .then(function () {
          form.reset();
          var done = $('.form__done', form);
          if (done) done.hidden = false;
          $$('.field, .check, .form__note, button[type="submit"]', form).forEach(function (el) { el.hidden = true; });
          goal('booking_sent');
        })
        .catch(function () {
          if (button) { button.disabled = false; button.textContent = 'Записаться'; }
          setError(form, 'phone', 'Не удалось отправить заявку. Позвоните, пожалуйста: +375 29 615-15-99');
        });
    });
  });

  function send(payload) {
    if (!BOOKING_ENDPOINT) {
      // Демо-режим: бэкенда ещё нет.
      console.info('[Пафия] Заявка (демо-режим, endpoint не задан):', payload);
      return new Promise(function (resolve) { setTimeout(resolve, 400); });
    }
    return fetch(BOOKING_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r;
    });
  }

  /* --- График работы: подсветка «сегодня» ------------------------------ */
  (function todayStatus() {
    var hoursNodes = $$('[data-today-hours]');
    var stateNodes = $$('[data-today-state]');
    if (!hoursNodes.length && !stateNodes.length) return;

    var now = new Date();
    var isSunday = now.getDay() === 0;
    var opens = isSunday ? 10 : 9;
    var closes = isSunday ? 19 : 21;
    var minutes = now.getHours() * 60 + now.getMinutes();
    var isOpen = minutes >= opens * 60 && minutes < closes * 60;

    hoursNodes.forEach(function (node) {
      node.textContent = 'Сегодня ' + opens + ':00–' + closes + ':00';
    });
    stateNodes.forEach(function (node) {
      node.textContent = isOpen
        ? 'Сейчас открыто'
        : minutes < opens * 60
          ? 'Откроемся в ' + opens + ':00'
          : 'Сейчас закрыто';
    });
  })();

  /* --- Карта по клику (не тянем Яндекс, пока не попросили) ------------- */
  (function map() {
    var box = $('[data-map]');
    if (!box) return;
    var button = $('[data-map-load]', box);
    if (!button) return;
    button.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      iframe.src = box.getAttribute('data-map-src');
      iframe.title = 'Салон «Пафия» на карте: Минск, Притыцкого, 73';
      iframe.loading = 'lazy';
      iframe.allowFullscreen = true;
      box.innerHTML = '';
      box.appendChild(iframe);
    });
  })();

  /* --- Cookie-баннер и аналитика --------------------------------------- */
  (function cookies() {
    var bar = $('#cookiebar');
    var choice = null;
    try { choice = localStorage.getItem(COOKIE_KEY); } catch (e) { /* приватный режим */ }

    if (choice === 'accept') loadMetrika();
    if (!choice && bar) bar.hidden = false;
    if (!bar) return;

    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-cookie]');
      if (!btn) return;
      var value = btn.getAttribute('data-cookie');
      try { localStorage.setItem(COOKIE_KEY, value); } catch (err) { /* игнорируем */ }
      bar.hidden = true;
      if (value === 'accept') loadMetrika();
    });
  })();

  function loadMetrika() {
    if (!METRIKA_ID || window.ym) return;
    window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
    window.ym.l = 1 * new Date();
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://mc.yandex.ru/metrika/tag.js';
    document.head.appendChild(s);
    window.ym(METRIKA_ID, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
    });
  }

  /* --- Цели: звонок, Viber, отправка формы ----------------------------- */
  function goal(name) {
    if (window.ym && METRIKA_ID) window.ym(METRIKA_ID, 'reachGoal', name);
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-goal]');
    if (el) goal(el.getAttribute('data-goal') === 'viber' ? 'viber_click' : 'phone_click');
  });
})();
