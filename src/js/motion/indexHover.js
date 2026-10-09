import gsap from 'gsap';
import { dur, ease } from './tokens.js';

// Index list: a preview image follows the cursor (fine-pointer hover devices only).
export function indexHover({ hover, reduce }) {
  const lists = document.querySelectorAll('.index-list');
  if (!lists.length || !hover || reduce) return;

  const preview = document.createElement('div');
  preview.className = 'preview media';
  preview.setAttribute('aria-hidden', 'true');
  document.body.append(preview);

  const imgs = new Map();
  const xTo = gsap.quickTo(preview, 'x', { duration: 0.6, ease: 'power3' });
  const yTo = gsap.quickTo(preview, 'y', { duration: 0.6, ease: 'power3' });

  const pointer = { x: -1, y: -1 };
  const onMove = (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    xTo(e.clientX);
    yTo(e.clientY);
  };
  // Content scrolls under a still cursor without firing pointer events — re-check what's beneath it.
  const onScroll = () => {
    const row = document.elementFromPoint(pointer.x, pointer.y)?.closest('.index-list [data-preview]');
    row ? show(row.dataset.preview) : hide();
  };
  window.addEventListener('pointermove', onMove);
  window.addEventListener('scroll', onScroll, { passive: true });

  let current = null;
  const show = (src) => {
    if (src === current) return;
    current = src;
    if (!imgs.has(src)) {
      const img = new Image();
      img.src = src;
      img.alt = '';
      preview.append(img);
      imgs.set(src, img);
    }
    imgs.forEach((img, key) => img.classList.toggle('is-active', key === src));
    gsap.to(preview, { opacity: 1, scale: 1, duration: dur.fast, ease: ease.out, overwrite: 'auto' });
  };
  const hide = () => {
    if (current === null) return;
    current = null;
    gsap.to(preview, { opacity: 0, scale: 0.9, duration: dur.fast, ease: ease.out, overwrite: 'auto' });
  };

  const cleanups = [];
  lists.forEach((list) => {
    const enter = (e) => {
      const row = e.target.closest('[data-preview]');
      if (row) show(row.dataset.preview);
    };
    list.addEventListener('pointerover', enter);
    list.addEventListener('pointerleave', hide);
    cleanups.push(() => { list.removeEventListener('pointerover', enter); list.removeEventListener('pointerleave', hide); });
  });

  return () => {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('scroll', onScroll);
    cleanups.forEach((fn) => fn());
    preview.remove();
  };
}
