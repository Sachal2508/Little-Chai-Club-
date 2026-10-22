/* Little Chai Club — UI interactions.
 * - Stage character picker with pop-up plushies & auto-cycle
 * - Animated circular ripple menu overlay
 * - Bottom plushie cards side-flip on hover/tap
 * - Back-to-top mascot button with smooth scroll
 * - Signup form placeholders
 */
(() => {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 1. Hero Stage: character picker & pop-up plushies ---- */
  const stage = document.querySelector('.stage');
  if (stage) {
    try {
      const friends = JSON.parse(stage.dataset.friends || '[]');
      const actors = [...stage.querySelectorAll('.actor')];
      const tag = stage.querySelector('.tag');
      const picker = stage.querySelector('.picker');
      let current = 0, timer = null, rounds = 0, chosen = false;

      const buttons = actors.map((actor, index) => {
        const button = document.createElement('button');
        const thumb = document.createElement('img');
        button.type = 'button';
        button.setAttribute('aria-label', `Meet ${friends[index].n}`);
        button.style.setProperty('--c', friends[index].c);
        thumb.src = actor.src;
        thumb.alt = '';
        thumb.width = actor.width;
        thumb.height = actor.height;
        button.append(thumb);
        button.addEventListener('click', () => {
          chosen = true;
          if (tag) tag.setAttribute('aria-live', 'polite');
          stop();
          show(index);
        });
        if (picker) picker.append(button);
        return button;
      });

      function show(index) {
        current = index;
        actors.forEach((actor, i) => {
          const isActive = i === index;
          actor.classList.toggle('on', isActive);
          actor.setAttribute('aria-hidden', String(!isActive));
          if (isActive) {
            // Trigger fresh pop animation
            actor.style.animation = 'none';
            void actor.offsetWidth;
            actor.style.animation = '';
          }
        });
        buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
        if (friends[index]) {
          stage.style.setProperty('--c', friends[index].c);
          if (tag) {
            const b = tag.querySelector('b');
            const span = tag.querySelector('span');
            if (b) b.textContent = friends[index].n;
            if (span) span.textContent = friends[index].d;
          }
        }
      }

      function stop() { clearInterval(timer); timer = null; }
      function play() {
        if (reduceMotion || chosen || timer || !actors.length) return;
        timer = setInterval(() => {
          const next = (current + 1) % actors.length;
          if (next === 0 && ++rounds >= 2) { stop(); show(0); return; }
          show(next);
        }, 3600);
      }

      stage.addEventListener('mouseenter', stop);
      stage.addEventListener('mouseleave', play);
      stage.addEventListener('focusin', stop);
      stage.addEventListener('focusout', play);
      document.addEventListener('visibilitychange', () => (document.hidden ? stop() : play()));
      show(0);
      play();
    } catch (e) {
      console.warn('Stage initialization error:', e);
    }
  }

  /* ---- 2. Menu button & circular ripple navigation ---- */
  const mb = document.getElementById('mb');
  const nv = document.getElementById('nv');
  const root = document.documentElement;

  function toggleMenu(open) {
    if (!mb || !nv) return;
    const rect = mb.getBoundingClientRect();
    nv.style.setProperty('--cx', (rect.left + rect.width / 2) + 'px');
    nv.style.setProperty('--cy', (rect.top + rect.height / 2) + 'px');
    nv.classList.toggle('open', open);
    root.classList.toggle('menu-open', open);
    nv.inert = !open;
    mb.setAttribute('aria-expanded', String(open));
    mb.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mb.classList.remove('hop');
    void mb.offsetWidth;
    mb.classList.add('hop');
  }

  if (mb && nv) {
    nv.inert = true;
    mb.addEventListener('click', () => {
      toggleMenu(!nv.classList.contains('open'));
    });
    nv.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => toggleMenu(false));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nv.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }

  /* ---- 3. Bottom plushies cards: tap/click to switch pose / direction ---- */
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('alt');
    });
  });

  /* ---- 4. Reveal elements on scroll ---- */
  const revealElements = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('in', entry.isIntersecting);
      });
    }, { threshold: 0.15 });
    revealElements.forEach((el) => io.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('in'));
  }

  /* ---- 5. Back-to-top button ---- */
  const btt = document.getElementById('btt');
  if (btt) {
    let queued = false;
    const place = () => {
      queued = false;
      btt.classList.toggle('show', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(place);
      }
    }, { passive: true });
    place();
    btt.addEventListener('click', () => {
      btt.classList.remove('hop');
      void btt.offsetWidth;
      btt.classList.add('hop');
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---- 6. Waitlist forms ---- */
  document.querySelectorAll('.wl').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const message = form.nextElementSibling;
      if (message && message.classList.contains('wl__msg')) {
        message.textContent = 'Welcome to the club! You are on our early access list.';
      }
      form.reset();
    });
  });
})();
