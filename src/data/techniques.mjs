// Подстраницы под техники окрашивания — приём от Safina: ловим поисковый
// трафик по конкретным запросам («балаяж Минск», «AirTouch цена»).
// Тексты пишем по-человечески, без набивки ключевыми словами.
// Правятся в src/data/techniques.json.
//
// ⚠️ ДЕМО: сроки, длительность и цены техник требуют подтверждения.
import { loadJson } from './load.mjs';

export const techniques = loadJson('techniques').techniques;

export const techniqueBySlug = Object.fromEntries(techniques.map((t) => [t.slug, t]));
