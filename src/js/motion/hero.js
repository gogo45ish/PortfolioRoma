import gsap from 'gsap';
import { ease, dur, stagger } from './tokens.js';

// The mosaic tiles wipe up into view from the centre outward. On desktop the hero then pins and the
// camera pushes into the feature tile until it fills the screen; the rest of the mosaic slides off past the edges.
export function hero({ desktop, reduce }) {
  const section = document.querySelector('.hero');
  if (!section || reduce) return;
  const grid = section.querySelector('[data-hero-grid]');
  const feature = section.querySelector('[data-hero-feature]');
  const tiles = gsap.utils.toArray('.hero__tile', grid);

  gsap
    .timeline({ delay: 0.3 })
    .fromTo(tiles, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: dur.slow, ease: ease.reveal, stagger: { each: stagger.items, from: 'center' } })
    .fromTo(tiles.map((t) => t.querySelector('img')), { scale: 1.25 }, { scale: 1, duration: dur.slow, ease: ease.out, stagger: { each: stagger.items, from: 'center' } }, 0);

  if (!desktop) return;

  // Zoom maths from layout offsets (untouched by the transform), so a refresh mid-scroll stays correct.
  // Scaling about the feature's centre keeps it in place; the translate then centres it in the viewport.
  const fx = () => feature.offsetLeft + feature.offsetWidth / 2;
  const fy = () => feature.offsetTop + feature.offsetHeight / 2;
  const zoom = () => Math.max(section.offsetWidth / feature.offsetWidth, section.offsetHeight / feature.offsetHeight) * 1.02;

  gsap
    .timeline({
      scrollTrigger: { trigger: section, start: 'top top', end: '+=120%', pin: true, scrub: true, invalidateOnRefresh: true },
    })
    .fromTo(
      grid,
      { x: 0, y: 0, scale: 1, transformOrigin: () => `${fx()}px ${fy()}px` },
      {
        x: () => section.offsetWidth / 2 - (grid.offsetLeft + fx()),
        y: () => section.offsetHeight / 2 - (grid.offsetTop + fy()),
        scale: zoom,
        ease: 'power1.in',
      },
    )
    .to('.hero__title', { yPercent: -40, opacity: 0, ease: 'none', duration: 0.5 }, 0)
    .to('.hero__meta', { opacity: 0, ease: 'none', duration: 0.3 }, 0);
}
