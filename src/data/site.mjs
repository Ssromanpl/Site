// Единый источник NAP-данных: адрес, телефоны, часы, реквизиты.
// Правится в src/data/site.json — вручную или через `npm run edit`.
// Меняется здесь — меняется на всём сайте, включая подвал, микроразметку
// и sitemap.
//
// ⚠️ ДЕМО: домен, почта и Telegram вымышленные, график требует подтверждения
// звонком в салон. Полный список — в README.
import { loadJson } from './load.mjs';

const data = loadJson('site');

export const site = data.site;
export const nav = data.nav;
