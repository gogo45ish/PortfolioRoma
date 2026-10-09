import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { stagger } from './tokens.js';

// Statement words shift from dim to full ink as you read down. Colours come from the palette tokens.
export function statement({ reduce }) {
  const el = document.querySelector('[data-statement]');
  if (!el || reduce) return;
  const css = getComputedStyle(document.documentElement);
  const token = (name) => css.getPropertyValue(name).trim();
  SplitText.create(el, {
    type: 'words',
    autoSplit: true,
    onSplit: (self) =>
      gsap.fromTo(
        self.words,
        { color: token('--dim') },
        {
          color: (i, word) => token(word.closest('.serif') ? '--accent' : '--fg'), // emphasised words land in brass
          ease: 'none',
          stagger: stagger.words,
          scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 50%', scrub: true },
        },
      ),
  });
}
