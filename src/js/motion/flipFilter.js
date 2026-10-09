import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ease } from './tokens.js';

// Work page: category filter re-flows cards with Flip; grid/list view toggle.
export function flipFilter({ reduce }) {
  const root = document.querySelector('[data-work]');
  if (!root) return;
  const buttons = root.querySelectorAll('[data-filter]');
  const views = root.querySelectorAll('[data-view]');
  const items = () => root.querySelectorAll('[data-category]');
  const count = document.querySelector('[data-count]');
  const grid = root.querySelector('.work-grid');
  const list = root.querySelector('.index-list');
  let active = null; // running Flip timeline (cards + container height)

  // Hand items over from the scroll-reveal batch to Flip so the two never fight over transforms.
  let released = false;
  const release = () => {
    if (released) return;
    released = true;
    ScrollTrigger.getAll().forEach((st) => root.contains(st.trigger) && st.kill());
    gsap.killTweensOf(items());
    gsap.set(items(), { opacity: 1, y: 0 });
  };

  // Finish any in-flight flip/fade so leftover absolute positioning or offsets can't stick.
  const settle = () => {
    active?.progress(1).kill();
    active = null;
    Flip.killFlipsOf(items(), true);
    gsap.set([grid, list], { clearProps: 'height' });
    gsap.killTweensOf(items(), 'opacity,scale,y');
    gsap.set(items(), { opacity: 1, y: 0, clearProps: 'scale' }); // Flip reads the end state from here
  };

  const onFilter = (e) => {
    const btn = e.currentTarget;
    const cat = btn.dataset.filter;
    if (btn.getAttribute('aria-pressed') === 'true') return;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    release();
    const state = Flip.getState(items(), { props: 'opacity' });
    settle();

    // `absolute: true` lifts every item out of flow mid-flip, which would collapse the
    // container and pull the footer up underneath the cards. Pin the container's
    // height and tween it from the old height to the new one instead.
    const container = [grid, list].find((el) => !el.hidden);
    gsap.set(container, { clearProps: 'height' });
    const fromH = container.offsetHeight;
    items().forEach((el) => {
      el.hidden = cat !== 'Все' && el.dataset.category !== cat;
    });
    const toH = container.offsetHeight;
    gsap.set(container, { height: fromH });

    const d = reduce ? 0 : 0.9;
    active = Flip.from(state, {
      duration: d,
      ease: ease.inOut,
      absolute: true,
      stagger: 0.03,
      // Leavers fade out quickly before newcomers fade in, so the two sets never stack.
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.94, duration: d * 0.35, ease: 'power1.in' }),
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: d * 0.7, delay: d * 0.35, ease: ease.out }),
      onComplete: () => {
        gsap.set(container, { clearProps: 'height' });
        ScrollTrigger.refresh();
      },
    }).to(container, { height: toH, duration: d, ease: ease.inOut }, 0);
    count.textContent = root.querySelectorAll('.work-grid [data-category]:not([hidden])').length;
  };

  const onView = (e) => {
    const view = e.currentTarget.dataset.view;
    views.forEach((b) => b.setAttribute('aria-pressed', String(b === e.currentTarget)));
    const show = root.querySelector(view === 'grid' ? '.work-grid' : '.index-list');
    const hide = root.querySelector(view === 'grid' ? '.index-list' : '.work-grid');
    if (!show.hidden) return;
    release();
    settle();
    hide.hidden = true;
    show.hidden = false;
    gsap.fromTo(show.children, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: reduce ? 0 : 0.8, ease: ease.out, stagger: 0.04 });
    ScrollTrigger.refresh();
  };

  buttons.forEach((b) => b.addEventListener('click', onFilter));
  views.forEach((b) => b.addEventListener('click', onView));
  return () => {
    buttons.forEach((b) => b.removeEventListener('click', onFilter));
    views.forEach((b) => b.removeEventListener('click', onView));
  };
}
