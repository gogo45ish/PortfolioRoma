import gsap from 'gsap';

// Project page: "next project" pins; a scrubbed bar fills, then we navigate.
export function nextProject({ desktop, reduce }) {
  const section = document.querySelector('.next');
  if (!section || !desktop || reduce) return;
  const href = section.querySelector('a').href;
  let leaving = false;

  const go = () => {
    leaving = true;
    gsap.to('.next__media', {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 0.6,
      ease: 'power3.inOut',
      onComplete: () => location.assign(href),
    });
  };

  gsap
    .timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=100%',
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          if (!leaving && self.progress > 0.985 && self.direction === 1) go();
        },
      },
    })
    .fromTo('.next__bar', { scaleX: 0 }, { scaleX: 1, ease: 'none' })
    .fromTo('.next__media', { clipPath: 'inset(20% 30% 20% 30%)' }, { clipPath: 'inset(10% 15% 10% 15%)', ease: 'none' }, 0);
}
