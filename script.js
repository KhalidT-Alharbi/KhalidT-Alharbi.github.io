/* ==========================================================================
   Khalid Alharbi, portfolio v1: the only JavaScript on the site.
   1. The hero showcase slider (tabs, arrows, arrow keys).
   2. The OnKith masking illustration.
   Without JavaScript the slider still swipes and every slide is readable.
   ========================================================================== */

(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- 1. Showcase slider ---------- */

  const showcase = document.querySelector('[data-showcase]');
  if (showcase) {
    const track = showcase.querySelector('.showcase-track');
    const slides = [...track.querySelectorAll('.slide')];
    const tabs = [...showcase.querySelectorAll('[data-slide]')];
    let current = 0;

    const setCurrent = (index) => {
      current = index;
      tabs.forEach((tab, n) => tab.setAttribute('aria-current', String(n === index)));
      slides.forEach((slide, n) => slide.setAttribute('aria-hidden', String(n !== index)));
    };

    const goTo = (index, smooth = true) => {
      const n = (index + slides.length) % slides.length;
      track.scrollTo({
        left: slides[n].offsetLeft,
        behavior: smooth && !reduceMotion.matches ? 'smooth' : 'instant',
      });
      setCurrent(n);
    };

    showcase.querySelectorAll('[data-step]').forEach((button) =>
      button.addEventListener('click', () => goTo(current + Number(button.dataset.step))));

    tabs.forEach((tab) =>
      tab.addEventListener('click', () => goTo(Number(tab.dataset.slide))));

    track.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') { event.preventDefault(); goTo(current + 1); }
      if (event.key === 'ArrowLeft')  { event.preventDefault(); goTo(current - 1); }
    });

    // Keep the tabs in sync when the visitor swipes instead of clicking.
    let settle;
    track.addEventListener('scroll', () => {
      clearTimeout(settle);
      settle = setTimeout(() => {
        const nearest = slides.reduce((best, slide, n) =>
          Math.abs(slide.offsetLeft - track.scrollLeft) <
          Math.abs(slides[best].offsetLeft - track.scrollLeft) ? n : best, 0);
        if (nearest !== current) setCurrent(nearest);
      }, 80);
    }, { passive: true });

    // A link like /#demo-onkith opens straight onto that slide.
    const fromHash = slides.findIndex((slide) => `#${slide.id}` === window.location.hash);
    setCurrent(0);
    if (fromHash > 0) goTo(fromHash, false);
  }

  /* ---------- 2. OnKith masking illustration ----------
     One 10 second loop: a red line sweeps down and lights up each piece of
     personal information it passes, then a copper line sweeps down and
     replaces each one with its entity label.

     The line itself is a CSS animation (styles.css, `scan-sweep`); this
     code only decides which words are lit or masked, on a light timer.
     Keep these numbers in step with the percentages in `scan-sweep`. */

  const scan = document.querySelector('[data-scan]');
  if (scan) {
    const body = scan.querySelector('.scan-body');
    const line = scan.querySelector('.scan-line');
    const status = scan.querySelector('.scan-status');
    const items = [...scan.querySelectorAll('.pii')];

    const CYCLE = 10000;      // 100%
    const DETECT_END = 3500;  // 35%
    const MASK_START = 4200;  // 42%
    const MASK_END = 7200;    // 72%
    const RESET_AT = 9400;
    const TICK = 50;

    const labels = {
      listening: 'listening',
      detect: 'scanning for PII',
      found: `${items.length} PII found`,
      mask: 'masking on device',
      safe: 'safe to send',
    };

    const found = new Set();
    const masked = new Set();
    let start = 0;
    let timer = 0;
    let lastCycle = -1;
    let lastPhase = '';

    // Where an item sits, as a fraction of the text block's height.
    // Measured every tick, because masking a word can reflow the lines after it.
    const markOf = (el) => (el.offsetTop + el.offsetHeight / 2) / (body.offsetHeight || 1);

    const setPhase = (phase) => {
      if (phase === lastPhase) return;
      lastPhase = phase;
      scan.dataset.phase = phase;
      status.textContent = labels[phase];
    };

    const restartLine = () => {
      line.classList.remove('is-running');
      void line.offsetWidth; // force a style flush so the animation restarts
      line.classList.add('is-running');
    };

    const tick = () => {
      const elapsed = performance.now() - start;
      const cycle = Math.floor(elapsed / CYCLE);
      const t = elapsed % CYCLE;

      if (cycle !== lastCycle) {
        lastCycle = cycle;
        found.clear();
        masked.clear();
        restartLine();
      }

      let phase = 'listening';
      let pos = 0;
      if (t < DETECT_END)      { phase = 'detect'; pos = t / DETECT_END; }
      else if (t < MASK_START) { phase = 'found';  pos = 1; }
      else if (t < MASK_END)   { phase = 'mask';   pos = (t - MASK_START) / (MASK_END - MASK_START); }
      else if (t < RESET_AT)   { phase = 'safe';   pos = 1; }

      if (phase === 'listening') {
        found.clear();
        masked.clear();
      } else {
        items.forEach((el, i) => {
          // Once lit or masked, an item stays that way for the rest of the loop.
          if (phase !== 'detect' || markOf(el) <= pos) found.add(i);
          if (phase === 'safe' || (phase === 'mask' && markOf(el) <= pos)) masked.add(i);
        });
      }

      items.forEach((el, i) => {
        el.classList.toggle('is-found', found.has(i) && !masked.has(i));
        el.classList.toggle('is-masked', masked.has(i));
      });

      setPhase(phase);
    };

    const play = () => {
      clearInterval(timer);
      start = performance.now();
      lastCycle = -1;
      tick();
      timer = setInterval(tick, TICK);
    };

    const stop = () => {
      clearInterval(timer);
      line.classList.remove('is-running');
    };

    if (reduceMotion.matches) {
      // One still, readable frame: everything already masked.
      items.forEach((el) => el.classList.add('is-masked'));
      setPhase('safe');
    } else {
      // Restart from the top each time the slide comes into view, and
      // stop working while it is off screen.
      new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : stop()),
        { threshold: 0.6 }).observe(scan);
    }
  }
})();
