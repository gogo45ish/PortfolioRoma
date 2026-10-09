import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const page = (name) => resolve(import.meta.dirname, `${name}.html`);

// Vite rewrites the entry <script> on build and drops `blocking="render"`; put it back so the
// browser doesn't paint until nav/footer/data-driven content are in place (no half-built flash).
const renderBlockingEntry = () => ({
  name: 'render-blocking-entry',
  apply: 'build',
  transformIndexHtml: {
    order: 'post',
    handler: (html) =>
      html.replace(/<script type="module"(?![^>]*\bblocking=)([^>]*)><\/script>/g, '<script type="module" blocking="render"$1></script>'),
  },
});

export default defineConfig({
  // Relative asset URLs: works at gogo45ish.github.io/<repo>/ or any other subpath.
  base: './',
  plugins: [renderBlockingEntry()],
  build: {
    rollupOptions: {
      input: {
        main: page('index'),
        work: page('work'),
        project: page('project'),
        about: page('about'),
        contact: page('contact'),
      },
    },
  },
});
