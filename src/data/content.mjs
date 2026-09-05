// Тексты и блоки страниц: услуги на главной, галерея, FAQ, «Вход в салон»,
// «О салоне». Правятся в src/data/content.json.
//
// ⚠️ ДЕМО: ответы про парковку, оплату картой и свадебные причёски, а также
// весь блок «Вход в салон» придуманы — уточнить у владельца. Для Притыцкого,
// 73 это критично: в здании три салона.
import { loadJson } from './load.mjs';

const data = loadJson('content');

// Пять крупных блоков услуг для главной. Каждый ведёт в нужный раздел прайса.
export const serviceBlocks = data.serviceBlocks;

// Галерея работ. Подписи есть, фотографий пока нет — заглушки генерируются
// сборщиком (см. README, раздел «Что нужно снять»).
export const works = data.works;

// FAQ составлен по реальным болям из отзывов — каждый вопрос закрывает
// конкретную жалобу.
export const faq = data.faq;

// Как найти вход — приём от МОНЕ.
export const entrance = data.entrance;

export const aboutParagraphs = data.aboutParagraphs;
export const aboutFacts = data.aboutFacts;
