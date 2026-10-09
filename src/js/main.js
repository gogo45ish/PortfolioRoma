import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';

import { renderNav, renderFooter } from './partials.js';
import { renderPage } from './pages.js';
import { reveal, splitLines } from './motion/reveal.js';
import { hero } from './motion/hero.js';
import { parallax } from './motion/parallax.js';
import { statement } from './motion/statement.js';
import { strip } from './motion/strip.js';
import { indexHover } from './motion/indexHover.js';
import { footer } from './motion/footer.js';
import { flipFilter } from './motion/flipFilter.js';
import { nextProject } from './motion/nextProject.js';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, Flip);
document.documentElement.classList.add('js'); // also set inline in <head>; kept as a fallback
if (import.meta.env.DEV) Object.assign(window, { gsap, ScrollTrigger }); // console debugging only

const page = document.body.dataset.page;
const content = document.querySelector('#smooth-content');

renderNav(page);
renderPage(page);
if (page !== 'project') renderFooter(content);

// Order matters: pins are created top-to-bottom so ScrollTrigger measures correctly.
const modules = [hero, parallax, statement, strip, nextProject, indexHover, flipFilter, splitLines, reveal, footer];

document.fonts.ready.then(() => {
  const mm = gsap.matchMedia();
  mm.add(
    // The callback only runs when at least one condition matches — desktop/mobile guarantees that.
    {
      desktop: '(min-width: 768px)',
      mobile: '(max-width: 767px)',
      reduce: '(prefers-reduced-motion: reduce)',
      hover: '(hover: hover) and (pointer: fine)',
    },
    (ctx) => {
      const c = ctx.conditions;
      const smoother = c.reduce ? null : ScrollSmoother.create({ smooth: 1.1, effects: true, smoothTouch: false });
      const cleanups = modules.map((fn) => fn(c)).filter((fn) => typeof fn === 'function');
      return () => {
        cleanups.forEach((fn) => fn());
        smoother?.kill();
      };
    },
  );

  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-to-top]')) return;
    e.preventDefault();
    const smoother = ScrollSmoother.get();
    smoother ? smoother.scrollTo(0, true) : window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// Images loading late change layout — re-measure triggers once everything is in.
window.addEventListener('load', () => ScrollTrigger.refresh());
