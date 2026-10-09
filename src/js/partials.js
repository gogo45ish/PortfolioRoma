import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
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
      <nav class="menu__list" aria-label="Меню">
        <a class="menu__item" href="./">Главная</a>
        ${links.map(([, label, href]) => `<a class="menu__item" href="${href}">${label}</a>`).join('')}
      </nav>
      <a class="menu__item menu__email label" href="mailto:${contacts.email}">${contacts.email}</a>
    </div>`,
  );

  const toggle = document.querySelector('.nav__toggle');
  const menu = document.querySelector('.menu');
  const items = menu.querySelectorAll('.menu__item');
  let anim = null;

  // Links are visible by default (the closed menu is hidden as a whole), and every open animates
  // them to explicit end values — so they can never get stuck invisible. Transforms only:
  // mobile Safari mis-paints children of an animated clip-path.
  const setOpen = (open, instant = false) => {
    const reduce = instant || matchMedia('(prefers-reduced-motion: reduce)').matches;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Закрыть' : 'Меню';
    menu.setAttribute('aria-hidden', String(!open));
    document.documentElement.classList.toggle('menu-open', open);
    ScrollSmoother.get()?.paused(open);

    anim?.kill();
    anim = open
      ? gsap
          .timeline()
          .set(menu, { visibility: 'visible' })
          .fromTo(menu, { yPercent: -100 }, { yPercent: 0, duration: reduce ? 0 : 0.7, ease: 'power3.inOut' })
          .fromTo(items, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: reduce ? 0 : 0.8, ease: 'expo.out', stagger: reduce ? 0 : 0.06 }, reduce ? 0 : '-=0.3')
      : gsap
          .timeline()
          .to(menu, { yPercent: -100, duration: reduce ? 0 : 0.5, ease: 'power3.inOut' })
          .set(menu, { visibility: 'hidden' });
  };

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';
  toggle.addEventListener('click', () => setOpen(!isOpen()));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && isOpen() && setOpen(false));
  // Coming back via the Back button restores the page from bfcache with the menu still open — reset it.
  window.addEventListener('pageshow', (e) => e.persisted && isOpen() && setOpen(false, true));
  // The overlay is mobile-only; growing past the breakpoint while it's open must also release the scroll lock.
  matchMedia('(min-width: 768px)').addEventListener('change', (e) => e.matches && isOpen() && setOpen(false, true));
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
