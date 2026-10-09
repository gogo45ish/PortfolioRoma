// Placeholder photos (picsum.photos) until Роман's real work arrives.
// `tone` is the background shown while an image loads (matches Figma Photo set tones).
const img = (seed, w = 1600, h = 1067) => `https://picsum.photos/seed/${seed}/${w}/${h}?grayscale`;

export const projects = [
  { slug: 'tishina', title: 'Тишина', category: 'Портрет', year: 2025, tone: 'stone' },
  { slug: 'dagestan-zima', title: 'Дагестан. Зима', category: 'Документ', year: 2025, tone: 'fog' },
  { slug: 'stal', title: 'Сталь', category: 'Коммерция', year: 2024, tone: 'night' },
  { slug: 'bereg', title: 'Берег', category: 'Документ', year: 2024, tone: 'sand' },
  { slug: 'mastera', title: 'Мастера', category: 'Портрет', year: 2024, tone: 'olive' },
  { slug: 'step', title: 'Степь', category: 'Документ', year: 2023, tone: 'mono' },
  { slug: 'litsa', title: 'Лица', category: 'Портрет', year: 2023, tone: 'stone' },
  { slug: 'gorod', title: 'Город на рассвете', category: 'Коммерция', year: 2023, tone: 'fog' },
  { slug: 'remeslo', title: 'Ремесло', category: 'Коммерция', year: 2022, tone: 'sand' },
  { slug: 'sever', title: 'Север', category: 'Документ', year: 2022, tone: 'night' },
].map((p, i) => ({
  ...p,
  index: String(i + 1).padStart(2, '0'),
  cover: img(p.slug, 1600, 2000),
  wide: img(`${p.slug}-w`, 2400, 1350),
  gallery: [1, 2, 3, 4, 5].map((n) => img(`${p.slug}-${n}`, n % 2 ? 1600 : 1200, n % 2 ? 1067 : 1500)),
}));

export const categories = ['Все', 'Портрет', 'Документ', 'Коммерция'];

export const contacts = {
  email: 'hello@suleymanov.photo',
  telegram: '@suleymanov',
  phone: '+7 (900) 000-00-00',
  city: 'Москва',
};
