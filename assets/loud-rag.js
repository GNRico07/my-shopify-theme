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
     IRON CURSOR — follows the pointer, tilts with travel,
     puffs steam on click
     ============================================================ */
  var mouse = { x: -300, y: -300 };

  // Top-down iron: pointed soleplate, steam vents at the nose, handle loop
  var IRON_SVG =
    '<svg viewBox="0 0 40 56" aria-hidden="true">' +
      '<g class="lr-iron-wrap">' +
        '<path class="lr-iron-body" d="M20 2 C11 12 5.5 22 5.5 34 C5.5 46.5 12 53.5 20 53.5 C28 53.5 34.5 46.5 34.5 34 C34.5 22 29 12 20 2 Z"/>' +
        '<circle class="lr-iron-vent" cx="20" cy="11.5" r="1.5"/>' +
        '<circle class="lr-iron-vent" cx="14.6" cy="18"   r="1.5"/>' +
        '<circle class="lr-iron-vent" cx="25.4" cy="18"   r="1.5"/>' +
        '<circle class="lr-iron-vent" cx="11"   cy="26"   r="1.4"/>' +
        '<circle class="lr-iron-vent" cx="29"   cy="26"   r="1.4"/>' +
        '<rect class="lr-iron-heel" x="12" y="46.5" width="16" height="3.4" rx="1.7"/>' +
        '<rect class="lr-iron-grip" x="12.6" y="23" width="14.8" height="22" rx="7.4" fill="none" stroke-width="2.6"/>' +
      '</g>' +
    '</svg>';

  function initCursor() {
    if (!fine) return;

    var iron = document.createElement('div');
    iron.id = 'lr-iron';
    iron.innerHTML = IRON_SVG;

    var lab = document.createElement('div');
    lab.id = 'lr-cursor-label';

    document.body.appendChild(iron);
    document.body.appendChild(lab);

    var ix = -300, iy = -300, lx = -300, ly = -300, tilt = 0;

    document.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    (function loop() {
      var px = ix;
      ix += (mouse.x - ix) * 0.2;
      iy += (mouse.y - iy) * 0.2;
      lx += (mouse.x - lx) * 0.13;
      ly += (mouse.y - ly) * 0.13;

      // Steer the nose toward horizontal travel, capped and eased back
      var target = Math.max(-24, Math.min(24, (ix - px) * 2.1));
      tilt += (target - tilt) * 0.11;

      // Pointer sits at the centre of the soleplate
      iron.style.transform =
        'translate(' + ix + 'px,' + iy + 'px) translate(-50%, -50%) rotate(' + tilt.toFixed(2) + 'deg)';
      lab.style.transform =
        'translate(' + lx + 'px,' + ly + 'px) translate(-50%,-50%) scale(' +
        (lab.classList.contains('is-on') ? 1 : 0) + ')';

      requestAnimationFrame(loop);
    })();

    var HOVER = 'a, button, [role="button"], .lr-btn, .lr-btn-ghost, .card-wrapper, .product-card-wrapper, summary, input, .lr-rev';

    document.addEventListener('mouseover', function (e) {
      var h = e.target.closest(HOVER);
      if (h) {
        iron.classList.add('is-hover');
        var l = h.getAttribute('data-cursor');
        if (l) { lab.textContent = l; lab.classList.add('is-on'); }
        return;
      }
      iron.classList.remove('is-hover');
      lab.classList.remove('is-on');
    }, { passive: true });

    document.addEventListener('mouseleave', function () { iron.style.opacity = '0'; });
    document.addEventListener('mouseenter', function () { iron.style.opacity = '1'; });

    /* --- Steam on click, vented out of the nose --- */
    document.addEventListener('mousedown', function () {
      iron.classList.add('is-press');
      steam(mouse.x, mouse.y, tilt);
    });
    document.addEventListener('mouseup', function () {
      iron.classList.remove('is-press');
    });
  }

  function steam(x, y, deg) {
    var puffs = 5 + Math.floor(Math.random() * 3);
    var rad = (deg || 0) * Math.PI / 180;

    // Vents sit ~22px ahead of centre; follow the nose as it steers
    var nx = x + Math.sin(rad) * 22;
    var ny = y - Math.cos(rad) * 22;

    for (var i = 0; i < puffs; i++) {
      var p = document.createElement('div');
      p.className = 'lr-steam';

      var size = 5 + Math.random() * 11;
      p.style.width  = size + 'px';
      p.style.height = size + 'px';
      p.style.left = (nx - size / 2 + (Math.random() * 16 - 8)) + 'px';
      p.style.top  = (ny - size / 2 + (Math.random() * 10 - 5)) + 'px';
      document.body.appendChild(p);

      // Drift outward along the nose direction, mostly upward
      var drift = Math.sin(rad) * 26 + (Math.random() * 38 - 19);
      var lift  = 40 + Math.random() * 44;
      var dur   = 0.62 + Math.random() * 0.55;

      if (window.gsap) {
        gsap.to(p, {
          x: drift, y: -lift,
          scale: 1.9 + Math.random(),
          opacity: 0,
          duration: dur,
          ease: 'power2.out',
          delay: i * 0.035,
          onComplete: function () { this.targets()[0].remove(); }
        });
      } else {
        p.style.transition = 'transform ' + dur + 's ease-out, opacity ' + dur + 's ease-out';
        (function (el, dx, dy) {
          requestAnimationFrame(function () {
            el.style.transform = 'translate(' + dx + 'px,' + (-dy) + 'px) scale(2.2)';
            el.style.opacity = '0';
          });
          setTimeout(function () { el.remove(); }, dur * 1000 + 60);
        })(p, drift, lift);
      }
    }
  }

  /* ============================================================
     FLOATING ELEMENTS — drift, parallax, repel from cursor
     ============================================================ */
  var SHAPES = {
    shirt: '<path d="M16 2l-2 3h-4L8 2 3 6v6l3 1v9h12v-9l3-1V6z"/>',
    star:  '<polygon points="12,2 14.6,8.6 21.6,9 16.2,13.5 18,20.4 12,16.6 6,20.4 7.8,13.5 2.4,9 9.4,8.6"/>',
    cross: '<path d="M10 2h4v8h8v4h-8v8h-4v-8H2v-4h8z"/>',
    ring:  '<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 4a6 6 0 110 12 6 6 0 010-12z"/>',
    tri:   '<polygon points="12,3 22,20 2,20"/>'
  };

  function svgShape(kind, size, fill, stroke) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" ' +
      'fill="' + (stroke ? 'none' : fill) + '" ' +
      (stroke ? 'stroke="' + fill + '" stroke-width="1"' : '') +
      ' aria-hidden="true">' + SHAPES[kind] + '</svg>';
  }

  function initFloaters() {
    var hero = document.querySelector('.lr-hero');
    if (!hero || reduced) return;

    var layer = document.createElement('div');
    layer.className = 'lr-floaters';
    hero.appendChild(layer);

    var PALETTE = ['#C41E1E', '#E8C547', '#F2EDE3', '#4A4844'];
    var KINDS = ['shirt', 'star', 'cross', 'ring', 'tri', 'shirt', 'star'];
    var COUNT = window.innerWidth < 760 ? 8 : 16;
    var items = [];

    for (var i = 0; i < COUNT; i++) {
      var el = document.createElement('div');
      el.className = 'lr-floater';

      var kind   = KINDS[i % KINDS.length];
      var size   = 16 + Math.random() * 44;
      var color  = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      var hollow = Math.random() > 0.45;

      el.innerHTML = svgShape(kind, size, color, hollow);
      el.style.left = (Math.random() * 96) + '%';
      el.style.top  = (Math.random() * 92) + '%';
      el.style.opacity = (0.10 + Math.random() * 0.3).toFixed(2);

      layer.appendChild(el);
      items.push({ el: el, depth: 0.25 + Math.random() * 1.15, ox: 0, oy: 0 });
    }

    // Entrance + endless drift
    if (window.gsap) {
      gsap.to(layer.children, {
        opacity: function (i, t) { return t.style.opacity; },
        duration: 1.1, stagger: 0.04, delay: 0.7, ease: 'power2.out'
      });

      items.forEach(function (it) {
        gsap.to(it.el, {
          y: '+=' + (28 + Math.random() * 60) * (Math.random() > 0.5 ? 1 : -1),
          x: '+=' + (16 + Math.random() * 40) * (Math.random() > 0.5 ? 1 : -1),
          rotation: (Math.random() * 90 - 45),
          duration: 6 + Math.random() * 7,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      });

      // Parallax out of the hero on scroll
      if (window.ScrollTrigger) {
        items.forEach(function (it) {
          gsap.to(it.el, {
            yPercent: -34 * it.depth * 10,
            ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
          });
        });
      }
    }

    // Cursor repulsion — shapes shy away from the pointer
    if (!fine) return;
    var RANGE = 190;
    var pending = false;

    window.addEventListener('mousemove', function () {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {
        pending = false;
        items.forEach(function (it) {
          var r = it.el.getBoundingClientRect();
          var dx = (r.left + r.width / 2) - mouse.x;
          var dy = (r.top + r.height / 2) - mouse.y;
          var d = Math.hypot(dx, dy);
          var tx = 0, ty = 0;
          if (d < RANGE && d > 0.1) {
            var push = (1 - d / RANGE) * 58 * it.depth;
            tx = (dx / d) * push;
            ty = (dy / d) * push;
          }
          it.ox += (tx - it.ox) * 0.14;
          it.oy += (ty - it.oy) * 0.14;
          it.el.style.marginLeft = it.ox.toFixed(2) + 'px';
          it.el.style.marginTop  = it.oy.toFixed(2) + 'px';
        });
      });
    }, { passive: true });
  }

  /* ============================================================
     CLOTHESLINE — each shirt swings on its own pendulum,
     and gets shoved when the cursor passes through it
     ============================================================ */
  function initClothesline() {
    var hangs = document.querySelectorAll('.lr-hang');
    if (!hangs.length || !window.gsap || reduced) return;

    var pend = [];

    hangs.forEach(function (g, i) {
      var ox = parseFloat(g.getAttribute('data-ox')) || 0;
      var oy = parseFloat(g.getAttribute('data-oy')) || 0;

      gsap.set(g, { transformOrigin: ox + 'px ' + oy + 'px' });

      // Idle sway — different amplitude and period per shirt
      var amp = 3.4 + Math.random() * 4.2;
      var tw = gsap.to(g, {
        rotation: amp,
        duration: 2.1 + Math.random() * 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.22
      });
      gsap.set(g, { rotation: -amp });

      pend.push({ el: g, tw: tw, kick: 0, vel: 0 });
    });

    if (!fine) return;

    // Cursor shove — nudges the shirt, then it oscillates back to idle
    var pending = false;
    window.addEventListener('mousemove', function () {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {
        pending = false;
        pend.forEach(function (p) {
          var r = p.el.getBoundingClientRect();
          var cx = r.left + r.width / 2;
          var cy = r.top + r.height / 2;
          if (Math.hypot(mouse.x - cx, mouse.y - cy) < 130) {
            var dir = mouse.x < cx ? 1 : -1;
            if (Math.abs(p.kick) < 1) {
              p.tw.pause();
              p.kick = dir * (13 + Math.random() * 9);
              swing(p);
            }
          }
        });
      });
    }, { passive: true });

    function swing(p) {
      gsap.to(p.el, {
        rotation: p.kick,
        duration: 0.34,
        ease: 'power2.out',
        onComplete: function () {
          gsap.to(p.el, {
            rotation: 0,
            duration: 2.2,
            ease: 'elastic.out(1, 0.25)',
            onComplete: function () { p.kick = 0; p.tw.restart(); }
          });
        }
      });
    }
  }

  /* ============================================================
     DIAGONAL TICKER — scrolls across the hero
     ============================================================ */
  function initDiagTicker() {
    var track = document.querySelector('.lr-diag-track');
    if (!track || reduced) return;

    var unit = track.querySelector('span');
    if (!unit) return;

    var w = unit.getBoundingClientRect().width;
    if (w < 1) return;

    var wrapW = track.parentElement.offsetWidth;
    var copies = Math.min(Math.ceil((wrapW * 2) / w) + 1, 12);
    for (var i = 0; i < copies; i++) track.appendChild(unit.cloneNode(true));

    var half = track.scrollWidth / 2;
    var pos = 0, boost = 0, last = window.scrollY;

    window.addEventListener('scroll', function () {
      var d = window.scrollY - last;
      last = window.scrollY;
      boost = Math.max(-7, Math.min(7, d * 0.26));
    }, { passive: true });

    (function tick() {
      boost *= 0.93;
      pos -= 0.42 + Math.abs(boost);
      if (pos <= -half) pos += half;
      track.style.transform = 'translate3d(' + pos + 'px,0,0)';
      requestAnimationFrame(tick);
    })();
  }

  /* ============================================================
     HERO MOUSE PARALLAX — layers drift against the pointer
     ============================================================ */
  function initHeroParallax() {
    var hero = document.querySelector('.lr-hero');
    if (!hero || !fine || reduced || !window.gsap) return;

    var layers = [];
    hero.querySelectorAll('[data-par]').forEach(function (el) {
      layers.push({
        el: el,
        amt: parseFloat(el.getAttribute('data-par')) || 0,
        qx: gsap.quickTo(el, 'xPercent', { duration: 0.9, ease: 'power2.out' }),
        qy: gsap.quickTo(el, 'yPercent', { duration: 0.9, ease: 'power2.out' })
      });
    });

    if (!layers.length) return;

    var pending = false;
    hero.addEventListener('mousemove', function (e) {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {
        pending = false;
        var r = hero.getBoundingClientRect();
        var nx = (e.clientX - r.left) / r.width - 0.5;
        var ny = (e.clientY - r.top) / r.height - 0.5;
        layers.forEach(function (l) {
          l.qx(nx * l.amt * 100);
          l.qy(ny * l.amt * 60);
        });
      });
    }, { passive: true });

    hero.addEventListener('mouseleave', function () {
      layers.forEach(function (l) { l.qx(0); l.qy(0); });
    });
  }

  /* ============================================================
     HEADER — hide on scroll down, reveal on scroll up,
     announcement marquee, mobile drawer
     ============================================================ */
  function initHeader() {
    var head = document.getElementById('lr-header');

    if (head) {
      var last = window.scrollY, ticking = false;

      window.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          ticking = false;
          var y = window.scrollY;

          head.classList.toggle('is-solid', y > 40);

          // Never hide near the very top, or while the drawer is open
          var drawerOpen = document.body.classList.contains('lr-drawer-open');
          if (y > 180 && y > last + 4 && !drawerOpen) {
            head.classList.add('is-hidden');
          } else if (y < last - 4 || y < 120) {
            head.classList.remove('is-hidden');
          }
          last = y;
        });
      }, { passive: true });
    }

    /* Announcement marquee */
    var track = document.querySelector('.lr-announce-track');
    if (track && !reduced) {
      var unit = track.querySelector('span');
      if (unit) {
        var uw = unit.getBoundingClientRect().width;
        if (uw > 1) {
          var copies = Math.min(Math.ceil((window.innerWidth * 2) / uw) + 1, 30);
          for (var i = 0; i < copies; i++) track.appendChild(unit.cloneNode(true));
          var half = track.scrollWidth / 2, pos = 0;
          (function tick() {
            pos -= 0.4;
            if (pos <= -half) pos += half;
            track.style.transform = 'translate3d(' + pos + 'px,0,0)';
            requestAnimationFrame(tick);
          })();
        }
      }
    }

    /* Mobile drawer */
    var burger = document.getElementById('lr-burger');
    var drawer = document.getElementById('lr-drawer');
    if (!burger || !drawer) return;

    function setOpen(open) {
      burger.classList.toggle('is-open', open);
      drawer.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.classList.toggle('lr-drawer-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      if (window.__lrLenis) { open ? window.__lrLenis.stop() : window.__lrLenis.start(); }
    }

    burger.addEventListener('click', function () {
      setOpen(!drawer.classList.contains('is-open'));
    });

    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) setOpen(false);
    });
  }

  /* ============================================================
     PRODUCT CARD HOVER REVEAL
     ============================================================ */
  function initCardPeek() {
    document.querySelectorAll('.card-wrapper, .product-card-wrapper').forEach(function (card) {
      if (card.querySelector('.lr-card-peek')) return;
      var peek = document.createElement('div');
      peek.className = 'lr-card-peek';
      peek.innerHTML = '<span>View</span><span>&#8599;</span>';
      card.appendChild(peek);
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
            // Elastic snap back — overshoots slightly, then settles
            gsap.to(m.el, { x: 0, y: 0, duration: 0.85, ease: 'elastic.out(1, 0.42)' });
            m.active = false;
          }
        });
      });
    }, { passive: true });

    // Nav links get a lighter pull
    document.querySelectorAll('.header a, header-component a, .menu__item').forEach(function (link) {
      link.addEventListener('mousemove', function (e) {
        var r = link.getBoundingClientRect();
        gsap.to(link, {
          x: (e.clientX - r.left - r.width / 2) * 0.28,
          y: (e.clientY - r.top - r.height / 2) * 0.4,
          duration: 0.32, ease: 'power2.out'
        });
      });
      link.addEventListener('mouseleave', function () {
        gsap.to(link, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
      });
    });
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

    window.__lrLenis = lenis;

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
      .from(hero.querySelectorAll('.lr-hero-tagline span'), {
        xPercent: -104, rotate: -8, duration: 0.75, ease: 'power4.out'
      }, '-=0.58')
      .from(hero.querySelectorAll('.lr-hang'), {
        yPercent: -180, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'back.out(1.3)'
      }, '-=0.75')
      .from(hero.querySelector('.lr-hero-diag'), { opacity: 0, duration: 0.8 }, '-=0.8')
      .from(hero.querySelectorAll('.lr-hero-sub'), { opacity: 0, y: 22, duration: 0.7 }, '-=0.5')
      .from(hero.querySelectorAll('.lr-hero-cta > *'), { opacity: 0, y: 18, duration: 0.6, stagger: 0.09 }, '-=0.5')
      .from(hero.querySelectorAll('.lr-trust > *'), { opacity: 0, y: 16, duration: 0.5, stagger: 0.07 }, '-=0.45')
      .from(hero.querySelector('.lr-stamp'), { opacity: 0, scale: 0.6, rotate: -50, duration: 0.9, ease: 'back.out(1.6)' }, '-=0.7')
      .from(hero.querySelector('.lr-scroll-cue'), { opacity: 0, duration: 0.5 }, '-=0.3')
      .from(hero.querySelector('.lr-live'), { opacity: 0, x: -18, duration: 0.5 }, '-=0.4');

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
    initHeader();
    initMarquee();
    initDiagTicker();
    initStamp();
    initCardPeek();

    Promise.all([load(CDN.gsap), load(CDN.lenis), load(CDN.split)])
      .then(function () { return load(CDN.st); })
      .then(function () {
        if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
        initLenis();
        heroLoad();
        initFloaters();
        initClothesline();
        initHeroParallax();
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
