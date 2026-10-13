/* Little Chai Club — hero door scene.
 * Moving ring text, scroll-driven door opening (screen stays pinned until the door is open),
 * plushies popping out, side ropes, and hover/tap greetings. No dependencies, no network calls.
 */
(function () {
  'use strict';
  var tp = document.getElementById('top');
  if (!tp || !tp.classList.contains('dh')) return;
  var NS = 'http://www.w3.org/2000/svg';
  var rm = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var stg = tp.querySelector('.dh-stage'), fit = tp.querySelector('.dh-fit'), sc = tp.querySelector('.dh-scene');
  var ar = sc.querySelector('.dh-arch'), sp = ar.querySelector('.dh-shape'), fm = ar.querySelector('form'), room = ar.querySelector('.dh-room');

  /* ---------- 1. Moving ring text around the arch ---------- */
  (function ring() {
    var svg = sc.querySelector('.dh-ring'), path = document.getElementById('dh-c'), scene = sc,
      TXT = 'PLUSH TOYS ✦ SOFT & CUDDLY ✦ SMALL BATCH ✦ HUGS INCLUDED ✦ ', L = 1, off = 0, vis = true;
    function sh(x0, x1, t, b) {
      var W = x1 - x0, P = function (a, c) { return (x0 + a * W).toFixed(2) + ' ' + (t + c * W).toFixed(2); };
      return 'M' + P(0, 0).split(' ')[0] + ' ' + b + 'V' + (t + .52 * W).toFixed(2) + 'C' + P(0, .335) + ' ' + P(.126, .2) + ' ' + P(.28, .2) + 'C' + P(.285, .145) + ' ' + P(.33, .09) + ' ' + P(.41, .07) + 'C' + P(.46, .055) + ' ' + P(.49, .03) + ' ' + P(.5, 0) + 'C' + P(.51, .03) + ' ' + P(.54, .055) + ' ' + P(.59, .07) + 'C' + P(.67, .09) + ' ' + P(.715, .145) + ' ' + P(.72, .2) + 'C' + P(.874, .2) + ' ' + P(1, .335) + ' ' + P(1, .52) + 'V' + b;
    }
    function ringD(h) {
      var tp2 = document.createElementNS(NS, 'path'); tp2.setAttribute('d', sh(0, 100, 0, h));
      var n = Math.round(tp2.getTotalLength()), O = [], i, j, k;
      for (i = 0; i <= n; i++) { var q = tp2.getPointAtLength(i * tp2.getTotalLength() / n); O.push([q.x, q.y]); }
      function sm(A, r, t) {
        for (var z = 0; z < t; z++) {
          var B = [];
          for (i = 0; i < A.length; i++) {
            var sx = 0, sy = 0, c = 0;
            for (j = -r; j <= r; j++) { k = Math.min(A.length - 1, Math.max(0, i + j)); sx += A[k][0]; sy += A[k][1]; c++; }
            B.push([sx / c, sy / c]);
          }
          A = B;
        }
        return A;
      }
      var S = sm(O, 9, 3), D = [], P = [];
      for (i = 0; i < S.length; i++) {
        var a = S[Math.max(0, i - 2)], b = S[Math.min(S.length - 1, i + 2)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = dy / l, ny = -dx / l, d = 5.8;
        for (; d < 24; d += .5) {
          var px = S[i][0] + nx * d, py = S[i][1] + ny * d, m = 1e9;
          for (j = 0; j < O.length; j += 2) { var e = Math.hypot(px - O[j][0], py - O[j][1]); if (e < m) m = e; }
          if (m >= 5.5) break;
        }
        D.push([nx, ny, d]);
      }
      var dd = sm(D.map(function (v) { return [v[2], 0]; }), 6, 2);
      for (i = 0; i < S.length; i++) P.push([S[i][0] + D[i][0] * dd[i][0], S[i][1] + D[i][1] * dd[i][0]]);
      P = sm(P, 4, 2);
      return 'M' + P.map(function (q) { return q[0].toFixed(2) + ' ' + q[1].toFixed(2); }).join('L');
    }
    function mk() {
      var t = document.createElementNS(NS, 'text'), p = document.createElementNS(NS, 'textPath');
      p.setAttribute('href', '#dh-c'); t.appendChild(p); svg.appendChild(t); return [t, p];
    }
    var A = mk(), B = mk(), ta = A[0], pa = A[1], tb = B[0], pb = B[1];
    function set(o) { pa.setAttribute('startOffset', o); pb.setAttribute('startOffset', o - L); }
    function layout() {
      var r = scene.getBoundingClientRect(); if (!r.width) return;
      var h = (100 * r.height / r.width).toFixed(2);
      svg.setAttribute('viewBox', '0 0 100 ' + h); path.setAttribute('d', ringD(+h));
      var u = 100 / r.width, F = sp.querySelector('.f'), O = sp.querySelector('.o'), I = sp.querySelector('.i');
      sp.setAttribute('viewBox', '0 0 100 ' + h);
      F.setAttribute('d', sh(0, 100, 0, h) + 'Z'); O.setAttribute('d', sh(0, 100, 0, h) + 'Z'); I.setAttribute('d', sh(3.4, 96.6, 3.6, h - 3.4) + 'Z');
      O.style.strokeWidth = 5 * u; I.style.strokeWidth = 1.6 * u;
      L = path.getTotalLength();
      pa.textContent = TXT; ta.style.letterSpacing = '0px';
      var one = ta.getComputedTextLength() || 60, n = Math.max(1, Math.round(L / one)), txt = TXT.repeat(n);
      pa.textContent = pb.textContent = txt; ta.style.letterSpacing = tb.style.letterSpacing = '0px';
      var ls = (L - ta.getComputedTextLength()) / Array.from(txt).length;
      ta.style.letterSpacing = tb.style.letterSpacing = ls + 'px'; set(off);
    }
    function go() {
      layout(); if (rm) return;
      var lt = 0;
      (function tick(t) {
        if (vis && t - lt > 33) { lt = t; off = (t / 1000 * (L / 28)) % L; set(off); }
        requestAnimationFrame(tick);
      })(0);
      new ResizeObserver(layout).observe(scene);
    }
    new IntersectionObserver(function (e) { vis = e[0].isIntersecting; }).observe(scene);
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(go);
  })();

  /* ---------- 2. Door, pinned scroll, plushies popping out ---------- */
  var dr, pw = [].slice.call(sc.querySelectorAll('.dh-pw'));
  (function door() {
    function sh(x0, x1, t, b) {
      var W = x1 - x0, P = function (a, c) { return (x0 + a * W).toFixed(1) + ' ' + (t + c * W).toFixed(1); };
      return 'M' + x0 + ' ' + b + 'V' + (t + .52 * W).toFixed(1) + 'C' + P(0, .335) + ' ' + P(.126, .2) + ' ' + P(.28, .2) + 'C' + P(.285, .145) + ' ' + P(.33, .09) + ' ' + P(.41, .07) + 'C' + P(.46, .055) + ' ' + P(.49, .03) + ' ' + P(.5, 0) + 'C' + P(.51, .03) + ' ' + P(.54, .055) + ' ' + P(.59, .07) + 'C' + P(.67, .09) + ' ' + P(.715, .145) + ' ' + P(.72, .2) + 'C' + P(.874, .2) + ' ' + P(1, .335) + ' ' + P(1, .52) + 'V' + b;
    }
    function half(w, h, f) {
      var X = function (a) { var x = f ? w - a * w : a * w; if (a === .5) x += f ? -1 : 1; return x.toFixed(1); }, Y = function (c) { return (c * w).toFixed(1); };
      return 'M' + X(0) + ' ' + h + 'V' + Y(.52) + 'C' + X(0) + ' ' + Y(.335) + ' ' + X(.126) + ' ' + Y(.2) + ' ' + X(.28) + ' ' + Y(.2) + 'C' + X(.285) + ' ' + Y(.145) + ' ' + X(.33) + ' ' + Y(.09) + ' ' + X(.41) + ' ' + Y(.07) + 'C' + X(.46) + ' ' + Y(.055) + ' ' + X(.49) + ' ' + Y(.03) + ' ' + X(.5) + ' 0V' + h + 'Z';
    }
    /* windows in the doors: Chai Cup on the left door, Jalebi on the right */
    var pals = pw.map(function (w) { return w.querySelector('img').src; }), WX = 28.5, WY = 94, WR = 15.5;
    dr = document.createElement('div'); dr.className = 'dh-door'; dr.setAttribute('aria-hidden', 'true');
    dr.innerHTML = '<div class="dh-lf"><svg></svg><b class="dh-sh"></b></div><div class="dh-rf"><svg></svg><b class="dh-sh"></b></div><div class="dh-dtx"><b>Our doors are<br><em>always open</em></b><small>Scroll to open &darr;</small></div>';
    var fr = document.createElementNS(NS, 'svg'); fr.setAttribute('class', 'dh-fr'); fr.setAttribute('aria-hidden', 'true');
    ar.appendChild(dr); ar.appendChild(fr);
    var L = dr.children[0], R = dr.children[1];
    function sync() {
      var w = ar.offsetWidth, h = ar.offsetHeight; if (!w) return;
      var u = w / 100, m = w / 2, tall = h >= 172 * u, cw = (tall ? WY * u : (66 * u + h) / 2 - 2 * u);
      var hp = function (cx, cy, s, fill) { return '<path transform="translate(' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ') scale(' + s.toFixed(2) + ')" d="M0 .9C-1.3-.1-.9-1-.4-1C-.15-1 0-.8 0-.65C0-.8 .15-1 .4-1C.9-1 1.3-.1 0 .9Z" fill="' + fill + '"/>'; },
        st = function (cx, cy, s) { return '<path d="M' + cx + ' ' + (cy - s) + 'Q' + cx + ' ' + cy + ' ' + (cx + s) + ' ' + cy + 'Q' + cx + ' ' + cy + ' ' + cx + ' ' + (cy + s) + 'Q' + cx + ' ' + cy + ' ' + (cx - s) + ' ' + cy + 'Q' + cx + ' ' + cy + ' ' + cx + ' ' + (cy - s) + 'Z" fill="#F2A93B"/>'; };
      [L, R].forEach(function (el, f) {
        var s = el.firstChild, x0 = f ? m : 0, pl = '', fl = '', kx = (m + (f ? 3.4 : -3.4) * u).toFixed(1), ky = cw.toFixed(1);
        for (var k = 1; k < 8; k++) pl += '<path d="M' + (x0 + k * m / 8).toFixed(1) + ' 0V' + h + '" stroke="#EBD3BF" stroke-width="' + (.5 * u).toFixed(1) + '"/>';
        for (var a = 0; a < 8; a++) {
          var r = a * .7854;
          fl += '<ellipse cx="' + (50 * u + Math.cos(r) * 2.9 * u).toFixed(1) + '" cy="' + (22 * u + Math.sin(r) * 2.9 * u).toFixed(1) + '" rx="' + (1.7 * u).toFixed(1) + '" ry="' + (1.1 * u).toFixed(1) + '" transform="rotate(' + (a * 45) + ' ' + (50 * u + Math.cos(r) * 2.9 * u).toFixed(1) + ' ' + (22 * u + Math.sin(r) * 2.9 * u).toFixed(1) + ')" fill="#F5B9A8"/>';
        }
        var cy = tall ? Math.max(cw + 46 * u, h * .74) : h * 4, rw = WR * u, wx = (f ? 100 - WX : WX) * u, pi = pals[f ? 0 : 1], gl = f ? '#F6D5DC' : '#FFF3EA', gid = 'dh-gw' + f, iw = 24.5 * u,
          win = '<defs><clipPath id="' + gid + '"><circle cx="' + wx.toFixed(1) + '" cy="' + cw.toFixed(1) + '" r="' + (rw - 2.6 * u).toFixed(1) + '"/></clipPath></defs>' +
            '<circle cx="' + wx.toFixed(1) + '" cy="' + cw.toFixed(1) + '" r="' + rw.toFixed(1) + '" fill="#D9776B"/>' +
            '<circle cx="' + wx.toFixed(1) + '" cy="' + cw.toFixed(1) + '" r="' + (rw - 2.6 * u).toFixed(1) + '" fill="' + gl + '"/>' +
            '<g clip-path="url(#' + gid + ')"><image href="' + pi + '" x="' + (wx - iw / 2).toFixed(1) + '" y="' + (cw + 11.5 * u - iw).toFixed(1) + '" width="' + iw.toFixed(1) + '" height="' + iw.toFixed(1) + '" preserveAspectRatio="xMidYMax meet"/>' +
            '<rect x="' + (wx - rw).toFixed(1) + '" y="' + (cw + 8 * u).toFixed(1) + '" width="' + (2 * rw).toFixed(1) + '" height="' + (rw).toFixed(1) + '" fill="#D9776B"/>' +
            '<path d="M' + (wx - rw).toFixed(1) + ' ' + (cw + 8 * u).toFixed(1) + 'H' + (wx + rw).toFixed(1) + '" stroke="#F2A93B" stroke-width="' + (1 * u).toFixed(1) + '"/></g>';
        el.style.clipPath = "path('" + half(w, h, f) + "')"; s.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        s.innerHTML = pl +
          '<path d="' + sh(4 * u, 96 * u, 5.2 * u, h + 30) + '" fill="none" stroke="#D9776B" stroke-width="' + (2.6 * u).toFixed(1) + '" stroke-linejoin="round"/>' +
          '<path d="' + sh(9.5 * u, 90.5 * u, 12 * u, h + 30) + '" fill="none" stroke="#F2A93B" stroke-width="' + (1.5 * u).toFixed(1) + '" stroke-dasharray="0 ' + (3.4 * u).toFixed(1) + '" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<path d="' + sh(13 * u, 87 * u, 16 * u, h + 30) + '" fill="none" stroke="#F5B9A8" stroke-width="' + (.8 * u).toFixed(1) + '" stroke-linejoin="round"/>' +
          fl +
          '<circle cx="' + 50 * u + '" cy="' + 22 * u + '" r="' + (1.6 * u).toFixed(1) + '" fill="#F2A93B"/>' +
          win +
          '<circle cx="' + 50 * u + '" cy="' + cy.toFixed(1) + '" r="' + (21 * u).toFixed(1) + '" fill="#D9776B"/><circle cx="' + 50 * u + '" cy="' + cy.toFixed(1) + '" r="' + (17.5 * u).toFixed(1) + '" fill="#FFF3EA"/><circle cx="' + 50 * u + '" cy="' + cy.toFixed(1) + '" r="' + (17.5 * u).toFixed(1) + '" fill="none" stroke="#F2A93B" stroke-width="' + (1.2 * u).toFixed(1) + '" stroke-dasharray="0 ' + (3 * u).toFixed(1) + '" stroke-linecap="round"/>' +
          hp(50 * u, cy - 1.5 * u, 9 * u, '#D9776B') +
          st(22 * u, cy - 34 * u, 2.6 * u) + st(78 * u, cy - 30 * u, 2.2 * u) + st(24 * u, cy + 38 * u, 2.2 * u) + st(77 * u, cy + 36 * u, 2.6 * u) +
          '<circle cx="' + kx + '" cy="' + ky + '" r="' + (2.4 * u).toFixed(1) + '" fill="#F2A93B"/><circle cx="' + kx + '" cy="' + ky + '" r="' + (1 * u).toFixed(1) + '" fill="#FFF3EA"/>';
      });
      fr.setAttribute('viewBox', sp.getAttribute('viewBox') || ('0 0 100 ' + (100 * h / w))); fr.innerHTML = sp.innerHTML; dr.classList.add('ready');
    }
    var st; function rs() { clearTimeout(st); st = setTimeout(sync, 160); }
    new ResizeObserver(rs).observe(ar); setTimeout(sync, 300); setTimeout(sync, 1500);
  })();

  /* ---------- 3. Pinned scroll: spring-driven door opening ---------- */
  var x = 0, v = 0, raf = 0, last = 0;
  var cl = function (q) { return Math.max(0, Math.min(1, q)); }, ez = function (q) { return q * q * (3 - 2 * q); }, ob = function (q) { var c = 1.6, d = q - 1; return 1 + (c + 1) * d * d * d + c * d * d; };
  if (!rm) tp.classList.add('dh--pinned');
  var run = function () { return Math.max(1, tp.offsetHeight - stg.offsetHeight - (parseFloat(getComputedStyle(tp).paddingBottom) || 0)); };
  var dist = function () { return run() * .8; }, pr = function () { return cl(-tp.getBoundingClientRect().top / dist()); };

  /* scale the scene to fit the screen under the fixed header; also tells the ropes how much side room there is */
  function fitIt() {
    fit.style.setProperty('--fs', 1); fit.style.setProperty('--fy', '0px');
    var pt = parseFloat(getComputedStyle(stg).paddingTop) || 0, H = fit.offsetHeight, A = stg.clientHeight - pt - 6, s = Math.min(1, A / H);
    if (!tp.classList.contains('dh--pinned')) s = 1;
    fit.style.setProperty('--fs', s.toFixed(4));
    fit.style.setProperty('--fy', (tp.classList.contains('dh--pinned') ? Math.max(0, (A - H * s) / 2) : 0).toFixed(1) + 'px');
    var side = (stg.clientWidth - sc.getBoundingClientRect().width) / 2;
    stg.style.setProperty('--side', Math.max(0, side).toFixed(0) + 'px');
    stg.classList.toggle('dh-ropes', side >= 170);
  }
  fitIt(); addEventListener('resize', fitIt); new ResizeObserver(fitIt).observe(fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitIt);
  setTimeout(fitIt, 400); setTimeout(fitIt, 1600);

  function draw(p) {
    var e = ez(cl(p / .9)), L = dr.children[0], R = dr.children[1], tx = dr.children[2];
    L.style.transform = 'rotateY(' + (e * 84).toFixed(2) + 'deg)'; R.style.transform = 'rotateY(' + (-e * 84).toFixed(2) + 'deg)';
    L.lastChild.style.opacity = R.lastChild.style.opacity = (e * .42).toFixed(3);
    var fo = cl((e - .8) / .2); L.style.opacity = R.style.opacity = (1 - fo).toFixed(3);
    dr.style.visibility = fo >= 1 ? 'hidden' : ''; tx.style.opacity = cl(1 - p * 3.2).toFixed(2);
    pw.forEach(function (w, i) {
      var q = cl((p - .28 - i * .1) / .4), o = ob(q);
      w.style.opacity = cl(q * 3).toFixed(2);
      w.style.transform = 'translateY(' + ((1 - o) * 40).toFixed(1) + '%) scale(' + (.5 + .5 * o).toFixed(3) + ') rotate(var(--r,0deg))';
    });
    sc.classList.toggle('dh-live', p > .95); dr.classList.toggle('opened', p > .4);
    if (fm) fm.inert = p < .5;
  }
  function tick(t) {
    var dt = Math.min(.034, (t - last) / 1000 || .016), g = pr(), n = Math.ceil(dt / .008), hh = dt / n, K = 60, C = 1.85 * Math.sqrt(K);
    last = t;
    for (var i = 0; i < n; i++) { v += (-K * (x - g) - C * v) * hh; x += v * hh; }
    x = cl(x); draw(x);
    if (Math.abs(x - g) < .0005 && Math.abs(v) < .002) { x = g; v = 0; draw(x); raf = 0; } else raf = requestAnimationFrame(tick);
  }
  function kick() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } }
  if (rm) {
    pw.forEach(function (w) { w.style.opacity = 1; w.style.transform = 'rotate(var(--r,0deg))'; });
    sc.classList.add('dh-live'); if (fm) fm.inert = false;
  } else {
    x = pr(); draw(x); addEventListener('scroll', kick, { passive: true }); addEventListener('resize', kick);
    dr.addEventListener('click', function () { if (pr() < .9) scrollTo({ top: Math.ceil(tp.getBoundingClientRect().top + scrollY + dist()) + 2, behavior: 'smooth' }); });
  }
  if (room) new IntersectionObserver(function (e) { if (e[0].isIntersecting) { room.classList.add('in'); this.disconnect(); } }, { threshold: .4 }).observe(room);

  /* fade-up reveal of the writing inside the arch (replays both ways, like the reference) */
  var rv = [].slice.call(tp.querySelectorAll('.dh-rv'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.classList.toggle('in', e.isIntersecting); }); }, { threshold: .15 });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });

  /* ---------- 4. Hover / tap: plushie jumps and says hi ---------- */
  (function greetings() {
    var bub = stg.querySelector('.dh-bub'), nm = bub.querySelector('b'), ht = 0, touchAt = 0;
    function hide() { bub.classList.remove('show'); }
    function greet(el) {
      var name = el.getAttribute('data-pal'); if (!name) return;
      if (sc.contains(el) && !sc.classList.contains('dh-live')) return; /* still behind the closed doors */
      clearTimeout(ht);
      el.classList.remove('dh-jmp'); void el.offsetWidth; el.classList.add('dh-jmp');
      nm.textContent = name + '!';
      var r = el.getBoundingClientRect(), s = stg.getBoundingClientRect(), w = bub.offsetWidth, h = bub.offsetHeight,
        hdr = parseFloat(getComputedStyle(stg).paddingTop) || 0, cx = r.left + r.width / 2 - s.left;
      cx = Math.max(w / 2 + 8, Math.min(s.width - w / 2 - 8, cx));
      var below = r.top - s.top - h - 40 < hdr;
      bub.classList.toggle('below', below);
      bub.style.left = cx.toFixed(1) + 'px';
      bub.style.top = (below ? r.bottom - s.top + 34 : r.top - s.top - 34).toFixed(1) + 'px';
      bub.classList.add('show');
    }
    var pick = function (e) { return e.target.closest ? e.target.closest('[data-pal]') : null; };
    stg.addEventListener('mouseover', function (e) {
      if (Date.now() - touchAt < 600) return;
      var el = pick(e); if (!el || (e.relatedTarget && el.contains(e.relatedTarget))) return; greet(el);
    });
    stg.addEventListener('mouseout', function (e) {
      var el = pick(e); if (!el || (e.relatedTarget && el.contains(e.relatedTarget))) return;
      clearTimeout(ht); ht = setTimeout(hide, 140);
    });
    stg.addEventListener('touchstart', function (e) {
      var el = pick(e); if (!el) return;
      touchAt = Date.now(); greet(el); clearTimeout(ht); ht = setTimeout(hide, 2400);
    }, { passive: true });
    stg.addEventListener('animationend', function (e) { if (e.animationName === 'dh-jump') e.target.classList.remove('dh-jmp'); });
    addEventListener('scroll', hide, { passive: true });
  })();
})();