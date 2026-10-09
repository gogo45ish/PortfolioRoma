import gsap from 'gsap';

// [data-parallax] — image drifts inside its frame (yPercent -10 per Figma note).
export function parallax({ reduce }) {
  if (reduce) return;
  gsap.utils.toArray('[data-parallax]').forEach((frame) => {
    const img = frame.querySelector('img');
    gsap.fromTo(
      img,
      { yPercent: 0 },
      { yPercent: -10, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  });
}
