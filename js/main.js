/* Little Chai Club — UI preview interactions only.
 * The character picker is functional. The friends grid flips to a second pose on hover/tap. Signup forms are visual placeholders;
 * no email is collected or sent by this package.
 */
(() => {
  'use strict';
  const stage = document.querySelector('.stage');
  if (stage) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const friends = JSON.parse(stage.dataset.friends);
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
      thumb.src = actor.src; thumb.alt = ''; thumb.width = actor.width; thumb.height = actor.height;
      button.append(thumb);
      button.addEventListener('click', () => { chosen = true; tag.setAttribute('aria-live', 'polite'); stop(); show(index); });
      picker.append(button); return button;
    });
    function show(index) {
      current = index;
      actors.forEach((actor, i) => { actor.classList.toggle('on', i === index); actor.setAttribute('aria-hidden', String(i !== index)); });
      buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
      stage.style.setProperty('--c', friends[index].c);
      tag.querySelector('b').textContent = friends[index].n;
      tag.querySelector('span').textContent = friends[index].d;
    }
    function stop() { clearInterval(timer); timer = null; }
    function play() {
      if (reduceMotion || chosen || timer) return;
      timer = setInterval(() => {
        const next = (current + 1) % actors.length;
        if (next === 0 && ++rounds >= 2) { stop(); show(0); return; }
        show(next);
      }, 3800);
    }
    stage.addEventListener('mouseenter', stop);
    stage.addEventListener('mouseleave', play);
    stage.addEventListener('focusin', stop);
    stage.addEventListener('focusout', play);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : play()));
    show(0); play();
  }
  /* Friends grid: the second pose shows on hover (CSS). Touch screens and keyboards toggle it instead. */
  const canHover = window.matchMedia('(hover: hover)').matches;
  document.querySelectorAll('.friend .tile').forEach((tile) => {
    const friend = tile.closest('.friend');
    const flip = () => { const on = friend.classList.toggle('alt'); tile.setAttribute('aria-pressed', String(on)); };
    if (!canHover) tile.addEventListener('click', flip);
    tile.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); flip(); }
    });
  });
  document.querySelectorAll('.wl').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const message = form.nextElementSibling;
      if (message && message.classList.contains('wl__msg')) {
        message.textContent = 'Signup is disabled in this UI preview.';
      }
    });
  });
})();