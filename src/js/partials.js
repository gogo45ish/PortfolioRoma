import gsap from 'gsap';
import { contacts } from '../data/projects.js';

const links = [
  ['work', 'Работы', 'work.html'],
  ['about', 'Обо мне', 'about.html'],
  ['contact', 'Контакты', 'contact.html'],
];

const telHref = `tel:${contacts.phone.replace(/[^\d+]/g, '')}`;
const tgHref = `https://t.me/${contacts.telegram.slice(1)}`;

export function renderNav(page) {
  const current = (key) => (key === page || (key === 'work' && page === 'project') ? ' aria-current="page"' : '');
  document.body.insertAdjacentHTML(
    'afterbegin',
    `<header class="nav">
      <a class="nav__brand" href="./">Роман Сулейманов</a>
      <nav class="nav__links" aria-label="Основная навигация">
        ${links.map(([key, label, href]) => `<a class="link" href="${href}"${current(key)}>${label}</a>`).join('')}
      </nav>
      <button class="nav__toggle" aria-expanded="false" aria-controls="menu">Меню</button>
    </header>
    <div class="menu" id="menu" aria-hidden="true">
      <a href="./">Главная</a>
      ${links.map(([, label, href]) => `<a href="${href}">${label}</a>`).join('')}
      <p class="label" style="margin-top:32px;opacity:.6">${contacts.email}</p>
    </div>`,
  );

  const toggle = document.querySelector('.nav__toggle');
  const menu = document.querySelector('.menu');
  const tl = gsap
    .timeline({ paused: true, defaults: { ease: 'expo.out' } })
    .set(menu, { visibility: 'visible' })
    .fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'power3.inOut' })
    .from(menu.querySelectorAll('a, p'), { yPercent: 60, opacity: 0, duration: 1, stagger: 0.06 }, '-=0.3');

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Закрыть' : 'Меню';
    menu.setAttribute('aria-hidden', String(!open));
    open ? tl.timeScale(1).play() : tl.timeScale(1.6).reverse();
  });
}

export function renderFooter(target) {
  target.insertAdjacentHTML(
    'beforeend',
    `<footer class="footer">
      <p class="label muted">Есть проект?</p>
      <a class="footer__cta t-display-xl" href="mailto:${contacts.email}">
        <span class="footer__line"><span>Давайте</span></span>
        <span class="footer__line"><span>поработаем</span></span>
      </a>
      <div class="footer__cols">
        <div><p class="label muted">Почта</p><ul><li><a class="link" href="mailto:${contacts.email}">${contacts.email}</a></li></ul></div>
        <div><p class="label muted">Связь</p><ul><li><a class="link" href="${tgHref}">Telegram ${contacts.telegram}</a></li><li><a class="link" href="${telHref}">${contacts.phone}</a></li></ul></div>
        <div><p class="label muted">Город</p><ul><li>${contacts.city}</li><li class="muted">Работаю по всей России</li></ul></div>
        <div><p class="label muted">© ${new Date().getFullYear()}</p><ul><li>Роман Сулейманов</li><li><a class="link" href="#" data-to-top>Наверх ↑</a></li></ul></div>
      </div>
    </footer>`,
  );
}

export { telHref, tgHref };
