import gsap from 'gsap';

// Selected work: section pins and the track scrolls sideways (desktop only;
// mobile falls back to native horizontal scroll-snap in CSS).
export function strip({ desktop, reduce }) {
  const section = document.querySelector('.strip');
  if (!section || !desktop || reduce) return;
  const track = section.querySelector('.strip__track');
  const distance = () => track.scrollWidth - window.innerWidth + 80;
  gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${distance()}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });
}
