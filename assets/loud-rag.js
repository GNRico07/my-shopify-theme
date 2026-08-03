/* ============================================================
   LOUD RAG — Motion Layer
   Lenis + GSAP + ScrollTrigger + SplitType
   Custom cursor, magnetic CTAs, scroll choreography
   ============================================================ */

(function () {
  'use strict';

  var CDN = {
    lenis:  'https://cdnjs.cloudflare.com/ajax/libs/lenis/1.0.42/lenis.min.js',
    gsap:   'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
    st:     'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
    split:  'https://cdnjs.cloudflare.com/ajax/libs/split-type/0.3.4/index.umd.min.js'
  };

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine    = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- script loader ---------- */
  function load(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = res;
      s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  /* ============================================================
     GRAIN
     ============================================================ */
  function initGrain() {
    if (document.getElementById('lr-grain')) return;
    var g = document.createElement('div');
    g.id = 'lr-grain';
    document.body.appendChild(g);
  }

  /* ============================================================
     CUSTOM CURSOR — morphs on hover, shows contextual label
     ============================================================ */
  function initCursor() {
    if (!fine) return;

    var dot = document.createElement('div');
    dot.id = 'lr-cursor';
    var lab = document.createElement('div');
    lab.id = 'lr-cursor-label';
    document.body.appendChild(dot);
    document.body.appendChild(lab);

    var mx = -200, my = -200, cx = -200, cy = -200;
    var lx = -200, ly = -200;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
    }, { passive: true });

    (function loop() {
      cx += (mx - cx) * 0.22;
      cy += (my - cy) * 0.22;
      lx += (mx - lx) * 0.13;
      ly += (my - ly) * 0.13;
      dot.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
      lab.style.transform = 'translate(' + lx + 'px,' + ly + 'px) translate(-50%,-50%) scale(' +
        (lab.classList.contains('is-on') ? 1 : 0) + ')';
      requestAnimationFrame(loop);
    })();

    var HOVER = 'a, button, [role="button"], .lr-btn, .lr-btn-ghost, .card-wrapper, .product-card-wrapper, summary';
    var TEXT  = 'p, h1, h2, h3, h4, .lr-body, .lr-quote';

    document.addEventListener('mouseover', function (e) {
      var h = e.target.closest(HOVER);
      if (h) {
        dot.classList.add('is-hover');
        dot.classList.remove('is-text');
        var l = h.getAttribute('data-cursor');
        if (l) { lab.textContent = l; lab.classList.add('is-on'); }
        return;
      }
      dot.classList.remove('is-hover');
      lab.classList.remove('is-on');
      dot.classList.toggle('is-text', !!e.target.closest(TEXT));
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      dot.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
      dot.style.opacity = '1';
    });
  }

  /* ============================================================
     MAGNETIC CTAs — element pulls toward cursor inside radius
     ============================================================ */
  function initMagnetic() {
    if (!fine || reduced || !window.gsap) return;

    var RADIUS = 90;
    var PULL = 0.34;

    var magnets = [];
    document.querySelectorAll('.lr-btn, .lr-btn-ghost, [data-magnetic]').forEach(function (el) {
      magnets.push({
        el: el,
        qx: gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' }),
        qy: gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' }),
        active: false
      });
    });

    if (!magnets.length) return;

    // Single shared listener — one rAF-throttled pass over all magnets
    var pending = false, px = 0, py = 0;

    window.addEventListener('mousemove', function (e) {
      px = e.clientX; py = e.clientY;
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {
        pending = false;
        magnets.forEach(function (m) {
          var r = m.el.getBoundingClientRect();
          if (r.bottom < -200 || r.top > window.innerHeight + 200) {
            if (m.active) { m.qx(0); m.qy(0); m.active = false; }
            return;
          }
          var ox = px - (r.left + r.width / 2);
          var oy = py - (r.top + r.height / 2);
          var reach = RADIUS + Math.max(r.width, r.height) / 2;
          if (Math.hypot(ox, oy) < reach) {
            m.qx(ox * PULL); m.qy(oy * PULL); m.active = true;
          } else if (m.active) {
            m.qx(0); m.qy(0); m.active = false;
          }
        });
      });
    }, { passive: true });
  }

  /* ============================================================
     LENIS SMOOTH SCROLL
     ============================================================ */
  function initLenis() {
    if (reduced || !window.Lenis) return null;

    var lenis = new Lenis({
      duration: 1.15,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.6
    });

    if (window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })();
    }

    // Anchor links respect Lenis
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var t = document.querySelector(id);
        if (!t) return;
        e.preventDefault();
        lenis.scrollTo(t, { offset: -80 });
      });
    });

    return lenis;
  }

  /* ============================================================
     HERO LOAD — cinematic assemble
     ============================================================ */
  function heroLoad() {
    var hero = document.querySelector('.lr-hero');
    if (!hero || !window.gsap) return;

    var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Wipe: red slab sweeps across then retracts
    var wipe = document.createElement('div');
    wipe.style.cssText = 'position:fixed;inset:0;background:#C41E1E;z-index:9997;transform-origin:left center;pointer-events:none;';
    document.body.appendChild(wipe);

    tl.set(wipe, { scaleX: 0 })
      .to(wipe, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' })
      .set(wipe, { transformOrigin: 'right center' })
      .to(wipe, { scaleX: 0, duration: 0.6, ease: 'power3.inOut' }, '+=0.08')
      .add(function () { wipe.remove(); });

    // Headline lines rise out of their masks
    var lines = hero.querySelectorAll('.lr-hero-head .lr-line > *');
    if (lines.length) {
      tl.from(lines, { yPercent: 118, duration: 0.9, stagger: 0.085 }, '-=0.42');
    }

    tl.from(hero.querySelectorAll('.lr-eyebrow'), { opacity: 0, y: 14, duration: 0.6 }, '-=0.7')
      .from(hero.querySelectorAll('.lr-hero-sub'), { opacity: 0, y: 22, duration: 0.7 }, '-=0.5')
      .from(hero.querySelectorAll('.lr-hero-cta > *'), { opacity: 0, y: 18, duration: 0.6, stagger: 0.09 }, '-=0.5')
      .from(hero.querySelectorAll('.lr-trust > *'), { opacity: 0, y: 16, duration: 0.5, stagger: 0.07 }, '-=0.45')
      .from(hero.querySelector('.lr-stamp'), { opacity: 0, scale: 0.6, rotate: -50, duration: 0.9, ease: 'back.out(1.6)' }, '-=0.7')
      .from(hero.querySelector('.lr-scroll-cue'), { opacity: 0, duration: 0.5 }, '-=0.3');

    // Slab + halftone drift on scroll
    if (window.ScrollTrigger) {
      gsap.to(hero.querySelector('.lr-hero-slab'), {
        yPercent: 16, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
      });
      gsap.to(hero.querySelector('.lr-hero-halftone'), {
        yPercent: 26, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
      });
      gsap.to(hero.querySelector('.lr-hero-inner'), {
        yPercent: 12, opacity: 0.25, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'center center', end: 'bottom top', scrub: true }
      });
    }
  }

  /* ============================================================
     SPLIT HEADINGS — words stagger in on scroll
     ============================================================ */
  function initSplit() {
    if (!window.SplitType || !window.gsap || !window.ScrollTrigger) return;

    document.querySelectorAll('.lr-split').forEach(function (el) {
      var st = new SplitType(el, { types: 'lines,words', lineClass: 'lr-l' });

      // Wrap lines so words can rise out of a mask
      (st.lines || []).forEach(function (line) { line.style.overflow = 'hidden'; });

      gsap.from(st.words, {
        yPercent: 112,
        opacity: 0,
        duration: 0.85,
        ease: 'power4.out',
        stagger: 0.035,
        scrollTrigger: { trigger: el, start: 'top 86%', once: true }
      });
    });
  }

  /* ============================================================
     SECTION CHOREOGRAPHY
     ============================================================ */
  function initReveals() {
    if (!window.gsap || !window.ScrollTrigger) return;

    document.body.classList.add('lr-motion-ready');

    // Generic fades with directional intent
    var map = [
      ['.lr-fade-up',   { y: 46,  x: 0 }],
      ['.lr-fade-left', { y: 0,   x: -56 }],
      ['.lr-fade-right',{ y: 0,   x: 56 }]
    ];

    map.forEach(function (pair) {
      document.querySelectorAll(pair[0]).forEach(function (el) {
        gsap.from(el, {
          opacity: 0,
          y: pair[1].y,
          x: pair[1].x,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        });
      });
    });

    // Staggered groups
    document.querySelectorAll('[data-stagger]').forEach(function (group) {
      gsap.from(group.children, {
        opacity: 0,
        y: 44,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.09,
        scrollTrigger: { trigger: group, start: 'top 85%', once: true }
      });
    });

    // Section index numerals drift
    document.querySelectorAll('.lr-index').forEach(function (el) {
      gsap.to(el, {
        yPercent: -34, ease: 'none',
        scrollTrigger: { trigger: el.closest('section') || el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    // Story panel parallax
    document.querySelectorAll('.lr-story-panel').forEach(function (el) {
      gsap.fromTo(el, { yPercent: 7 }, {
        yPercent: -7, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    // Product cards stagger
    var cards = document.querySelectorAll('.card-wrapper, .product-card-wrapper');
    if (cards.length) {
      gsap.from(cards, {
        opacity: 0, y: 52, duration: 0.75, ease: 'power3.out', stagger: 0.06,
        scrollTrigger: { trigger: cards[0].closest('.shopify-section') || cards[0], start: 'top 82%', once: true }
      });
    }

    // Bone sections wipe in from the bottom edge
    document.querySelectorAll('.lr-sec--bone, .lr-cta').forEach(function (el) {
      gsap.from(el, {
        clipPath: 'inset(100% 0% 0% 0%)',
        duration: 1.05,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true }
      });
    });
  }

  /* ============================================================
     MARQUEE — seamless, direction-aware on scroll
     ============================================================ */
  function initMarquee() {
    document.querySelectorAll('.lr-marquee').forEach(function (wrap) {
      var track = wrap.querySelector('.lr-marquee-track');
      if (!track) return;

      // Duplicate content until it comfortably overflows twice
      var unit = track.querySelector('span');
      if (!unit || !unit.textContent.trim()) return;

      var unitW = unit.getBoundingClientRect().width;
      if (unitW < 1) return;

      var need = Math.ceil((wrap.offsetWidth * 2.2) / unitW);
      var copies = Math.min(Math.max(need - 1, 1), 40); // hard cap
      for (var i = 0; i < copies; i++) {
        track.appendChild(unit.cloneNode(true));
      }

      var half = track.scrollWidth / 2;
      var dir = wrap.hasAttribute('data-reverse') ? 1 : -1;
      var base = parseFloat(wrap.getAttribute('data-speed')) || 0.55;
      var pos = 0, boost = 0, last = window.scrollY;

      window.addEventListener('scroll', function () {
        var d = window.scrollY - last;
        last = window.scrollY;
        boost = Math.max(-9, Math.min(9, d * 0.32));
      }, { passive: true });

      (function tick() {
        boost *= 0.92;
        pos += (base + Math.abs(boost)) * dir;
        if (dir < 0 && pos <= -half) pos += half;
        if (dir > 0 && pos >= 0) pos -= half;
        track.style.transform = 'translate3d(' + pos + 'px,0,0)';
        requestAnimationFrame(tick);
      })();
    });
  }

  /* ============================================================
     COUNTERS — count up when scrolled into view
     ============================================================ */
  function initCounters() {
    var nodes = document.querySelectorAll('[data-count]');
    if (!nodes.length) return;

    function run(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var dec = (el.getAttribute('data-dec') | 0);
      var obj = { v: 0 };

      if (window.gsap) {
        gsap.to(obj, {
          v: target, duration: 1.7, ease: 'power2.out',
          onUpdate: function () { el.textContent = obj.v.toFixed(dec) + suffix; }
        });
      } else {
        el.textContent = target.toFixed(dec) + suffix;
      }
    }

    if (window.ScrollTrigger) {
      nodes.forEach(function (el) {
        ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: function () { run(el); } });
      });
    } else {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
      }, { threshold: 0.4 });
      nodes.forEach(function (el) { io.observe(el); });
    }
  }

  /* ============================================================
     COUNTDOWN — next monthly drop
     ============================================================ */
  function initCountdown() {
    var root = document.querySelector('[data-countdown]');
    if (!root) return;

    var attr = root.getAttribute('data-countdown');
    var target;

    if (attr && attr !== 'auto') {
      target = new Date(attr);
    }
    // Fall back to the 1st of next month
    if (!target || isNaN(target.getTime())) {
      var n = new Date();
      target = new Date(n.getFullYear(), n.getMonth() + 1, 1, 10, 0, 0);
    }

    var cells = {
      d: root.querySelector('[data-unit="days"]'),
      h: root.querySelector('[data-unit="hours"]'),
      m: root.querySelector('[data-unit="minutes"]'),
      s: root.querySelector('[data-unit="seconds"]')
    };

    function pad(n) { return String(Math.max(0, n)).padStart(2, '0'); }

    function tick() {
      var diff = target - new Date();
      if (diff < 0) diff = 0;
      var s = Math.floor(diff / 1000);
      if (cells.d) cells.d.textContent = pad(Math.floor(s / 86400));
      if (cells.h) cells.h.textContent = pad(Math.floor(s / 3600) % 24);
      if (cells.m) cells.m.textContent = pad(Math.floor(s / 60) % 60);
      if (cells.s) cells.s.textContent = pad(s % 60);
    }

    tick();
    setInterval(tick, 1000);
  }

  /* ============================================================
     ROTATING STAMP
     ============================================================ */
  function initStamp() {
    var ring = document.querySelector('#lr-stamp-ring');
    if (!ring) return;

    var angle = 0, speed = 0.16, target = 0.16;
    var mx = -9999, my = -9999;

    window.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });

    (function spin() {
      var r = ring.getBoundingClientRect();
      var d = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2));
      target = d < 300 ? 0.16 + (1 - d / 300) * 2.6 : 0.16;
      speed += (target - speed) * 0.07;
      angle = (angle + speed) % 360;
      ring.style.transform = 'rotate(' + angle + 'deg)';
      requestAnimationFrame(spin);
    })();
  }

  /* ============================================================
     BOOT
     ============================================================ */
  function boot() {
    initGrain();
    initCursor();
    initMarquee();
    initStamp();

    Promise.all([load(CDN.gsap), load(CDN.lenis), load(CDN.split)])
      .then(function () { return load(CDN.st); })
      .then(function () {
        if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
        initLenis();
        heroLoad();
        initSplit();
        initReveals();
        initMagnetic();
        initCounters();
        initCountdown();
        if (window.ScrollTrigger) {
          ScrollTrigger.refresh();
          window.addEventListener('load', function () { ScrollTrigger.refresh(); });
        }
      })
      .catch(function () {
        // Graceful degradation — never leave content hidden
        document.body.classList.add('lr-motion-ready');
        document.querySelectorAll('.lr-fade, .lr-fade-up, .lr-fade-left, .lr-fade-right')
          .forEach(function (el) { el.style.opacity = 1; });
        initCounters();
        initCountdown();
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
