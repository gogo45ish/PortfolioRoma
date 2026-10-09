import gsap from 'gsap';

// Hero pins while the photo opens from a small frame to full-bleed.
export function hero({ desktop, reduce }) {
  const section = document.querySelector('.hero');
  if (!section || !desktop || reduce) return;
  gsap
    .timeline({
      scrollTrigger: { trigger: section, start: 'top top', end: '+=120%', pin: true, scrub: true },
    })
    .fromTo('.hero__media', { clipPath: 'inset(12% 35% 27% 35%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' })
    .fromTo('.hero__media img', { scale: 1.25 }, { scale: 1, ease: 'none' }, 0)
    .to('.hero__title', { yPercent: -30, opacity: 0, ease: 'none', duration: 0.6 }, 0)
    .to('.hero__meta', { opacity: 0, ease: 'none', duration: 0.3 }, 0);
}
