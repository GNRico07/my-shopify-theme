/* ============================================================
   FUNNY SHIRTZZ — Direction B: Controlled Chaos
   GSAP + ScrollTrigger + Custom Cursor
   ============================================================ */

(function () {
  'use strict';

  const isHomepage = window.location.pathname === '/' || window.location.pathname === '';

  /* ---- SVG shapes (navy/red palette) ---- */
  const SHIRT   = `<svg width="70" height="70" viewBox="0 0 24 24" fill="#FF2020"><path d="M16 2l-2 3H10L8 2 3 6v6l3 1v9h12v-9l3-1V6z"/></svg>`;
  const SHIRT_W = `<svg width="64" height="64" viewBox="0 0 24 24" fill="rgba(245,240,232,0.15)"><path d="M16 2l-2 3H10L8 2 3 6v6l3 1v9h12v-9l3-1V6z"/></svg>`;
  const STAR    = `<svg width="40" height="40" viewBox="0 0 24 24" fill="rgba(245,240,232,0.12)"><polygon points="12,2 15,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 9,9"/></svg>`;
  const STAR_R  = `<svg width="30" height="30" viewBox="0 0 24 24" fill="rgba(255,32,32,0.25)"><polygon points="12,2 15,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 9,9"/></svg>`;

  /* ---- Custom cursor ---- */
  function initCursor() {
    const cursor = document.createElement('div');
    cursor.id = 'fz-cursor';
    document.body.appendChild(cursor);

    let mx = -100, my = -100;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    });

    document.addEventListener('mouseover', e => {
      const el = e.target.closest('a, button, .card-wrapper, .product-card-wrapper, [class*="btn"]');
      if (el) cursor.classList.add('fz-cursor-hover');
      else cursor.classList.remove('fz-cursor-hover');
    });
  }

  /* ---- Load GSAP + ScrollTrigger ---- */
  function loadGSAP(cb) {
    if (window.gsap && window.ScrollTrigger) { cb(); return; }
    const s1 = document.createElement('script');
    s1.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    s1.onload = () => {
      const s2 = document.createElement('script');
      s2.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';
      s2.onload = () => { gsap.registerPlugin(ScrollTrigger); cb(); };
      document.head.appendChild(s2);
    };
    document.head.appendChild(s1);
  }

  /* ---- Build hero ---- */
  function buildHero() {
    const main = document.getElementById('MainContent') || document.querySelector('main');
    if (!main) return;
    const heroSection = main.querySelector('.shopify-section:first-child, .shopify-section:first-of-type');
    if (!heroSection || heroSection.dataset.fzBuilt) return;
    heroSection.dataset.fzBuilt = '1';

    heroSection.style.cssText = `
      position:relative;min-height:92vh;overflow:hidden;
      background:#0A0A2E;display:flex;align-items:flex-end;
    `;

    heroSection.querySelectorAll('*').forEach(el => {
      if (!el.closest('.fz-hero-inject')) el.style.display = 'none';
    });

    /* Background floaties */
    const bg = document.createElement('div');
    bg.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:0;overflow:hidden;';
    [[SHIRT,'12%','8%','8s','fz-float'],[SHIRT_W,'68%','15%','10s','fz-float-alt'],
     [STAR,'22%','78%','7s','fz-float'],[STAR_R,'74%','72%','9s','fz-float-alt'],
     [SHIRT,'45%','5%','11s','fz-float-alt','0.15'],[STAR,'58%','88%','6s','fz-float','0.2']
    ].forEach(([svg,top,left,dur,anim,op='0.2']) => {
      const el = document.createElement('div');
      el.innerHTML = svg;
      el.style.cssText = `position:absolute;top:${top};left:${left};animation:${anim} ${dur} ease-in-out infinite;opacity:${op};pointer-events:none;`;
      bg.appendChild(el);
    });
    heroSection.appendChild(bg);

    /* Red accent corner */
    const corner = document.createElement('div');
    corner.style.cssText = 'position:absolute;top:0;right:0;width:40vw;height:100%;background:rgba(255,32,32,0.04);clip-path:polygon(20% 0,100% 0,100% 100%,0 100%);pointer-events:none;z-index:1;';
    heroSection.appendChild(corner);

    const inject = document.createElement('div');
    inject.className = 'fz-hero-inject';
    inject.style.cssText = 'position:relative;z-index:3;width:100%;display:grid;grid-template-columns:1fr 1fr;align-items:center;min-height:92vh;';
    inject.innerHTML = `
      <div style="padding:80px 60px 80px;">
        <span class="fz-hero-tag">Boise, Idaho &nbsp;—&nbsp; Wear the Laugh</span>
        <div class="fz-hero-wordmark">
          <span id="fz-w1">FUNNY</span>
          <span id="fz-w2" class="fz-red">SHIRTZ</span>
        </div>
        <p class="fz-hero-sub" id="fz-sub">Wearable jokes that actually land.<br>Bold designs. Soft cotton. Zero seriousness.</p>
        <div class="fz-hero-cta" id="fz-cta">
          <a class="fz-btn-primary" href="/collections/all">Shop the Drop</a>
          <a class="fz-btn-ghost" href="/collections/all">Browse All</a>
        </div>
        <div style="margin-top:48px;font-family:'Inter',sans-serif;font-size:0.7rem;letter-spacing:0.15em;text-transform:uppercase;color:rgba(245,240,232,0.25);" id="fz-scroll-hint">Scroll to explore ↓</div>
      </div>

      <div id="fz-hero-visual" style="display:flex;align-items:center;justify-content:center;height:100%;padding:60px 40px;opacity:0;">
        <div style="position:relative;width:340px;height:340px;">

          <!-- Rotating text ring -->
          <svg id="fz-ring" style="position:absolute;inset:0;width:100%;height:100%;animation:fz-spin 18s linear infinite;" viewBox="0 0 340 340">
            <defs><path id="circle-path" d="M170,170 m-145,0 a145,145 0 1,1 290,0 a145,145 0 1,1 -290,0"/></defs>
            <text font-family="Anton,sans-serif" font-size="13" fill="rgba(245,240,232,0.25)" letter-spacing="8">
              <textPath href="#circle-path">FUNNY SHIRTZ · BOISE IDAHO · WEAR THE LAUGH · MONTHLY DROPS · FUNNY SHIRTZ ·</textPath>
            </text>
          </svg>

          <!-- Big shirt SVG -->
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">
            <svg width="220" height="220" viewBox="0 0 24 24" style="filter:drop-shadow(0 0 40px rgba(255,32,32,0.3));">
              <path d="M16 2l-2 3H10L8 2 3 6v6l3 1v9h12v-9l3-1V6z" fill="#FF2020" opacity="0.9"/>
              <path d="M16 2l-2 3H10L8 2 3 6v6l3 1v9h12v-9l3-1V6z" fill="none" stroke="rgba(245,240,232,0.15)" stroke-width="0.3"/>
            </svg>
          </div>

          <!-- Corner accent boxes -->
          <div style="position:absolute;top:10px;right:10px;width:50px;height:50px;border:2px solid rgba(255,32,32,0.4);"></div>
          <div style="position:absolute;bottom:10px;left:10px;width:30px;height:30px;background:#FF2020;opacity:0.6;"></div>

          <!-- Drop badge -->
          <div style="position:absolute;bottom:-10px;right:20px;background:#FF2020;color:#F5F0E8;font-family:'Anton',sans-serif;font-size:0.65rem;letter-spacing:0.12em;padding:8px 14px;text-transform:uppercase;">Monthly Drop</div>
        </div>
      </div>
    `;
    heroSection.appendChild(inject);

    /* Inject spin keyframe */
    if (!document.getElementById('fz-spin-kf')) {
      const st = document.createElement('style');
      st.id = 'fz-spin-kf';
      st.textContent = '@keyframes fz-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
      document.head.appendChild(st);
    }
  }

  /* ---- GSAP animations ---- */
  function initGSAP() {
    /* Hero entrance */
    if (isHomepage) {
      const tl = gsap.timeline({ delay: 0.1 });
      tl.to('#fz-w1', { x: 0, opacity: 1, duration: 0.5, ease: 'power4.out' }, 0)
        .to('#fz-w2', { x: 0, opacity: 1, duration: 0.5, ease: 'power4.out' }, 0.15)
        .to('#fz-sub', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.4)
        .to('#fz-cta', { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.6)
        .to('#fz-scroll-hint', { opacity: 1, duration: 0.5 }, 0.9);

      gsap.set('#fz-w1', { x: -120, opacity: 0 });
      gsap.set('#fz-w2', { x: 120, opacity: 0 });
      gsap.set('#fz-sub', { opacity: 0, y: 20 });
      gsap.set('#fz-cta', { opacity: 0 });
      gsap.set('#fz-scroll-hint', { opacity: 0 });
      gsap.set('#fz-hero-visual', { opacity: 0, x: 60 });

      tl.to('#fz-hero-visual', { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }, 0.3);

      /* Re-run timeline after sets */
      setTimeout(() => tl.restart(), 50);
    }

    /* Scroll reveals */
    document.querySelectorAll('.fz-reveal').forEach(el => {
      gsap.fromTo(el,
        { x: -80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });
    document.querySelectorAll('.fz-reveal-r').forEach(el => {
      gsap.fromTo(el,
        { x: 80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });
    document.querySelectorAll('.fz-reveal-up').forEach(el => {
      gsap.fromTo(el,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        }
      );
    });

    /* Section headings get reveal class */
    document.querySelectorAll('.shopify-section h2, .shopify-section h3').forEach((el, i) => {
      el.classList.add(i % 2 === 0 ? 'fz-reveal' : 'fz-reveal-r');
    });

    /* Product cards stagger */
    const cards = document.querySelectorAll('.card-wrapper, .product-card-wrapper');
    if (cards.length) {
      gsap.fromTo(cards,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: cards[0], start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    }
  }

  /* ---- Nav logo ---- */
  function fixNavLogo() {
    const tryFix = () => {
      const link = document.querySelector('.header-logo__link, .header-logo a, [class*="header-logo"] a');
      if (!link) return false;
      link.innerHTML = '';
      const span = document.createElement('span');
      span.className = 'fz-brand-logo';
      span.textContent = 'Funny Shirtz';
      link.appendChild(span);
      link.style.textDecoration = 'none';
      return true;
    };
    if (!tryFix()) setTimeout(tryFix, 500);
  }

  /* ---- Floaties for other sections ---- */
  function addSectionFloaties() {
    const main = document.getElementById('MainContent') || document.querySelector('main');
    if (!main) return;
    main.querySelectorAll('.shopify-section:not(:first-child)').forEach((sec, i) => {
      if (sec.querySelector('.fz-floaties')) return;
      sec.style.position = 'relative';
      const wrap = document.createElement('div');
      wrap.className = 'fz-floaties';
      wrap.style.cssText = 'position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;';
      const items = i % 2 === 0
        ? [[STAR_R,'8%','92%','12s','fz-float','0.2'],[SHIRT_W,'80%','5%','9s','fz-float-alt','0.15']]
        : [[STAR,'15%','4%','10s','fz-float-alt','0.15'],[SHIRT_W,'75%','88%','8s','fz-float','0.18']];
      items.forEach(([svg,top,left,dur,anim,op]) => {
        const el = document.createElement('div');
        el.innerHTML = svg;
        el.style.cssText = `position:absolute;top:${top};left:${left};animation:${anim} ${dur} ease-in-out infinite;opacity:${op};`;
        wrap.appendChild(el);
      });
      sec.prepend(wrap);
    });

    const footer = document.querySelector('footer, .footer');
    if (footer && !footer.querySelector('.fz-floaties')) {
      footer.style.position = 'relative';
      const wrap = document.createElement('div');
      wrap.className = 'fz-floaties';
      wrap.style.cssText = 'position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;';
      [[SHIRT,'20%','90%','10s','fz-float','0.12'],[STAR_R,'60%','8%','8s','fz-float-alt','0.15']].forEach(([svg,top,left,dur,anim,op]) => {
        const el = document.createElement('div'); el.innerHTML = svg;
        el.style.cssText = `position:absolute;top:${top};left:${left};animation:${anim} ${dur} ease-in-out infinite;opacity:${op};`;
        wrap.appendChild(el);
      });
      footer.prepend(wrap);
    }
  }

  /* ---- Button sparkles ---- */
  function initSparkles() {
    const style = document.createElement('style');
    style.textContent = `@keyframes fz-spark{0%{transform:scale(0) translateY(0);opacity:1}60%{transform:scale(1.4) translateY(-24px);opacity:1}100%{transform:scale(0) translateY(-50px);opacity:0}}`;
    document.head.appendChild(style);
    document.addEventListener('click', e => {
      const btn = e.target.closest('button, .button, [class*="btn"], .fz-btn-primary, .fz-btn-ghost');
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      ['★','✦','◆'].forEach((ch, i) => {
        const s = document.createElement('span');
        s.textContent = ch;
        s.style.cssText = `position:fixed;pointer-events:none;z-index:99999;font-size:1rem;color:#FF2020;left:${r.left+r.width/2+(i-1)*22}px;top:${r.top-6}px;animation:fz-spark .8s ease forwards;`;
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 800);
      });
    });
  }

  /* ---- Confetti (homepage only) ---- */
  function launchConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const colors = ['#FF2020','#CC0000','#F5F0E8','#0A0A2E','rgba(245,240,232,0.5)'];
    const pieces = Array.from({length: 100}, () => ({
      x: Math.random()*canvas.width, y: -10-Math.random()*200,
      w: 5+Math.random()*8, h: 3+Math.random()*5,
      color: colors[Math.floor(Math.random()*colors.length)],
      rot: Math.random()*Math.PI*2, vx: (Math.random()-.5)*3,
      vy: 2+Math.random()*3, vr: (Math.random()-.5)*.15, alpha: 1,
    }));
    let frame = 0;
    (function draw() {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      pieces.forEach(p => {
        p.x+=p.vx; p.y+=p.vy; p.vy+=0.04; p.rot+=p.vr;
        if (frame>80) p.alpha=Math.max(0,p.alpha-.013);
        ctx.save(); ctx.globalAlpha=p.alpha; ctx.translate(p.x,p.y); ctx.rotate(p.rot);
        ctx.fillStyle=p.color; ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h); ctx.restore();
      });
      frame++;
      if (frame<160) requestAnimationFrame(draw); else canvas.remove();
    })();
  }

  /* ---- Inject keyframes ---- */
  function injectKeyframes() {
    if (document.getElementById('fz-kf')) return;
    const st = document.createElement('style');
    st.id = 'fz-kf';
    st.textContent = `
      @keyframes fz-float     { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-28px) rotate(12deg)} }
      @keyframes fz-float-alt { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(24px) rotate(-10deg)} }
    `;
    document.head.appendChild(st);
  }

  /* ---- Scroll fade ---- */
  function initFadeIn() {
    const main = document.getElementById('MainContent') || document.querySelector('main');
    if (!main) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('fz-in'); obs.unobserve(e.target); }});
    }, { threshold: 0.06 });
    main.querySelectorAll('.shopify-section:not(:first-child)').forEach(el => {
      el.classList.add('fz-fade'); obs.observe(el);
    });
  }

  /* ---- Init ---- */
  function init() {
    injectKeyframes();
    initCursor();
    fixNavLogo();
    if (isHomepage) {
      buildHero();
      launchConfetti();
    }
    addSectionFloaties();
    initFadeIn();
    initSparkles();
    loadGSAP(initGSAP);
    setTimeout(() => {
      document.querySelectorAll('.card-wrapper, .product-card-wrapper').forEach(card => {
        card.addEventListener('mouseenter', () => card.style.boxShadow = '4px 4px 0 #FF2020');
        card.addEventListener('mouseleave', () => card.style.boxShadow = '');
      });
    }, 1000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
