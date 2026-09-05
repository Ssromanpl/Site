// Мастера — главные герои сайта: люди ходят «к Ларисе», а не «в Пафию».
// Правятся в src/data/masters.json.
//
// Обратите внимание на падежи: short — в подписях, dative — «записаться к …»,
// genitive — «работы …». Без них получится «Записаться к Лариса».
//
// ⚠️ ДЕМО: стаж, детали работы и портфолио — заглушка. Перед запуском
// заменить на реальные данные и получить согласие мастеров на публикацию.
import { loadJson } from './load.mjs';

export const masters = loadJson('masters').masters;

export const masterBySlug = Object.fromEntries(masters.map((m) => [m.slug, m]));
