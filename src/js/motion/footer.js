import gsap from 'gsap';
import { ease, dur, stagger } from './tokens.js';

// Footer headline lines rise from behind their masks.
export function footer({ reduce }) {
  const lines = gsap.utils.toArray('.footer__line > span');
  if (!lines.length || reduce) return;
  gsap.from(lines, {
    yPercent: 105,
    duration: dur.slow,
    ease: ease.reveal,
    stagger: stagger.items,
    scrollTrigger: { trigger: '.footer', start: 'top 70%', once: true },
  });
}
