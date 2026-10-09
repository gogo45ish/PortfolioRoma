// Builds the data-driven parts of each page from src/data/projects.js.
import { projects, categories, contacts } from '../data/projects.js';
import { telHref, tgHref } from './partials.js';

const $ = (sel) => document.querySelector(sel);

const card = (p, attrs = '') => `
  <a class="card" href="project.html?p=${p.slug}" ${attrs}>
    <figure class="media" data-tone="${p.tone}">
      <img src="${p.cover}" alt="${p.title}" width="1600" height="2000" loading="lazy" />
    </figure>
    <div class="card__meta">
      <span>${p.title}</span>
      <span class="muted">${p.category}, ${p.year}</span>
    </div>
  </a>`;

const indexRow = (p, attrs = '') => `
  <li ${attrs}>
    <a class="index-row t-heading" href="project.html?p=${p.slug}" data-preview="${p.cover}">
      <span class="index-row__num label muted">${p.index}</span>
      <span class="index-row__title">${p.title}</span>
      <span class="index-row__cat t-small muted">${p.category}</span>
      <span class="index-row__year t-small muted">${p.year}</span>
    </a>
  </li>`;

function home() {
  $('.strip__track').innerHTML = projects
    .slice(0, 6)
    .map((p) => `<div class="strip__item">${card(p)}</div>`)
    .join('');
  $('[data-index]').innerHTML = projects.map((p) => indexRow(p)).join('');
}

function work() {
  $('[data-count]').textContent = projects.length;
  $('[data-filters]').innerHTML = categories
    .map((c, i) => `<button class="chip" data-filter="${c}" aria-pressed="${i === 0}">${c}</button>`)
    .join('');
  $('.work-grid').innerHTML = projects
    .map((p, i) => `<div class="work-grid__item" data-category="${p.category}" data-reveal style="--i:${i % 3}">${card(p)}</div>`)
    .join('');
  $('.work .index-list').innerHTML = projects.map((p) => indexRow(p, `data-category="${p.category}"`)).join('');
}

function project() {
  const slug = new URLSearchParams(location.search).get('p');
  const i = Math.max(0, projects.findIndex((p) => p.slug === slug));
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];
  document.title = `${p.title} — Роман Сулейманов`;

  $('[data-project]').innerHTML = `
    <section class="project-hero container">
      <header class="page-head--count">
        <h1 class="t-display-xl" data-split="load">${p.title}</h1>
        <sup class="count" aria-label="Проект ${Number(p.index)} из ${projects.length}">${p.index}/${String(projects.length).padStart(2, '0')}</sup>
      </header>
      <dl class="project-meta grid">
        <div><dt class="label muted">Категория</dt><dd>${p.category}</dd></div>
        <div><dt class="label muted">Год</dt><dd>${p.year}</dd></div>
        <div><dt class="label muted">Место</dt><dd>${contacts.city}</dd></div>
        <div><dt class="label muted">Камера</dt><dd>Плёнка, 6×7</dd></div>
      </dl>
    </section>
    <figure class="full media" data-tone="${p.tone}" data-parallax>
      <img src="${p.wide}" alt="${p.title}" width="2400" height="1350" />
    </figure>
    <section class="section container grid">
      <p class="col-label label muted">О проекте</p>
      <p class="col-content t-display-m" data-split>
        Серия о людях и местах, где время идёт медленнее. Естественный свет, без постановки — только то, что есть.
      </p>
    </section>
    <section class="gallery container">
      ${p.gallery
        .map(
          (src, n) => `
        <figure class="gallery__item gallery__item--${n % 3} media" data-tone="${p.tone}" data-reveal>
          <img src="${src}" alt="${p.title}, кадр ${n + 1}" loading="lazy" width="${n % 2 ? 1200 : 1600}" height="${n % 2 ? 1500 : 1067}" />
        </figure>`,
        )
        .join('')}
    </section>
    <section class="next" aria-label="Следующий проект">
      <a href="project.html?p=${next.slug}" class="next__link">
        <figure class="next__media media" data-tone="${next.tone}">
          <img src="${next.wide}" alt="" width="2400" height="1350" loading="lazy" />
        </figure>
        <div class="next__text container">
          <p class="label">Следующий проект</p>
          <p class="t-display-l">${next.title}</p>
          <span class="next__track"><span class="next__bar"></span></span>
        </div>
      </a>
    </section>`;
}

function contact() {
  $('[data-contact-email]').href = `mailto:${contacts.email}`;
  $('[data-contact-email]').innerHTML = contacts.email.replace('@', '@<wbr>');
  $('[data-contact-list]').innerHTML = [
    ['Telegram', contacts.telegram, tgHref],
    ['Телефон', contacts.phone, telHref],
    ['Почта', contacts.email, `mailto:${contacts.email}`],
    ['Город', contacts.city, null],
  ]
    .map(
      ([label, value, href]) => `
      <li class="contact-row" data-reveal>
        <span class="label muted">${label}</span>
        ${href ? `<a class="link t-heading" href="${href}">${value}</a>` : `<span class="t-heading">${value}</span>`}
      </li>`,
    )
    .join('');
}

const renderers = { home, work, project, contact };

export function renderPage(page) {
  renderers[page]?.();
}
