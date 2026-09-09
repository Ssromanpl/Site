// Единый источник контактных данных: адрес, телефон, часы, реквизиты.
// Правится в src/data/site.json — вручную или через `npm run edit`.
// Меняется здесь — меняется на всём сайте, включая подвал, микроразметку
// и карту сайта.
//
// ⚠️ ЧЕРНОВИК: домен, Telegram, WhatsApp и реквизиты юрлица — заготовки.
// Что именно нужно подтвердить у владельцев, перечислено в README.
import { loadJson } from './load.mjs';

const data = loadJson('site');

export const site = data.site;
export const nav = data.nav;

/** Канал записи по id — чтобы ссылки не дублировались по шаблонам. */
export const channel = (id) => site.channels.find((c) => c.id === id) || null;
