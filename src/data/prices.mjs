// Прайс-лист. Цены в белорусских рублях, правятся в src/data/prices.json.
//
// ⚠️ ДЕМО-ДАННЫЕ. Подтверждённые владельцем ориентиры: женская стрижка от 45,
// мужская от 40, аппаратный маникюр 30, классический + покрытие 32,
// шугаринг от 10, брови от 7,50, Ki-Power от 25. Остальное — правдоподобная
// заглушка, заменить на реальные цены до запуска (см. README).
import { loadJson } from './load.mjs';

const data = loadJson('prices');

export const priceUpdated = data.priceUpdated;
export const priceCategories = data.priceCategories;

// Топ-10 для главной (по образцу M5: цены видны сразу, без формы записи).
export const topPrices = data.topPrices;

export function priceLabel(item) {
  if (item.free) return 'бесплатно';
  const value = `${item.price} руб.`;
  const withUnit = item.unit ? `${value} ${item.unit}` : value;
  return item.from ? `от ${withUnit}` : withUnit;
}

export const allServiceNames = priceCategories
  .flatMap((c) => c.groups.flatMap((g) => g.items.map((i) => i.name)));
