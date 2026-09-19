/* ==========================================================================
   Khalid Alharbi, portfolio v1: the only JavaScript on the site.
   0. The Download CV button (shown only once the CV file exists).
   1. The hero showcase slider (autoplay, tabs, pause button, arrow keys).
   2. The OnKith masking illustration.
   Without JavaScript the slider still swipes and every slide is readable.
   ========================================================================== */

(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- 0. Download CV button ----------
     The button starts hidden and appears only if the CV file is really there,
     so the live site never shows a button that leads to "page not found".
     To add the CV, upload Khalid-Alharbi-CV.pdf to the root of the repo. */
  document.querySelectorAll('[data-cv]').forEach((button) => {
    fetch(button.href, { method: 'HEAD', cache: 'no-store' })
      .then((response) => { if (response.ok) button.hidden = false; })
      .catch(() => {});
  });

  /* ---------- 1. Showcase slider ---------- */

  const showcase = document.querySelector('[data-showcase]');
  if (showcase) {
    const track = showcase.querySelector('.showcase-track');
    const slides = [...track.querySelectorAll('.slide')];
    const tabList = showcase.querySelector('.tabs');
    const tabs = [...showcase.querySelectorAll('[data-slide]')];
    const thumb = showcase.querySelector('.tab-thumb');
    const progress = showcase.querySelector('.tab-progress');
    const toggle = showcase.querySelector('.play-toggle');
    const autoplay = !reduceMotion.matches;
    let current = -1;
    let elapsed = 0; // ms the current slide has been shown while not held

    // Removing and re-adding a class restarts every CSS animation under it.
    const restart = (el, cls) => {
      el.classList.remove(cls);
      void el.getBoundingClientRect();
      el.classList.add(cls);
    };

    const moveThumb = () => {
      const tab = tabs[current];
      if (!tab) return;
      thumb.style.width = `${tab.offsetWidth}px`;
      thumb.style.transform = `translateX(${tab.offsetLeft}px)`;
    };

    const setCurrent = (index) => {
      if (index === current) return;
      current = index;
      tabs.forEach((tab, n) => tab.setAttribute('aria-current', String(n === index)));
      slides.forEach((slide, n) => {
        const wasShown = slide.getAttribute('aria-hidden') === 'false';
        slide.setAttribute('aria-hidden', String(n !== index));
        // Tell the slide's own demo when it comes into view or leaves.
        if (n === index && !wasShown) slide.dispatchEvent(new CustomEvent('slideenter'));
        if (n !== index && wasShown) slide.dispatchEvent(new CustomEvent('slideleave'));
      });
      moveThumb();

      // Start this slide's demo from the top so each visit shows a full loop.
      const live = slides[index].querySelector('.is-live');
      if (live) restart(live, 'is-live');

      // Reset the progress line instantly, without its easing.
      elapsed = 0;
      progress.style.transition = 'none';
      progress.style.transform = 'scaleX(0)';
      void progress.offsetWidth;
      progress.style.transition = '';
    };

    // While a scroll we started is still travelling, the swipe sync below must
    // not read the halfway position and snap the tabs back.
    let target = null;
    let targetTimer;

    const goTo = (index, smooth = true) => {
      const n = (index + slides.length) % slides.length;
      target = n;
      clearTimeout(targetTimer);
      targetTimer = setTimeout(() => { target = null; }, 1000);
      track.scrollTo({
        left: slides[n].offsetLeft,
        behavior: smooth && !reduceMotion.matches ? 'smooth' : 'instant',
      });
      setCurrent(n);
    };

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
        if (target !== null && nearest !== target) return; // still on its way
        target = null;
        setCurrent(nearest);
      }, 80);
    }, { passive: true });

    // Autoplay. A light timer counts how long the current slide has been on
    // screen, but only while nothing is holding it: hover, keyboard focus,
    // the pause button, the hero scrolled away, or the browser tab hidden.
    if (autoplay) {
      const TICK = 100;
      let hovering = false;
      let keyboard = false;
      let last = performance.now();

      const isHeld = () =>
        hovering || keyboard || document.hidden ||
        showcase.classList.contains('is-paused') ||
        showcase.classList.contains('is-offscreen');

      showcase.addEventListener('mouseenter', () => { hovering = true; });
      showcase.addEventListener('mouseleave', () => { hovering = false; });
      showcase.addEventListener('focusin', (event) => {
        keyboard = event.target.matches(':focus-visible');
      });
      showcase.addEventListener('focusout', (event) => {
        if (!showcase.contains(event.relatedTarget)) keyboard = false;
      });

      setInterval(() => {
        const now = performance.now();
        const step = Math.min(now - last, 250); // no jump after a throttled tab
        last = now;
        if (isHeld()) return;

        elapsed += step;
        const duration = Number(slides[current].dataset.duration) || 9000;
        progress.style.transform = `scaleX(${Math.min(elapsed / duration, 1)})`;
        if (elapsed >= duration) goTo(current + 1);
      }, TICK);

      toggle.addEventListener('click', () => {
        const paused = toggle.getAttribute('aria-pressed') !== 'true';
        toggle.setAttribute('aria-pressed', String(paused));
        // Labels live on the button so each language page supplies its own.
        toggle.setAttribute('aria-label', paused ? toggle.dataset.labelPlay : toggle.dataset.labelPause);
        showcase.classList.toggle('is-paused', paused);
      });

      new IntersectionObserver(([entry]) =>
        showcase.classList.toggle('is-offscreen', !entry.isIntersecting),
        { threshold: 0.35 }).observe(showcase);
    } else {
      toggle.hidden = true;
    }

    window.addEventListener('resize', moveThumb, { passive: true });
    if (document.fonts) document.fonts.ready.then(moveThumb);

    // A link like /#demo-onkith opens straight onto that slide.
    const fromHash = slides.findIndex((slide) => `#${slide.id}` === window.location.hash);
    goTo(Math.max(fromHash, 0), false);

    // Enable the thumb's glide only after it has been placed, so it does not
    // slide in from the left edge on page load.
    setTimeout(() => tabList.classList.add('is-ready'), 60);
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
    } else if (showcase && scan.closest('.slide')) {
      // Inside the slider: restart from the top each time this slide is
      // shown, and stop working while another slide is.
      const slide = scan.closest('.slide');
      slide.addEventListener('slideenter', play);
      slide.addEventListener('slideleave', stop);
      if (slide.getAttribute('aria-hidden') === 'false') play();
    } else {
      new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : stop()),
        { threshold: 0.6 }).observe(scan);
    }
  }
})();
