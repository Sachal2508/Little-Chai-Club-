/* Little Chai Club — hero door scene.
 * The carved-gold doorway from the reference picture (onion-dome outside, scalloped opening) with light-brown doors,
 * a scroll-driven door opening (the screen locks once the whole door is visible and stays locked until it is open),
 * plushies that stay put beside the door, side ropes, the three-circle showcase, and hover/tap greetings.
 * No dependencies, no network calls.
 */
(function () {
  'use strict';
  var tp = document.getElementById('top');
  if (!tp || !tp.classList.contains('dh')) return;
  var NS = 'http://www.w3.org/2000/svg';
  var TILE = 'assets/images/carve-tile.webp';   /* seamless carved-gold texture */
  var rm = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var stg = tp.querySelector('.dh-stage'), fit = tp.querySelector('.dh-fit'), sc = tp.querySelector('.dh-scene');
  var ar = sc.querySelector('.dh-arch'), sp = ar.querySelector('.dh-shape'), fm = ar.querySelector('form');

  /* Colours of the door style (change them here only). brown = the logo's brown. */
  var C = { brown: '#A57348', brownDk: '#7B5230', brownLt: '#C29A6B', groove: '#2A1A0E', gold: '#E2B658', goldLt: '#F6D27A', goldDk: '#5A3D12', coral: '#D9776B', cream: '#FFF3EA', rose: '#F6D5DC' };

  var SH = {   /* traced from the carved-gold arch picture; x/y in units of the door opening's width (100) */
    open: [[50,0],[49.1,0],[48.4,0.5],[47.7,1.1],[47,1.6],[46.2,2],[45.4,2.5],[44.6,2.9],[43.8,3.2],[43,3.6],[42.1,3.8],[41.2,4.1],[40.4,4.3],[39.5,4.5],[38.6,4.8],[37.8,5],[37,5.4],[36.1,5.7],[35.4,6.2],[34.7,6.8],[34.1,7.4],[33.7,8.2],[33.5,9.1],[33.3,10],[33.1,10.8],[32.4,11.2],[31.5,11.2],[30.6,11.1],[29.7,10.9],[28.8,10.9],[28,11.2],[27.1,11.2],[26.2,11.5],[25.4,11.8],[24.6,12.2],[23.8,12.6],[23,13.1],[22.5,13.9],[22.2,14.7],[22,15.6],[22,16.5],[22,17.4],[21.8,18.2],[21.1,18.7],[20.2,18.7],[19.3,18.8],[18.4,19],[17.6,19.2],[16.7,19.3],[15.8,19.6],[15,20],[14.3,20.6],[13.7,21.2],[13,21.9],[12.5,22.6],[12.1,23.4],[11.8,24.2],[11.5,25],[11.3,25.9],[11.2,26.8],[11.2,27.7],[11.2,28.6],[11.2,29.5],[11.5,30.3],[11.5,31.2],[10.9,31.8],[10,32.1],[9.1,32.2],[8.3,32.5],[7.5,33],[6.7,33.4],[6,34],[5.5,34.7],[5,35.4],[4.5,36.2],[4.1,37],[3.8,37.8],[3.6,38.7],[3.5,39.6],[3.5,40.5],[3.5,41.4],[3.5,42.3],[3.5,43.2],[3.6,44.1],[3.8,44.9],[3.9,45.8],[4.1,46.7],[4.2,47.6],[4.5,48.4],[4.7,49.3],[5,50.1],[5.2,51],[5.5,51.9],[5.8,52.7],[6.1,53.5],[6.4,54.4],[6.9,55.1],[7.3,55.9],[7.6,56.8],[7,57.4],[6.2,57.6],[5.3,57.8],[4.4,58],[3.6,58.4],[2.8,58.9],[2.2,59.5],[1.7,60.3],[1.2,61],[0.8,61.8],[0.5,62.7],[0.3,62.9]],
    mid: [[50,-16.1],[49,-15.8],[48.4,-15.3],[47.7,-14.7],[47,-14.1],[46.2,-13.5],[45.4,-12.9],[44.6,-12.4],[43.8,-12],[42.9,-11.5],[42,-11.1],[41.1,-10.8],[40.3,-10.4],[39.4,-10],[38.5,-9.6],[37.6,-9.2],[36.7,-8.8],[35.9,-8.3],[35.2,-7.7],[34.5,-7.1],[33.9,-6.5],[33.2,-5.9],[32.5,-5.4],[31.7,-5],[30.9,-4.8],[29.9,-4.5],[29,-4.3],[28.1,-4.1],[27.2,-3.8],[26.3,-3.4],[25.4,-3.1],[24.5,-2.7],[23.7,-2.2],[22.9,-1.6],[22.3,-1.1],[21.7,-0.4],[21.1,0.2],[20.6,0.9],[19.9,1.4],[19.2,1.9],[18.4,2.3],[17.4,2.6],[16.5,2.9],[15.6,3.2],[14.8,3.6],[13.9,4.1],[13.1,4.6],[12.3,5.2],[11.6,5.8],[10.9,6.4],[10.2,7.1],[9.7,7.8],[9.1,8.6],[8.6,9.3],[8.2,10],[7.8,10.8],[7.4,11.5],[7,12.3],[6.4,12.9],[5.8,13.5],[5.1,14.1],[4.3,14.6],[3.5,15.1],[2.7,15.6],[1.9,16.2],[1.2,16.9],[0.6,17.6],[0,18.4],[-0.5,19.2],[-0.9,20],[-1.4,20.9],[-1.7,21.7],[-2.1,22.6],[-2.4,23.4],[-2.7,24.3],[-2.9,25.2],[-3.2,26],[-3.4,26.9],[-3.6,27.8],[-3.8,28.6],[-3.9,29.5],[-4,30.4],[-4.2,31.2],[-4.2,32.1],[-4.3,33],[-4.4,33.9],[-4.4,34.8],[-4.4,35.6],[-4.5,36.5],[-4.8,37.3],[-5.2,38],[-5.7,38.7],[-6.3,39.3],[-6.9,40],[-7.4,40.7],[-7.9,41.5],[-8.3,42.3],[-8.7,43.2],[-8.9,43.9],[-9.1,44.5]],
    outer: [[49.8,-32.8],[49.1,-32.2],[48.6,-31.5],[48.1,-30.8],[47.5,-30.1],[46.9,-29.4],[46.3,-28.8],[45.6,-28.2],[44.9,-27.7],[44.1,-27.1],[43.4,-26.7],[42.6,-26.2],[41.9,-25.7],[41.1,-25.2],[40.3,-24.8],[39.5,-24.4],[38.6,-24.1],[37.8,-23.7],[37,-23.3],[36.2,-23],[35.4,-22.6],[34.5,-22.2],[33.7,-21.9],[32.9,-21.5],[32.1,-21.2],[31.2,-20.8],[30.4,-20.5],[29.6,-20.1],[28.8,-19.7],[28,-19.3],[27.2,-18.9],[26.4,-18.5],[25.6,-18.1],[24.7,-17.8],[23.9,-17.4],[23.1,-17.1],[22.2,-16.7],[21.4,-16.3],[20.6,-15.9],[19.8,-15.6],[18.9,-15.2],[18.1,-14.8],[17.3,-14.5],[16.5,-14.1],[15.7,-13.7],[14.9,-13.2],[14.1,-12.8],[13.3,-12.3],[12.6,-11.9],[11.8,-11.4],[11,-11],[10.2,-10.5],[9.5,-10],[8.7,-9.6],[8,-9.1],[7.2,-8.6],[6.4,-8.1],[5.7,-7.6],[4.9,-7.1],[4.2,-6.7],[3.4,-6.2],[2.7,-5.6],[1.9,-5.1],[1.2,-4.6],[0.5,-4],[-0.2,-3.5],[-0.9,-2.9],[-1.6,-2.3],[-2.2,-1.7],[-2.9,-1.1],[-3.5,-0.5],[-4.2,0.2],[-4.8,0.8],[-5.4,1.5],[-6,2.2],[-6.5,2.9],[-7.1,3.6],[-7.7,4.3],[-8.3,4.9],[-8.9,5.6],[-9.4,6.3],[-10,7],[-10.5,7.7],[-11.1,8.5],[-11.6,9.2],[-12.2,9.9],[-12.7,10.6],[-13.2,11.4],[-13.6,12.2],[-14.1,12.9],[-14.5,13.7],[-14.9,14.5],[-15.3,15.3],[-15.7,16.1],[-16.1,17],[-16.4,17.8],[-16.7,18.6],[-17.1,19.5],[-17.4,20.3],[-17.6,21.2],[-17.9,22.1],[-18.1,22.9],[-18.3,23.8],[-18.5,24.7],[-18.7,25.6],[-18.8,26.5],[-19,27.1]]
  };

  /* One of the traced shapes as a path. u = size of one unit, h = bottom edge; the legs run straight down to h. */
  function shapeD(key, u, h, close) {
    var P = SH[key], n = P.length, i, f = function (x, y) { return (x * u).toFixed(2) + ' ' + (y * u).toFixed(2); };
    var d = 'M' + (P[n - 1][0] * u).toFixed(2) + ' ' + h.toFixed(2) + 'L' + f(P[n - 1][0], P[n - 1][1]);
    for (i = n - 2; i >= 0; i--) d += 'L' + f(P[i][0], P[i][1]);
    for (i = 1; i < n; i++) d += 'L' + f(100 - P[i][0], P[i][1]);
    d += 'L' + ((100 - P[n - 1][0]) * u).toFixed(2) + ' ' + h.toFixed(2);
    return close ? d + 'Z' : d;
  }
  /* Left or right half of the opening, closed down the middle: the shape of one door leaf. w = opening width in px. */
  function halfD(w, h, f) {
    var u = w / 100, P = SH.open, n = P.length, i, X = function (x, k) { return ((f ? w - x * u : x * u) + (k ? (f ? -1 : 1) : 0)).toFixed(1); };
    var d = 'M' + X(P[n - 1][0]) + ' ' + h + 'L' + X(P[n - 1][0]) + ' ' + (P[n - 1][1] * u).toFixed(1);
    for (i = n - 2; i >= 0; i--) d += 'L' + X(P[i][0], i === 0) + ' ' + (P[i][1] * u).toFixed(1);
    return d + 'V' + h + 'Z';
  }
  /* A band of constant depth that follows the opening edge on the inside:
     a fat stroke centred on the outline, clipped to the opening. depth is in the svg's own units. */
  function band(d, depth, paint, clipId) {
    return '<path d="' + d + '" fill="none" stroke="' + paint + '" stroke-width="' + (2 * depth).toFixed(2) + '" stroke-linejoin="round" clip-path="url(#' + clipId + ')"/>';
  }
  /* A scalloped (flower-edged) circle, as one closed path. */
  function rosette(cx, cy, r, amp, n) {
    var d = '', k, th, rr;
    for (k = 0; k <= 96; k++) { th = k / 96 * 6.28319; rr = r + amp * Math.cos(n * th); d += (k ? 'L' : 'M') + (cx + rr * Math.cos(th)).toFixed(1) + ' ' + (cy + rr * Math.sin(th)).toFixed(1); }
    return d + 'Z';
  }
  /* A gold moulding line: dark edge, gold body, light highlight. */
  function mould(d, w) {
    return '<path d="' + d + '" fill="none" stroke="' + C.goldDk + '" stroke-width="' + (w + .7).toFixed(2) + '" stroke-linejoin="round"/>' +
      '<path d="' + d + '" fill="none" stroke="' + C.gold + '" stroke-width="' + w + '" stroke-linejoin="round"/>' +
      '<path d="' + d + '" fill="none" stroke="' + C.goldLt + '" stroke-width="' + (w * .25).toFixed(2) + '" stroke-linejoin="round"/>';
  }

  /* ---------- 1. Carved-gold frame around the opening (drawn above the doors) ---------- */
  var fr = document.createElementNS(NS, 'svg');
  fr.setAttribute('class', 'dh-fr'); fr.setAttribute('aria-hidden', 'true');
  sc.appendChild(fr);
  (function frame() {
    var PW = 13, PH = PW * 1500 / 222;     /* size of one carved tile, in opening units (the opening is 100 wide) */
    function drawFrame() {
      var r = ar.getBoundingClientRect(); if (!r.width) return;
      var h = 100 * r.height / r.width, vb = '0 0 100 ' + h.toFixed(2);
      var op = shapeD('open', 1, h, true), ou = shapeD('outer', 1, h, true);
      sp.setAttribute('viewBox', vb); sp.innerHTML = '<path class="f" d="' + op + '"/>';   /* cream room behind the writing */
      fr.setAttribute('viewBox', vb);
      fr.innerHTML =
        '<defs><pattern id="dh-cv" patternUnits="userSpaceOnUse" width="' + PW + '" height="' + PH.toFixed(2) + '"><image href="' + TILE + '" width="' + PW + '" height="' + PH.toFixed(2) + '" preserveAspectRatio="none"/></pattern></defs>' +
        '<path d="' + ou + op + '" fill-rule="evenodd" fill="' + C.groove + '"/>' +
        '<path d="' + ou + op + '" fill-rule="evenodd" fill="url(#dh-cv)"/>' +
        mould(shapeD('outer', 1, h, false), 1.5) + mould(shapeD('mid', 1, h, false), 1.1) + mould(shapeD('open', 1, h, false), 1.3) +
        mould('M-21.5 ' + (h + 1.9).toFixed(2) + 'H121.5', 3.2);   /* the step the door stands on */
    }
    drawFrame();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawFrame);
    new ResizeObserver(drawFrame).observe(ar);
  })();

  /* ---------- 2. Door (light brown, like the logo), pinned scroll, plushies beside the door ---------- */
  var dr, pw = [].slice.call(sc.querySelectorAll('.dh-pw'));
  (function door() {
    /* friends looking out of the two round windows */
    var WIN = ['assets/images/mithai-cube.webp', 'assets/images/rusk-upright.webp'], WX = 29.5, WY = 96, WR = 14.5;
    dr = document.createElement('div'); dr.className = 'dh-door'; dr.setAttribute('aria-hidden', 'true');
    dr.innerHTML = '<div class="dh-lf"><svg></svg><b class="dh-sh"></b></div><div class="dh-rf"><svg></svg><b class="dh-sh"></b></div><div class="dh-dtx"><b>Our doors are<br><em>always open</em></b><small>Scroll to open &darr;</small></div>';
    ar.appendChild(dr);
    var L = dr.children[0], R = dr.children[1];
    function sync() {
      var w = ar.offsetWidth, h = ar.offsetHeight; if (!w) return;
      var u = w / 100, m = w / 2, tall = h >= 172 * u, cw = (tall ? WY * u : Math.min((66 * u + h) / 2 - 2 * u, 74 * u));
      var hp = function (cx, cy, s, fill) { return '<path transform="translate(' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ') scale(' + s.toFixed(2) + ')" d="M0 .9C-1.3-.1-.9-1-.4-1C-.15-1 0-.8 0-.65C0-.8 .15-1 .4-1C.9-1 1.3-.1 0 .9Z" fill="' + fill + '"/>'; },
        st = function (cx, cy, s) { return '<path d="M' + cx + ' ' + (cy - s) + 'Q' + cx + ' ' + cy + ' ' + (cx + s) + ' ' + cy + 'Q' + cx + ' ' + cy + ' ' + cx + ' ' + (cy + s) + 'Q' + cx + ' ' + cy + ' ' + (cx - s) + ' ' + cy + 'Q' + cx + ' ' + cy + ' ' + cx + ' ' + (cy - s) + 'Z" fill="' + C.cream + '"/>'; };
      var o = shapeD('open', u, h + 30, false), oz = shapeD('open', u, h + 30, true), pwd = 13 * u, pht = pwd * 1500 / 222;
      [L, R].forEach(function (el, f) {
        var s = el.firstChild, x0 = f ? m : 0, pl = '', kx = (m + (f ? 3.4 : -3.4) * u).toFixed(1), ky = cw.toFixed(1), cid = 'dh-lc' + f, pid = 'dh-lp' + f;
        for (var k = 1; k < 8; k++) pl += '<path d="M' + (x0 + k * m / 8).toFixed(1) + ' 0V' + h + '" stroke="' + C.brownDk + '" stroke-opacity=".28" stroke-width="' + (.5 * u).toFixed(1) + '"/>';
        var cy = tall ? Math.max(cw + 46 * u, h * .74) : h * 4, rw = WR * u, wx = (f ? 100 - WX : WX) * u, pi = WIN[f], gl = f ? C.rose : C.cream, gid = 'dh-gw' + f, iw = 25 * u,
          win = '<defs><clipPath id="' + gid + '"><circle cx="' + wx.toFixed(1) + '" cy="' + cw.toFixed(1) + '" r="' + (rw - 2.6 * u).toFixed(1) + '"/></clipPath></defs>' +
            '<path d="' + rosette(wx, cw, rw + .4 * u, .9 * u, 14) + '" fill="' + C.goldDk + '"/>' +
            '<path d="' + rosette(wx, cw, rw, .9 * u, 14) + '" fill="' + C.gold + '"/>' +
            '<circle cx="' + wx.toFixed(1) + '" cy="' + cw.toFixed(1) + '" r="' + (rw - 1.3 * u).toFixed(1) + '" fill="none" stroke="' + C.cream + '" stroke-width="' + (.4 * u).toFixed(2) + '"/>' +
            '<circle cx="' + wx.toFixed(1) + '" cy="' + cw.toFixed(1) + '" r="' + (rw - 2.6 * u).toFixed(1) + '" fill="' + gl + '"/>' +
            '<g clip-path="url(#' + gid + ')"><image href="' + pi + '" x="' + (wx - iw / 2).toFixed(1) + '" y="' + (cw + 10.5 * u - iw).toFixed(1) + '" width="' + iw.toFixed(1) + '" height="' + iw.toFixed(1) + '" preserveAspectRatio="xMidYMax meet"/>' +
            '<rect x="' + (wx - rw).toFixed(1) + '" y="' + (cw + 9 * u).toFixed(1) + '" width="' + (2 * rw).toFixed(1) + '" height="' + (rw).toFixed(1) + '" fill="' + C.coral + '"/>' +
            '<path d="M' + (wx - rw).toFixed(1) + ' ' + (cw + 9 * u).toFixed(1) + 'H' + (wx + rw).toFixed(1) + '" stroke="' + C.gold + '" stroke-width="' + (1 * u).toFixed(1) + '"/></g>';
        el.style.clipPath = "path('" + halfD(w, h, f) + "')"; s.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        s.innerHTML =
          '<defs><clipPath id="' + cid + '"><path d="' + oz + '"/></clipPath>' +
          '<pattern id="' + pid + '" patternUnits="userSpaceOnUse" width="' + pwd.toFixed(1) + '" height="' + pht.toFixed(1) + '"><image href="' + TILE + '" width="' + pwd.toFixed(1) + '" height="' + pht.toFixed(1) + '" preserveAspectRatio="none"/></pattern></defs>' +
          pl +
          /* carved inlay that follows the scalloped edge, then a thin cream line, both swing open with the door */
          band(o, 9.4 * u, C.cream, cid) + band(o, 8.9 * u, C.brown, cid) +
          band(o, 6.4 * u, C.gold, cid) + band(o, 5.8 * u, 'url(#' + pid + ')', cid) + band(o, 3.1 * u, C.gold, cid) + band(o, 2.5 * u, C.brown, cid) +
          '<path d="' + rosette(50 * u, 30 * u, 4.6 * u, .55 * u, 12) + '" fill="' + C.gold + '"/><circle cx="' + 50 * u + '" cy="' + 30 * u + '" r="' + (2.2 * u).toFixed(1) + '" fill="' + C.cream + '"/><circle cx="' + 50 * u + '" cy="' + 30 * u + '" r="' + (.9 * u).toFixed(1) + '" fill="' + C.brownDk + '"/>' +
          win +
          '<path d="' + rosette(50 * u, cy, 21 * u, 1 * u, 16) + '" fill="' + C.gold + '"/><circle cx="' + 50 * u + '" cy="' + cy.toFixed(1) + '" r="' + (18.4 * u).toFixed(1) + '" fill="' + C.brown + '"/><circle cx="' + 50 * u + '" cy="' + cy.toFixed(1) + '" r="' + (17.2 * u).toFixed(1) + '" fill="none" stroke="' + C.cream + '" stroke-width="' + (1.2 * u).toFixed(1) + '" stroke-dasharray="0 ' + (3 * u).toFixed(1) + '" stroke-linecap="round"/>' +
          hp(50 * u, cy - 1.5 * u, 9 * u, C.cream) +
          st(22 * u, cy - 34 * u, 2.6 * u) + st(78 * u, cy - 30 * u, 2.2 * u) + st(24 * u, cy + 38 * u, 2.2 * u) + st(77 * u, cy + 36 * u, 2.6 * u) +
          '<circle cx="' + kx + '" cy="' + ky + '" r="' + (2.4 * u).toFixed(1) + '" fill="' + C.gold + '"/><circle cx="' + kx + '" cy="' + ky + '" r="' + (1 * u).toFixed(1) + '" fill="' + C.brownDk + '"/>';
      });
      dr.classList.add('ready');
    }
    var st; function rs() { clearTimeout(st); st = setTimeout(sync, 160); }
    new ResizeObserver(rs).observe(ar); setTimeout(sync, 300); setTimeout(sync, 1500);
  })();

  /* ---------- 3. Pinned scroll: spring-driven door opening ---------- */
  var x = 0, v = 0, raf = 0, last = 0;
  var cl = function (q) { return Math.max(0, Math.min(1, q)); }, ez = function (q) { return q * q * (3 - 2 * q); };
  if (!rm) tp.classList.add('dh--pinned');
  var run = function () { return Math.max(1, tp.offsetHeight - stg.offsetHeight - (parseFloat(getComputedStyle(tp).paddingBottom) || 0)); };
  var dist = function () { return run() * .8; }, pr = function () { return cl(-tp.getBoundingClientRect().top / dist()); };

  /* The whole door is scaled once to fit the screen under the fixed header. The screen stays locked while the doors open,
     and the door never changes size. */
  function fitIt() {
    var pinned = tp.classList.contains('dh--pinned');
    fit.style.setProperty('--fs', 1); fit.style.setProperty('--fy', '0px');
    var pt = parseFloat(getComputedStyle(stg).paddingTop) || 0, H = fit.offsetHeight, A = stg.clientHeight - pt - 12;
    var s = pinned ? Math.min(1, A / H) : 1;
    fit.style.setProperty('--fs', s.toFixed(4));
    fit.style.setProperty('--fy', (pinned ? Math.max(0, (A - H * s) / 2) : 0).toFixed(1) + 'px');
    var u = sc.offsetWidth / 100, side = (stg.clientWidth - (sc.offsetWidth + 39 * u) * s) / 2;   /* the frame sticks out ~19 units on each side */
    stg.style.setProperty('--side', Math.max(0, side).toFixed(0) + 'px');
    stg.style.setProperty('--hw', (stg.clientWidth / 2).toFixed(0) + 'px');
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
    sc.classList.add('dh-live'); if (fm) fm.inert = false;
  } else {
    x = pr(); draw(x); addEventListener('scroll', kick, { passive: true }); addEventListener('resize', kick);
    dr.addEventListener('click', function () { if (pr() < .9) scrollTo({ top: Math.ceil(tp.getBoundingClientRect().top + scrollY + dist()) + 2, behavior: 'smooth' }); });
  }

  /* fade-up reveal of the writing inside the arch (replays both ways, like the reference) */
  var rv = [].slice.call(tp.querySelectorAll('.dh-rv'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.classList.toggle('in', e.isIntersecting); }); }, { threshold: 0, rootMargin: '0px 0px 80px 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });

  /* ---------- 4. Hover / tap: plushie jumps and says hi ---------- */
  (function greetings() {
    var bub = stg.querySelector('.dh-bub'), nm = bub.querySelector('b'), ht = 0, touchAt = 0;
    function hide() { bub.classList.remove('show'); }
    function greet(el) {
      var name = el.getAttribute('data-pal'); if (!name) return;
      if (ar.contains(el) && !sc.classList.contains('dh-live')) return; /* inside the arch: still behind the closed doors */
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

  /* ---------- 5. Three-circle showcase: tap a small circle to swap that friend with the big one ---------- */
  (function showcase() {
    var box = tp.querySelector('.shw'); if (!box) return;
    var ps = [].slice.call(box.querySelectorAll('.shw-p'));
    function label() {
      ps.forEach(function (b) {
        var nm = b.getAttribute('data-name');
        b.setAttribute('aria-label', b.classList.contains('s0') ? nm + ' (in the big circle)' : 'Show ' + nm + ' in the big circle');
      });
    }
    ps.forEach(function (b) {
      b.addEventListener('click', function () {
        var s = b.classList.contains('s1') ? 1 : b.classList.contains('s2') ? 2 : 0; if (!s) return;
        var big = box.querySelector('.shw-p.s0');
        big.classList.replace('s0', 's' + s); b.classList.replace('s' + s, 's0');
        ps.forEach(function (x) { x.classList.remove('pop'); }); void b.offsetWidth; b.classList.add('pop');
        label();
      });
    });
    label();
  })();
})();