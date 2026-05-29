/* ============================================
   FUNNY SHIRTZZ — Animations & Interactions
   ============================================ */
(function () {
  'use strict';

  /* ---- Confetti burst on load ---- */
  function launchConfetti() {
    const canvas = document.createElement('canvas');
    canvas.id = 'fz-confetti';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#FDC308','#FDF502','#FCD55A','#0100BC','#dfe2ff','#ffffff'];
    const pieces = Array.from({length: 130}, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 300,
      w: 6 + Math.random() * 9,
      h: 3 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 3.5,
      vy: 2.5 + Math.random() * 3.5,
      vr: (Math.random() - 0.5) * 0.18,
      alpha: 1,
    }));

    let frame = 0;
    (function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.rot += p.vr;
        if (frame > 90) p.alpha = Math.max(0, p.alpha - 0.011);
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        ctx.restore();
      });
      frame++;
      if (frame < 170) requestAnimationFrame(draw);
      else canvas.remove();
    })();
  }

  /* ---- Inject floating SVG shirts / stars into hero ---- */
  function injectFloaties() {
    const hero = document.querySelector('.shopify-section:first-of-type, [class*="hero-section"], .hero');
    if (!hero) return;
    hero.style.position = 'relative';

    const wrap = document.createElement('div');
    wrap.className = 'fz-floaties';
    hero.prepend(wrap);

    const items = [
      { svg: `<svg width="70" height="70" viewBox="0 0 24 24" fill="#FDC308"><path d="M16 2l-2 3H10L8 2 3 6v6l3 1v9h12v-9l3-1V6z"/></svg>`, top:'12%', left:'8%', dur:'8s', anim:'fz-float' },
      { svg: `<svg width="50" height="50" viewBox="0 0 24 24" fill="#FCD55A"><polygon points="12,2 15,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 9,9"/></svg>`, top:'65%', left:'14%', dur:'10s', anim:'fz-float-alt' },
      { svg: `<svg width="62" height="62" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#FDF502"/><circle cx="8.5" cy="10" r="1.6" fill="#06065A"/><circle cx="15.5" cy="10" r="1.6" fill="#06065A"/><path d="M7 14c1.5 2.5 8.5 2.5 10 0" stroke="#06065A" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>`, top:'20%', right:'10%', dur:'11s', anim:'fz-float' },
      { svg: `<svg width="64" height="64" viewBox="0 0 24 24" fill="#FDC308"><path d="M16 2l-2 3H10L8 2 3 6v6l3 1v9h12v-9l3-1V6z"/></svg>`, top:'72%', right:'16%', dur:'9s', anim:'fz-float-alt' },
      { svg: `<svg width="40" height="40" viewBox="0 0 24 24" fill="#FCD55A"><polygon points="12,2 15,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 9,9"/></svg>`, top:'42%', left:'48%', dur:'7s', anim:'fz-float', opacity:'0.5' },
    ];

    items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'fz-floatie';
      el.innerHTML = item.svg;
      el.style.cssText = `
        top:${item.top || 'auto'};
        left:${item.left || 'auto'};
        right:${item.right || 'auto'};
        bottom:${item.bottom || 'auto'};
        animation-name:${item.anim};
        animation-duration:${item.dur};
        animation-timing-function:ease-in-out;
        animation-iteration-count:infinite;
        opacity:${item.opacity || '0.85'};
      `;
      wrap.appendChild(el);
    });
  }

  /* ---- Inject fuzzy hero wordmark ---- */
  function injectWordmark() {
    // Find the first heading-like element in the hero
    const heroSection = document.querySelector('.shopify-section:first-of-type');
    if (!heroSection) return;

    // Check if we already injected
    if (heroSection.querySelector('.fz-wordmark-wrap')) return;

    const tagEl = document.createElement('div');
    tagEl.className = 'fz-hero-tag';
    tagEl.textContent = 'Custom Tees • Printed Fresh • Shipped Fast';

    const wm = document.createElement('div');
    wm.className = 'fz-wordmark-wrap';
    wm.innerHTML = `
      <svg viewBox="0 0 680 130" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="fur" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>
        <text x="50%" y="75%" text-anchor="middle" font-size="88"
          font-family="Fredoka, sans-serif" font-weight="700"
          fill="#FDF502" filter="url(#fur)"
          style="text-shadow:0 0 12px rgba(253,213,90,.6)">Funny Shirtzz</text>
      </svg>
    `;

    // Try to insert before the first content block
    const content = heroSection.querySelector('[class*="content"], [class*="inner"], [class*="block"]');
    const insertTarget = content || heroSection.firstElementChild;
    if (insertTarget) {
      insertTarget.prepend(wm);
      insertTarget.prepend(tagEl);
    }
  }

  /* ---- Scroll fade-in ---- */
  function initFadeIn() {
    const els = document.querySelectorAll('.shopify-section');
    els.forEach(el => el.classList.add('fz-fade'));
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('fz-in'); obs.unobserve(e.target); } });
    }, { threshold: 0.06 });
    els.forEach(el => obs.observe(el));
  }

  /* ---- Button sparkles on click ---- */
  function initSparkles() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('button, .button, [class*="btn"]');
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      ['✨','🎉','⭐'].forEach((ch, i) => {
        const s = document.createElement('span');
        s.textContent = ch;
        s.style.cssText = `
          position:fixed;pointer-events:none;z-index:9999;font-size:1.4rem;
          left:${r.left + r.width/2 + (i-1)*28}px;
          top:${r.top - 8}px;
          animation:fz-spark .9s ease forwards;
        `;
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 900);
      });
    });

    // Add keyframes if not already present
    if (!document.getElementById('fz-spark-style')) {
      const st = document.createElement('style');
      st.id = 'fz-spark-style';
      st.textContent = `@keyframes fz-spark{0%{transform:scale(0) translateY(0);opacity:1}60%{transform:scale(1.5) translateY(-30px);opacity:1}100%{transform:scale(0) translateY(-60px);opacity:0}}`;
      document.head.appendChild(st);
    }
  }

  /* ---- Card hover glow ---- */
  function initCardGlow() {
    document.querySelectorAll('.card-wrapper, .product-card-wrapper').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 0 0 1px #FDC308, 0 18px 40px rgba(253,195,8,0.25)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '';
      });
    });
  }

  /* ---- Init ---- */
  function init() {
    launchConfetti();
    injectFloaties();
    injectWordmark();
    initFadeIn();
    initSparkles();
    initCardGlow();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
