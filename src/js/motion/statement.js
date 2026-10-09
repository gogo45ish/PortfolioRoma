import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { stagger } from './tokens.js';

// Statement words shift from muted to ink as you read down.
export function statement({ reduce }) {
  const el = document.querySelector('[data-statement]');
  if (!el || reduce) return;
  SplitText.create(el, {
    type: 'words',
    autoSplit: true,
    onSplit: (self) =>
      gsap.fromTo(
        self.words,
        { color: '#c4c0b8' },
        {
          color: '#111111',
          ease: 'none',
          stagger: stagger.words,
          scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 50%', scrub: true },
        },
      ),
  });
}
