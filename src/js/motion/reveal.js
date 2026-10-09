import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ease, dur, stagger } from './tokens.js';

// [data-reveal] — items fade up in batches as they enter.
export function reveal({ reduce }) {
  const items = gsap.utils.toArray('[data-reveal]');
  if (!items.length) return;
  if (reduce) return gsap.set(items, { opacity: 1 });
  gsap.set(items, { opacity: 0, y: 40 });
  ScrollTrigger.batch(items, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: dur.base, ease: ease.out, stagger: stagger.items }),
  });
}

// [data-split] — headings rise line by line from behind a mask.
// [data-split="load"] plays immediately instead of on scroll.
export function splitLines({ reduce }) {
  if (reduce) return;
  gsap.utils.toArray('[data-split]').forEach((el) => {
    const onLoad = el.dataset.split === 'load';
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit: (self) => {
        // from() renders the hidden start state immediately, so it's safe to un-hide the heading now.
        const tween = gsap.from(self.lines, {
          yPercent: 110,
          duration: dur.slow,
          ease: ease.reveal,
          stagger: stagger.items,
          delay: onLoad ? 0.15 : 0,
          scrollTrigger: onLoad ? undefined : { trigger: el, start: 'top 88%', once: true },
        });
        gsap.set(el, { visibility: 'visible' });
        return tween;
      },
    });
  });
}
