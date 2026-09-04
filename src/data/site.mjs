// Единый источник NAP-данных. Меняем здесь — меняется на всём сайте,
// включая подвал, микроразметку и sitemap.
export const site = {
  name: 'Салон-парикмахерская «Пафия»',
  shortName: 'Пафия',
  // ⚠️ ДЕМО: домен вымышленный, заменить на реальный перед запуском.
  origin: 'https://pafia.by',
  founded: 2011,
  address: {
    street: 'ул. Притыцкого, 73, офис 144',
    streetShort: 'Притыцкого, 73',
    office: '144',
    city: 'Минск',
    postalCode: '220140',
    district: 'Фрунзенский',
    country: 'BY',
  },
  metro: { name: 'Кунцевщина', distance: '260 м пешком' },
  geo: { lat: 53.905918, lon: 27.458822 },

  // Основной номер — МТС, на нём же Viber (см. бриф, п. 3).
  phonePrimary: { label: '+375 29 615-15-99', href: 'tel:+375296151599', raw: '+375296151599' },
  phonesSecondary: [
    { label: '+375 29 552-15-99', href: 'tel:+375295521599' },
    { label: '+375 17 201-03-52', href: 'tel:+375172010352' },
    { label: '+375 17 242-15-99', href: 'tel:+375172421599' },
  ],
  viber: 'viber://chat?number=%2B375296151599',
  telegram: 'https://t.me/salonpafia', // ⚠️ ДЕМО: аккаунт нужно завести.
  instagram: { label: '@salonpafia', url: 'https://instagram.com/salonpafia' },
  email: { label: 'salon@pafia.by', href: 'mailto:salon@pafia.by' }, // ⚠️ ДЕМО

  hours: [
    { days: 'Понедельник — суббота', time: '9:00 — 21:00' },
    { days: 'Воскресенье', time: '10:00 — 19:00' },
  ],
  hoursShort: 'Пн–сб 9:00–21:00, вс 10:00–19:00',

  rating: { value: '4,9', count: 76, source: 'Google', url: 'https://maps.google.com/?q=Пафия+Притыцкого+73+Минск' },

  legal: {
    entity: 'ООО «Пафия»',
    unp: '191526611',
    registrar: 'Минский городской исполнительный комитет',
    registeredAt: '17.03.2011',
    legalAddress: '220140, г. Минск, ул. Притыцкого, д. 73, оф. 144',
    gir: '№ 8361 от 12.05.2015',
    tradeRegister: '№ 264197 от 04.06.2015',
    okved: '96020 — предоставление услуг парикмахерскими и салонами красоты',
  },

  cosmetics: ['Echosline', 'Wella', 'L’Oréal', 'CHI'],
};

export const nav = [
  { title: 'Услуги', href: 'index.html#services' },
  { title: 'Мастера', href: 'masters.html' },
  { title: 'Цены', href: 'prices.html' },
  { title: 'Работы', href: 'index.html#works' },
  { title: 'О салоне', href: 'index.html#about' },
  { title: 'Контакты', href: 'contacts.html' },
];
