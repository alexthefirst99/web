/* ============================================================
   Alex Tran — portfolio v2 interactions (vanilla JS, no build)
   ============================================================ */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(pointer: fine)').matches;
  var motion = !reduce;

  /* ---------------- data ---------------- */
  var SECTIONS = ['Research Insights', 'Profile', 'Results', 'Timeline', 'Projects', 'Publications', 'Toolkit', 'Contact'];

  var Y0 = 2017, Y1 = 2027.25;
  var pct = function (y) { return ((y - Y0) / (Y1 - Y0) * 100).toFixed(2) + '%'; };
  var EXPS = [
    { start: 2017.67, end: 2021.42, lane: 0, chip: 'B.S. Mathematics · UMass Lowell', bg: 'rgba(255,255,255,.12)', fg: '#fff',
      date: '2017 — 2021', org: 'University of Massachusetts Lowell · Lowell, MA', role: 'B.S. Mathematics, Minor in Finance',
      points: ['Dean’s List 2020–2021', 'GPA 3.135'] },
    { start: 2022.0, end: 2022.66, lane: 1, chip: 'Viet Power · Marketing & Data', bg: 'linear-gradient(90deg,#A9C4A2,#D3E2CC)', fg: '#1a0a10',
      date: 'Jan — Aug 2022', org: 'Viet Power Solutions JSC · Vietnam', role: 'Marketing & Data Intern',
      points: ['Monitored engagement with Google Analytics; optimized campaigns for +39.5% performance.',
               'Launched targeted LinkedIn, Facebook and Google Ads campaigns, raising engagement by 50%.',
               'Produced data-driven reports to inform leadership and refine product strategy.'] },
    { start: 2022.92, end: 2026.88, lane: 2, chip: 'Houston Methodist · Research Assistant', bg: 'linear-gradient(90deg,#C9A46A,#F1DDB8)', fg: '#1a0a10',
      date: 'Dec 2022 — Present', org: 'Houston Methodist · Dr. Guangyu Wang Lab', role: 'Research Assistant — Cardiovascular Regeneration Program',
      points: ['Built pipelines for large-scale single-cell and spatial omics data for ML development and evaluation.',
               'Applied unsupervised learning and statistics to find patterns in high-dimensional biological data.',
               'Validated model predictions against biological signals for reliability and interpretability.',
               'Built interactive dashboards for research teams; contributed to Nature Methods and Nature Communications papers.'] },
    { start: 2025.0, end: 2026.95, lane: 3, chip: 'M.S. Data Science & AI · UH', bg: 'linear-gradient(90deg,#7FA3A8,#C4D8D9)', fg: '#1a0a10',
      date: 'Jan 2025 — Dec 2026 (expected)', org: 'University of Houston · Cullen College of Engineering', role: 'M.S. Engineering Data Science and AI',
      points: ['GPA 3.63', 'Houston, TX'] }
  ];

  var PROJ = [
    { short: 'Loki', year: '2026' },
    { short: 'Mjolnir', year: '2025' },
    { short: 'Visual–Omics', year: '2025' },
    { short: 'Macrophage', year: '2023' }
  ];

  var SKILLS = [
    { name: 'Programming', items: ['Python', 'R · tidyverse', 'Seurat', 'HTML / CSS'] },
    { name: 'Data Science', items: ['pandas', 'NumPy', 'SciPy', 'Data wrangling', 'Statistical modeling', 'Pathway enrichment'] },
    { name: 'Machine Learning', items: ['scikit-learn', 'Unsupervised learning', 'Clustering', 'Dimensionality reduction', 'Trajectory inference', 'Model diagnostics'] },
    { name: 'Visualization', items: ['Plotly', 'Dash', 'Seaborn', 'Matplotlib', 'React dashboards'] },
    { name: 'Engineering', items: ['Snakemake', 'Git', 'Linux', 'AWS EC2 / S3', 'Automation'] },
    { name: 'Learning now', items: ['SQL', 'A/B testing', 'Tableau / Looker'] }
  ];

  /* ---------------- film grain ---------------- */
  (function () {
    var g = $('[data-fx=grain]'); if (!g) return;
    var c = document.createElement('canvas'); c.width = c.height = 180;
    var x = c.getContext('2d'), d = x.createImageData(180, 180);
    for (var i = 0; i < d.data.length; i += 4) { var v = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
    x.putImageData(d, 0, 0);
    g.style.backgroundImage = 'url(' + c.toDataURL() + ')';
  })();

  /* ---------------- menu ---------------- */
  var menuBtn = $('#menu-btn'), menu = $('#menu'), scrim = $('#menu-scrim');
  function setMenu(open) {
    menu.hidden = scrim.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
    if (open) { var a = $('a', menu); if (a) a.focus(); }
  }
  menuBtn.addEventListener('click', function () { setMenu(menu.hidden); });
  scrim.addEventListener('click', function () { setMenu(false); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); }
  });

  /* ---------------- "open to work" card ---------------- */
  var otw = $('#otw'), otwOpen = $('#otw-open');
  $('#otw-close').addEventListener('click', function () { otw.hidden = true; otwOpen.hidden = false; otwOpen.focus(); });
  otwOpen.addEventListener('click', function () { otw.hidden = false; otwOpen.hidden = true; });

  /* ---------------- generated ticks / dots ---------------- */
  $$('[data-ruler]').forEach(function (r) {
    var html = '';
    for (var i = 0; i < 40; i++) {
      var maj = i % 5 === 0;
      html += '<i style="height:' + (maj ? 16 : 8) + 'px;background:rgba(255,255,255,' + (maj ? '.8' : '.35') + ')"></i>';
    }
    r.innerHTML = html;
  });
  (function () {
    var el = $('#gpa-dots'); if (!el) return;
    var on = Math.round(3.63 / 4 * 20), html = '';
    for (var i = 0; i < 20; i++) html += '<i' + (i < on ? ' class="on"' : '') + '></i>';
    el.innerHTML = html;
  })();

  /* ---------------- timeline ---------------- */
  (function () {
    var track = $('#tl-track'), play = $('#tl-play'); if (!track) return;
    var html = '';
    for (var q = 0; q <= 41; q++) {
      var y = Y0 + q / 4, maj = q % 4 === 0;
      html += '<i class="tick" style="left:' + pct(y) + ';height:' + (maj ? 14 : 7) + 'px;background:rgba(255,255,255,' + (maj ? '.7' : '.3') + ')"></i>';
    }
    for (var yr = Y0; yr <= 2027; yr++) html += '<span class="yr" style="left:' + pct(yr) + '">' + yr + '</span>';
    track.insertAdjacentHTML('afterbegin', html);

    /* Every mark is true to its dates: roles with a start and end are bars of
       exactly that length; entries with only a date (`at`) are a milestone dot. */
    var chips = EXPS.map(function (e, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'tl-chip' + (e.at ? ' tl-ms' : '');
      b.style.top = (66 + e.lane * 56) + 'px';
      b.style.left = e.at ? pct(e.at) : pct(e.start);
      if (!e.at) b.style.width = ((e.end - e.start) / (Y1 - Y0) * 100).toFixed(2) + '%';
      b.style.background = e.bg;
      b.style.color = e.fg;
      var lab = document.createElement('span');
      lab.className = 'tl-label';
      lab.textContent = e.chip;
      b.appendChild(lab);
      b.addEventListener('click', function () { select(i); });
      track.appendChild(b);
      return b;
    });

    /* A label that doesn't fit inside its bar sits just to the right of it,
       so short roles keep their true length instead of stretching. */
    function fitLabels() {
      chips.forEach(function (b, i) {
        if (EXPS[i].at) return;
        b.classList.remove('is-out', 'is-out-left');
        var lab = b.firstChild;
        if (lab.offsetWidth <= b.clientWidth) return;
        // outside to the right, or to the left if that would run off the timeline
        var roomRight = track.clientWidth - (b.offsetLeft + b.offsetWidth) - 12;
        b.classList.add(lab.offsetWidth > roomRight ? 'is-out-left' : 'is-out');
      });
    }
    fitLabels();
    window.addEventListener('resize', fitLabels);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitLabels);

    var cur = 2;
    var dateEl = $('#tl-date'), orgEl = $('#tl-org'), roleEl = $('#tl-role'), ptsEl = $('#tl-points');
    function select(i) {
      cur = (i + EXPS.length) % EXPS.length;
      var e = EXPS[cur];
      chips.forEach(function (c, j) { c.setAttribute('aria-pressed', String(j === cur)); });
      play.style.left = e.at ? pct(e.at) : pct(e.start);
      dateEl.textContent = e.date; orgEl.textContent = e.org; roleEl.textContent = e.role;
      ptsEl.innerHTML = '';
      e.points.forEach(function (p) { var li = document.createElement('li'); li.textContent = p; ptsEl.appendChild(li); });
    }
    $('#tl-prev').addEventListener('click', function () { select(cur - 1); });
    $('#tl-next').addEventListener('click', function () { select(cur + 1); });
    select(cur);
  })();

  /* ---------------- projects ---------------- */
  var lokiVideo = $('#loki-video');
  var projState = { cur: 0, stageVisible: false };
  function syncLoki() {
    if (!lokiVideo) return;
    var shouldPlay = projState.cur === 0 && projState.stageVisible && motion;
    if (shouldPlay && lokiVideo.paused) { var p = lokiVideo.play(); if (p && p.catch) p.catch(function () {}); }
    else if (!shouldPlay && !lokiVideo.paused) lokiVideo.pause();
  }
  (function () {
    var rows = $$('.proj-row'), slides = $$('.slide'), label = $('#proj-label');
    function select(i) {
      projState.cur = (i + PROJ.length) % PROJ.length;
      rows.forEach(function (r, j) { r.setAttribute('aria-pressed', String(j === projState.cur)); });
      slides.forEach(function (s, j) { s.classList.toggle('is-on', j === projState.cur); s.setAttribute('aria-hidden', String(j !== projState.cur)); });
      label.textContent = PROJ[projState.cur].short + ' · ' + PROJ[projState.cur].year;
      syncLoki();
    }
    rows.forEach(function (r, i) { r.addEventListener('click', function () { select(i); }); });
    $('#proj-prev').addEventListener('click', function () { select(projState.cur - 1); });
    $('#proj-next').addEventListener('click', function () { select(projState.cur + 1); });
    select(0);

    var stage = $('.proj-stage');
    if (stage && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        projState.stageVisible = es[0].isIntersecting; syncLoki();
      }, { threshold: 0.25 }).observe(stage);
    }
  })();

  /* Loki demo lightbox */
  (function () {
    var dlg = $('#lightbox'), vid = $('#lightbox-video'), btn = $('#loki-expand');
    if (!dlg || !btn) return;
    function open() {
      if (typeof dlg.showModal !== 'function') { window.open(lokiVideo.currentSrc || $('source', lokiVideo).src, '_blank'); return; }
      dlg.showModal();
      try { vid.currentTime = lokiVideo ? lokiVideo.currentTime : 0; } catch (e) {}
      var p = vid.play(); if (p && p.catch) p.catch(function () {});
    }
    btn.addEventListener('click', open);
    if (lokiVideo) lokiVideo.addEventListener('click', open);
    $('#lightbox-close').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', function () { vid.pause(); });
  })();

  /* ---------------- skills tabs ---------------- */
  (function () {
    var tabs = $('#skill-tabs'); if (!tabs) return;
    var countEl = $('#skill-count'), nameEl = $('#skill-name'), itemsEl = $('#skill-items');
    var btns = SKILLS.map(function (s, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'tab'; b.textContent = s.name;
      b.setAttribute('role', 'tab'); b.id = 'skill-tab-' + i; b.setAttribute('aria-controls', 'skill-panel');
      b.addEventListener('click', function () { select(i); });
      b.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (d) { e.preventDefault(); select((i + d + SKILLS.length) % SKILLS.length, true); }
      });
      tabs.appendChild(b);
      return b;
    });
    function select(i, focus) {
      var s = SKILLS[i];
      btns.forEach(function (b, j) { b.setAttribute('aria-selected', String(j === i)); b.tabIndex = j === i ? 0 : -1; });
      if (focus) btns[i].focus();
      $('#skill-panel').setAttribute('aria-labelledby', 'skill-tab-' + i);
      countEl.textContent = String(s.items.length).padStart(2, '0');
      nameEl.textContent = s.name;
      itemsEl.innerHTML = '';
      s.items.forEach(function (it, k) {
        var sp = document.createElement('span'); sp.textContent = it; sp.style.animationDelay = (k * 40) + 'ms'; itemsEl.appendChild(sp);
      });
    }
    select(0);
  })();

  /* ---------------- active section → header pill ---------------- */
  (function () {
    var title = $('#sec-title'), count = $('#sec-count'), active = -1;
    var total = String(SECTIONS.length).padStart(2, '0');
    function set(i) {
      if (i === active) return; active = i;
      title.textContent = SECTIONS[i];
      count.textContent = String(i + 1).padStart(2, '0') + '/' + total;
    }
    set(0);
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) set(+en.target.dataset.sec); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('[data-sec]').forEach(function (el) { io.observe(el); });
  })();

  /* ---------------- reveals ---------------- */
  if (motion && 'IntersectionObserver' in window) {
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.style.setProperty('--d', ((+el.dataset.reveal || 0) * 90) + 'ms');
        el.classList.remove('rv'); el.classList.add('rv-in');
        rio.unobserve(el);
      });
    }, { threshold: 0.12 });
    $$('[data-reveal]').forEach(function (el) { el.classList.add('rv'); rio.observe(el); });
  }

  /* ---------------- count-ups ---------------- */
  if (motion && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        cio.unobserve(en.target);
        var el = en.target, to = +el.dataset.to, dec = +(el.dataset.dec || 0), pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
        var t0 = performance.now(), dur = 1600;
        (function step(now) {
          var k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(2, -10 * k);
          el.textContent = pre + (to * (k === 1 ? 1 : e)).toFixed(dec) + suf;
          if (k < 1) requestAnimationFrame(step);
        })(t0);
      });
    }, { threshold: 0.5 });
    $$('[data-count]').forEach(function (el) { cio.observe(el); });
  }

  /* ---------------- hero name scramble ---------------- */
  if (motion) {
    var chars = 'ABCDEFGHJKLMNOPQRSTUVWXYZ0123456789#%+';
    $$('[data-scr]').forEach(function (el, i) {
      var fin = el.dataset.ch, n = 0, lim = 14 + i * 3;
      var iv = setInterval(function () {
        n++;
        el.textContent = n >= lim ? fin : chars[Math.random() * chars.length | 0];
        if (n >= lim) clearInterval(iv);
      }, 45);
    });
  }

  /* ---------------- pointer: cursor + spotlight ---------------- */
  var m = { x: 0, y: 0, sx: 0, sy: 0, cx: -100, cy: -100, rx: -100, ry: -100 };
  var ring = $('[data-fx=ring]'), dot = $('[data-fx=dot]');
  var spots = $$('.spot');
  if (fine && motion) {
    ring.style.display = dot.style.display = 'block';
    document.body.classList.add('cx-cursor');
    document.addEventListener('pointerover', function (e) {
      ring.classList.toggle('is-hover', !!(e.target.closest && e.target.closest('a,button')));
    });
  }
  window.addEventListener('pointermove', function (e) {
    m.x = e.clientX / innerWidth * 2 - 1; m.y = e.clientY / innerHeight * 2 - 1; m.cx = e.clientX; m.cy = e.clientY;
    for (var i = 0; i < spots.length; i++) {
      var r = spots[i].getBoundingClientRect();
      if (e.clientY > r.top - 200 && e.clientY < r.bottom + 200) {
        spots[i].style.setProperty('--mx', (e.clientX - r.left) + 'px');
        spots[i].style.setProperty('--my', (e.clientY - r.top) + 'px');
      }
    }
  }, { passive: true });

  /* ---------------- main animation loop ---------------- */
  var arcs = [{ cx: 210, cy: 190, r: 150 }, { cx: 340, cy: 190, r: 140 }, { cx: 450, cy: 190, r: 150 }];
  var arcDots = $$('[data-arc]'), blobs = $$('[data-fx=blob]'), depths = $$('[data-depth]');
  var mags = fine ? $$('[data-magnetic]') : [], pulses = $$('[data-fx=pulse]');
  var tilt = $('[data-fx=tilt]'), prog = $('[data-fx=progress]'), dock = $('[data-fx=dock]');
  mags.forEach(function (el) { el.style.transition = 'transform .35s cubic-bezier(.2,.8,.2,1)'; });
  var dockOn = null;

  /* Hero-style tilt for the cards further down: while the pointer is over a
     [data-tilt="maxDeg"] block it tilts toward it and eases back flat on leave.
     Uses the independent `rotate` property (axis-angle) so it composes with the
     reveal/parallax transforms; also exposes --px/--py (-1..1) so CSS can drift
     each card's glow with the pointer, like the hero's blobs. */
  var tilts = (fine && motion) ? $$('[data-tilt]').map(function (el) {
    var s = { el: el, max: +el.dataset.tilt || 3, x: 0, y: 0, over: false, on: false };
    if (el.parentElement) el.parentElement.style.perspective = '1600px';
    el.addEventListener('pointerenter', function () { s.over = true; });
    el.addEventListener('pointerleave', function () { s.over = false; });
    return s;
  }) : [];

  function loop(t) {
    requestAnimationFrame(loop);
    var sy = window.scrollY, ih = innerHeight;
    var max = document.documentElement.scrollHeight - ih;
    prog.style.transform = 'scaleX(' + (max > 0 ? sy / max : 0) + ')';
    var show = sy > ih * 0.7;
    if (show !== dockOn) { dockOn = show; dock.classList.toggle('is-on', show); }
    if (!motion) return;

    m.sx += (m.x - m.sx) * 0.06; m.sy += (m.y - m.sy) * 0.06;
    m.rx += (m.cx - m.rx) * 0.18; m.ry += (m.cy - m.ry) * 0.18;
    if (fine) {
      ring.style.transform = 'translate(' + m.rx + 'px,' + m.ry + 'px)';
      dot.style.transform = 'translate(' + m.cx + 'px,' + m.cy + 'px)';
    }
    if (sy < ih * 1.1) {
      tilt.style.transform = 'perspective(1800px) rotateX(' + (-m.sy * 3).toFixed(2) + 'deg) rotateY(' + (m.sx * 4).toFixed(2) + 'deg) translateY(' + (sy * 0.12) + 'px) scale(' + (1 - Math.min(sy / ih, 1) * 0.05) + ')';
      blobs.forEach(function (b, i) {
        var tx = Math.sin(t / 4200 * (1 + i * 0.3) + i * 2) * 90 + m.sx * 40 * (i + 1);
        var ty = Math.cos(t / 5200 * (1 + i * 0.2) + i) * 70 + m.sy * 30 * (i + 1);
        b.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0) scale(' + (1 + Math.sin(t / 3000 + i) * 0.08) + ')';
      });
      arcDots.forEach(function (c) {
        var a = arcs[+c.dataset.arc], ph = +c.dataset.ph;
        var th = Math.PI + (Math.sin(t / 2400 + ph) * 0.5 + 0.5) * Math.PI;
        c.setAttribute('cx', (a.cx + a.r * Math.cos(th)).toFixed(1));
        c.setAttribute('cy', (a.cy + a.r * Math.sin(th)).toFixed(1));
      });
    }
    depths.forEach(function (el) {
      var d = +el.dataset.depth;
      el.style.transform = 'translate3d(' + (m.sx * d).toFixed(1) + 'px,' + (m.sy * d).toFixed(1) + 'px,0)';
    });
    tilts.forEach(function (s) {
      var tx = 0, ty = 0;
      if (s.over) {
        var r = s.el.getBoundingClientRect();
        tx = Math.max(-1, Math.min(1, ((m.cx - r.left) / r.width) * 2 - 1));
        ty = Math.max(-1, Math.min(1, ((m.cy - r.top) / r.height) * 2 - 1));
      }
      s.x += (tx - s.x) * 0.1;
      s.y += (ty - s.y) * 0.1;
      if (!s.over && Math.abs(s.x) < 0.002 && Math.abs(s.y) < 0.002) {
        if (s.on) {
          s.el.style.rotate = '';
          s.el.style.removeProperty('--px');
          s.el.style.removeProperty('--py');
          s.on = false;
        }
        return;
      }
      s.on = true;
      var ax = -s.y * s.max, ay = s.x * s.max, mag = Math.hypot(ax, ay);
      s.el.style.rotate = mag > 0.01 ? ax.toFixed(3) + ' ' + ay.toFixed(3) + ' 0 ' + mag.toFixed(2) + 'deg' : 'none';
      s.el.style.setProperty('--px', s.x.toFixed(3));
      s.el.style.setProperty('--py', s.y.toFixed(3));
    });
    var po = (0.55 + Math.sin(t / 400) * 0.45).toFixed(2);
    pulses.forEach(function (p) { p.style.opacity = po; });
    mags.forEach(function (el) {
      var r = el.getBoundingClientRect(), dx = m.cx - (r.left + r.width / 2), dy = m.cy - (r.top + r.height / 2);
      var near = Math.hypot(dx, dy) < Math.max(r.width, r.height) * 0.9;
      el.style.transform = near ? 'translate(' + dx * 0.25 + 'px,' + dy * 0.3 + 'px)' : 'translate(0,0)';
    });
  }
  requestAnimationFrame(loop);

  /* ============================================================
     Project illustrations (canvas). Deterministic, seeded, and
     redrawn on resize. Stand-ins until real screenshots exist:
     swap a <canvas> for an <img> in index.html to use a picture.
     ============================================================ */
  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function gauss(r) { var u = 1 - r(), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function hex(h) { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  function ramp(stops) {
    var cs = stops.map(hex);
    return function (v) {
      v = Math.max(0, Math.min(1, v));
      var p = v * (cs.length - 1), i = Math.min(cs.length - 2, Math.floor(p)), f = p - i, a = cs[i], b = cs[i + 1];
      return 'rgb(' + Math.round(a[0] + (b[0] - a[0]) * f) + ',' + Math.round(a[1] + (b[1] - a[1]) * f) + ',' + Math.round(a[2] + (b[2] - a[2]) * f) + ')';
    };
  }
  function rr(x, cx, cy, w, h, r) {
    x.beginPath(); x.moveTo(cx + r, cy); x.arcTo(cx + w, cy, cx + w, cy + h, r); x.arcTo(cx + w, cy + h, cx, cy + h, r);
    x.arcTo(cx, cy + h, cx, cy, r); x.arcTo(cx, cy, cx + w, cy, r); x.closePath();
  }

  var VIZ = {
    /* Mjolnir: clustered gene × spot expression heatmap */
    heatmap: function (x, w, h) {
      var r = rng(7), col = ramp(['#0c140d', '#3f5a3f', '#8FAE8A', '#D3E2CC', '#F3EBDD']);
      var pad = Math.max(14, w * 0.05), cols = w > 520 ? 26 : 18, rows = 13;
      var gw = (w - pad * 2) / cols, gh = (h - pad * 2 - 20) / rows, gap = Math.max(1.5, gw * 0.12);
      for (var j = 0; j < rows; j++) {
        var g = j < 4 ? 0 : j < 8 ? 1 : 2;
        for (var i = 0; i < cols; i++) {
          var block = Math.floor(i / (cols / 3));
          var v = (block === g ? 0.72 : 0.22) + Math.sin(i * 0.5 + j * 1.3) * 0.12 + gauss(r) * 0.12;
          x.fillStyle = col(v);
          rr(x, pad + i * gw, pad + 20 + j * gh, gw - gap, gh - gap, Math.min(3, gw * 0.2));
          x.fill();
        }
      }
      /* column-cluster bar on top */
      ['#C9A46A', '#8FAE8A', '#7FA3A8'].forEach(function (c, b) {
        x.fillStyle = c; rr(x, pad + b * (w - pad * 2) / 3, pad, (w - pad * 2) / 3 - gap * 2, 8, 4); x.fill();
      });
    },

    /* Visual–Omics: spatial-transcriptomics spot array over a tissue section */
    spots: function (x, w, h) {
      var r = rng(32), col = ramp(['#16302f', '#365559', '#7FA3A8', '#C4D8D9', '#E2C08D']);
      var cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.42;
      function rad(th) { return R * (1 + 0.16 * Math.sin(3 * th + 1.1) + 0.09 * Math.sin(5 * th + 2.3) + 0.05 * Math.sin(8 * th)); }
      x.beginPath();
      for (var a = 0; a <= 64; a++) { var th = a / 64 * Math.PI * 2, rd = rad(th); x[a ? 'lineTo' : 'moveTo'](cx + Math.cos(th) * rd * 1.04, cy + Math.sin(th) * rd * 0.9 * 1.04); }
      x.closePath(); x.fillStyle = 'rgba(232,200,215,.16)'; x.fill();
      x.strokeStyle = 'rgba(255,255,255,.25)'; x.lineWidth = 1; x.stroke();
      var hot = [[-0.35, -0.2, 0.32], [0.3, 0.25, 0.28], [0.15, -0.35, 0.2], [-0.2, 0.4, 0.22]];
      var s = Math.max(7, Math.min(w, h) / 30), rowH = s * Math.sqrt(3) / 2;
      for (var yy = cy - R * 1.3, row = 0; yy < cy + R * 1.3; yy += rowH, row++) {
        for (var xx = cx - R * 1.4 + (row % 2) * s / 2; xx < cx + R * 1.4; xx += s) {
          var dx = xx - cx, dy = (yy - cy) / 0.9, t = Math.atan2(dy, dx);
          if (Math.hypot(dx, dy) > rad(t)) continue;
          var nx = dx / R, ny = dy / R, v = 0.15;
          hot.forEach(function (hh) { v += Math.exp(-((nx - hh[0]) * (nx - hh[0]) + (ny - hh[1]) * (ny - hh[1])) / (2 * hh[2] * hh[2])) * 0.8; });
          v += gauss(r) * 0.06;
          x.beginPath(); x.arc(xx, yy, s * 0.36, 0, Math.PI * 2); x.fillStyle = col(v); x.fill();
        }
      }
    },

    /* Macrophage: UMAP embedding coloured by Leiden cluster */
    umap: function (x, w, h) {
      var r = rng(23), pal = ['#F3EBDD', '#E2C08D', '#C9A46A', '#A9C4A2', '#7FA3A8', '#F2C6CF', '#d98f7a'];
      var pad = Math.min(w, h) * 0.2, cl = [];
      for (var k = 0; k < pal.length; k++) {
        cl.push({ x: pad + r() * (w - pad * 2), y: pad + r() * (h - pad * 2), sx: (0.03 + r() * 0.05) * w, sy: (0.03 + r() * 0.05) * h, rot: r() * Math.PI, n: 140 + (r() * 160 | 0), c: pal[k] });
      }
      var ps = Math.max(1.2, Math.min(w, h) / 260);
      cl.forEach(function (c) {
        x.fillStyle = c.c; x.globalAlpha = 0.82;
        var cs = Math.cos(c.rot), sn = Math.sin(c.rot);
        for (var i = 0; i < c.n; i++) {
          var u = gauss(r) * c.sx, v = gauss(r) * c.sy;
          x.beginPath(); x.arc(c.x + u * cs - v * sn, c.y + u * sn + v * cs, ps, 0, Math.PI * 2); x.fill();
        }
      });
      x.globalAlpha = 1;
      x.font = '600 12px Outfit, system-ui, sans-serif'; x.fillStyle = 'rgba(255,255,255,.9)'; x.textAlign = 'center'; x.textBaseline = 'middle';
      cl.forEach(function (c, i) { x.fillText(String(i), c.x, c.y); });
    }
  };

  var canvases = $$('canvas[data-viz]');
  function draw(cv) {
    var w = cv.clientWidth, h = cv.clientHeight; if (!w || !h) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    var x = cv.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, w, h);
    VIZ[cv.dataset.viz](x, w, h);
  }
  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(function (es) { es.forEach(function (e) { draw(e.target); }); });
    canvases.forEach(function (c) { ro.observe(c); });
  } else {
    canvases.forEach(draw);
    window.addEventListener('resize', function () { canvases.forEach(draw); });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { canvases.forEach(draw); });
})();
