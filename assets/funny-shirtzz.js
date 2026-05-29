/* ============================================
   FUNNY SHIRTZZ — Animations & Interactions
   ============================================ */
(function () {
  'use strict';

  const isHomepage = window.location.pathname === '/' || window.location.pathname === '';

  /* ---- SVG shapes (charcoal+orange palette) ---- */
  const SHIRT   = `<svg width="70" height="70" viewBox="0 0 24 24" fill="#FF6B35"><path d="M16 2l-2 3H10L8 2 3 6v6l3 1v9h12v-9l3-1V6z"/></svg>`;
  const SHIRT_Y = `<svg width="64" height="64" viewBox="0 0 24 24" fill="#FF8C5A"><path d="M16 2l-2 3H10L8 2 3 6v6l3 1v9h12v-9l3-1V6z"/></svg>`;
  const STAR    = `<svg width="50" height="50" viewBox="0 0 24 24" fill="#F5F0E8"><polygon points="12,2 15,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 9,9"/></svg>`;
  const STAR_SM = `<svg width="36" height="36" viewBox="0 0 24 24" fill="#FF6B35"><polygon points="12,2 15,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 9,9"/></svg>`;
  const SMILEY  = `<svg width="62" height="62" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#FF8C5A"/><circle cx="8.5" cy="10" r="1.6" fill="#1C1C1E"/><circle cx="15.5" cy="10" r="1.6" fill="#1C1C1E"/><path d="M7 14c1.5 2.5 8.5 2.5 10 0" stroke="#1C1C1E" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>`;
  const BOLT    = `<svg width="45" height="45" viewBox="0 0 24 24" fill="#F5F0E8"><path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H13z"/></svg>`;
  const CIRCLE  = `<svg width="80" height="80" viewBox="0 0 24 24" fill="#FF6B35" opacity="0.3"><circle cx="12" cy="12" r="10"/></svg>`;

  /* ---- Inject keyframes ---- */
  function injectKeyframes() {
    if (document.getElementById('fz-kf')) return;
    const st = document.createElement('style');
    st.id = 'fz-kf';
    st.textContent = `
      @keyframes fz-float     { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-28px) rotate(12deg)} }
      @keyframes fz-float-alt { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(24px) rotate(-10deg)} }
      @keyframes fz-pop-in    { from{opacity:0;transform:scale(.8)} to{opacity:1;transform:scale(1)} }
      @keyframes fz-spark     { 0%{transform:scale(0) translateY(0);opacity:1} 60%{transform:scale(1.5) translateY(-30px);opacity:1} 100%{transform:scale(0) translateY(-60px);opacity:0} }
      .fz-fade   { opacity:0; transform:translateY(36px); transition:opacity .7s ease,transform .7s ease; }
      .fz-fade.fz-in { opacity:1; transform:translateY(0); }
    `;
    document.head.appendChild(st);
  }

  /* ---- Build a floaties layer inside any element ---- */
  function buildFloaties(container, items) {
    if (container.querySelector('.fz-floaties')) return;
    const wrap = document.createElement('div');
    wrap.className = 'fz-floaties';
    wrap.style.cssText = 'position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;';
    container.prepend(wrap);
    items.forEach(item => {
      const el = document.createElement('div');
      el.innerHTML = item.svg;
      el.style.cssText = `
        position:absolute;
        top:${item.top||'auto'};left:${item.left||'auto'};
        right:${item.right||'auto'};bottom:${item.bottom||'auto'};
        animation-name:${item.anim};animation-duration:${item.dur};
        animation-timing-function:ease-in-out;animation-iteration-count:infinite;
        opacity:${item.opacity||0.8};pointer-events:none;
      `;
      wrap.appendChild(el);
    });
  }

  /* ---- Replace nav logo with fuzzy "Funny Shirtz" ---- */
  function fixNavLogo() {
    const tryFix = () => {
      const logoLink = document.querySelector('.header-logo__link, .header-logo a, [class*="header-logo"] a');
      if (!logoLink) return false;
      // Hide existing content
      logoLink.style.cssText = `
        font-family:'Fredoka',sans-serif !important;
        font-weight:700 !important;
        font-size:1.9rem !important;
        color:#FDF502 !important;
        text-decoration:none !important;
        letter-spacing:.5px;
      `;
      // Replace text nodes and images with our brand name
      logoLink.innerHTML = '';
      const brand = document.createElement('span');
      brand.className = 'fz-brand-logo';
      brand.textContent = 'Funny Shirtz';
      brand.style.cssText = `
        font-family:'Fredoka',sans-serif;
        font-weight:700;
        font-size:1.9rem;
        color:#FDF502;
        text-shadow:0 0 1px #FDC308,1px 1px 0 #FDC308,-1px 1px 0 #FDC308,2px 2px 1px rgba(253,195,8,.6),0 0 10px rgba(253,213,90,.5);
      `;
      logoLink.appendChild(brand);
      return true;
    };
    if (!tryFix()) setTimeout(tryFix, 500);
  }

  /* ---- Animated flying shirts canvas ---- */
  function launchFlyingShirts(container) {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;';
    container.appendChild(canvas);

    function resize() {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const ctx = canvas.getContext('2d');
    const COLORS = ['#FF6B35','#FF8C5A','#F5F0E8','#A8A09A','#FF4500'];

    // Draw a shirt shape
    function drawShirt(ctx, x, y, size, color, alpha, rotation) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.scale(size / 24, size / 24);
      ctx.fillStyle = color;
      ctx.beginPath();
      // Shirt path: M16 2l-2 3H10L8 2 3 6v6l3 1v9h12v-9l3-1V6z
      ctx.moveTo(16-12, 2-12); ctx.lineTo(14-12, 5-12);
      ctx.lineTo(10-12, 5-12); ctx.lineTo(8-12, 2-12);
      ctx.lineTo(3-12, 6-12); ctx.lineTo(3-12, 12-12);
      ctx.lineTo(6-12, 13-12); ctx.lineTo(6-12, 22-12);
      ctx.lineTo(18-12, 22-12); ctx.lineTo(18-12, 13-12);
      ctx.lineTo(21-12, 12-12); ctx.lineTo(21-12, 6-12);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Draw a star
    function drawStar(ctx, x, y, size, color, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const ox = x + size * Math.cos(angle);
        const oy = y + size * Math.sin(angle);
        i === 0 ? ctx.moveTo(ox, oy) : ctx.lineTo(ox, oy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Create particles
    const particles = [];
    function spawnParticle() {
      const isShirt = Math.random() > 0.3;
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 60,
        size: isShirt ? (30 + Math.random() * 50) : (8 + Math.random() * 16),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 0.15 + Math.random() * 0.55,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -(0.6 + Math.random() * 1.4),
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.04,
        isShirt,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.02 + Math.random() * 0.03,
      });
    }

    // Spawn initial batch
    for (let i = 0; i < 18; i++) {
      spawnParticle();
      particles[i].y = Math.random() * canvas.height;
    }

    let lastSpawn = 0;
    function animate(ts) {
      if (ts - lastSpawn > 1200) { spawnParticle(); lastSpawn = ts; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.wobble += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobble) * 0.5;
        p.y += p.vy;
        p.rotation += p.vr;

        if (p.y < -80) { particles.splice(i, 1); continue; }

        if (p.isShirt) drawShirt(ctx, p.x, p.y, p.size, p.color, p.alpha, p.rotation);
        else drawStar(ctx, p.x, p.y, p.size / 2, p.color, p.alpha);
      }
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  /* ---- Rebuild the hero ---- */
  function buildHero() {
    const mainContent = document.getElementById('MainContent') || document.querySelector('main');
    if (!mainContent) return;
    const heroSection = mainContent.querySelector('.shopify-section:first-child, .shopify-section:first-of-type');
    if (!heroSection || heroSection.dataset.fzBuilt) return;
    heroSection.dataset.fzBuilt = '1';

    heroSection.style.cssText = `
      position:relative;min-height:92vh;
      display:flex;flex-direction:column;
      align-items:center;justify-content:center;
      background:linear-gradient(145deg,#141416 0%,#1C1C1E 40%,#242426 100%);
      overflow:hidden;
    `;

    // Hide existing Shopify content
    heroSection.querySelectorAll('*').forEach(el => {
      if (!el.closest('.fz-hero-inject')) el.style.display = 'none';
    });

    // Launch animated shirts canvas
    launchFlyingShirts(heroSection);

    // Subtle radial glow
    const glow = document.createElement('div');
    glow.style.cssText = `
      position:absolute;inset:0;pointer-events:none;z-index:1;
      background:radial-gradient(ellipse at 50% 60%, rgba(255,107,53,.1) 0%, transparent 65%);
    `;
    heroSection.appendChild(glow);

    const inject = document.createElement('div');
    inject.className = 'fz-hero-inject';
    inject.style.cssText = `
      position:relative;z-index:3;
      display:flex;flex-direction:column;
      align-items:center;justify-content:center;
      text-align:center;padding:80px 20px;width:100%;
    `;

    inject.innerHTML = `
      <div class="fz-hero-tag" style="
        display:inline-block;
        background:rgba(255,107,53,.12);
        border:1px solid rgba(255,107,53,.5);
        color:#FF8C5A;padding:7px 20px;border-radius:30px;
        font-weight:800;font-size:.78rem;letter-spacing:1.5px;text-transform:uppercase;
        margin-bottom:24px;animation:fz-pop-in .8s .2s ease both;
        font-family:'Nunito',sans-serif;
      ">Custom Tees • Printed Fresh • Shipped Fast from Boise, ID</div>

      <div style="width:min(720px,94vw);margin:0 auto 10px;animation:fz-pop-in .9s .1s ease both;">
        <svg viewBox="0 0 720 140" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;">
          <defs>
            <filter id="fur2" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" result="noise"/>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="7" xChannelSelector="R" yChannelSelector="G"/>
            </filter>
            <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#FF6B35"/>
              <stop offset="50%" style="stop-color:#F5F0E8"/>
              <stop offset="100%" style="stop-color:#FF6B35"/>
            </linearGradient>
          </defs>
          <text x="50%" y="76%" text-anchor="middle" font-size="90"
            font-family="Fredoka, sans-serif" font-weight="700"
            fill="url(#titleGrad)" filter="url(#fur2)">Funny Shirtz</text>
        </svg>
      </div>

      <p style="
        max-width:520px;font-size:1.12rem;color:#A8A09A;
        margin-bottom:36px;line-height:1.7;
        font-family:'Nunito',sans-serif;
        animation:fz-pop-in 1s .3s ease both;
      ">Wearable jokes that actually land. Bold designs, soft cotton, zero seriousness allowed.</p>

      <div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center;animation:fz-pop-in 1s .4s ease both;">
        <a class="fz-btn-primary" href="/collections/all" style="
          background:#FF6B35;color:#ffffff;
          padding:15px 38px;border-radius:40px;
          font-weight:800;font-size:1.05rem;
          text-decoration:none;
          box-shadow:0 8px 28px rgba(255,107,53,.4);
          transition:background .2s,transform .2s,box-shadow .2s;
          font-family:'Nunito',sans-serif;display:inline-block;
        ">Shop the Drop</a>
        <a class="fz-btn-ghost" href="/collections/all" style="
          background:rgba(255,255,255,.05);color:#F5F0E8;
          padding:15px 34px;border-radius:40px;
          font-weight:800;font-size:1.05rem;
          border:1.5px solid rgba(245,240,232,.25);
          text-decoration:none;transition:border-color .2s,color .2s,background .2s;
          font-family:'Nunito',sans-serif;display:inline-block;
        ">Browse Collections</a>
      </div>

    `;

    heroSection.appendChild(inject);
  }

  /* ---- Add floaties to other sections ---- */
  function addSectionFloaties() {
    const mainContent = document.getElementById('MainContent') || document.querySelector('main');
    if (!mainContent) return;
    const sections = mainContent.querySelectorAll('.shopify-section:not(:first-child)');
    sections.forEach((sec, i) => {
      sec.style.position = 'relative';
      buildFloaties(sec, i % 2 === 0 ? [
        { svg: CIRCLE, top:'8%',    right:'6%',   dur:'12s', anim:'fz-float',     opacity:.3 },
        { svg: STAR,   bottom:'6%', left:'5%',    dur:'11s', anim:'fz-float-alt', opacity:.35 },
      ] : [
        { svg: SHIRT,  top:'15%',   left:'3%',    dur:'9s',  anim:'fz-float',     opacity:.25 },
        { svg: STAR_SM,bottom:'10%',right:'8%',   dur:'8s',  anim:'fz-float-alt', opacity:.3  },
      ]);
    });

    // Footer
    const footer = document.querySelector('footer, .footer');
    if (footer) {
      footer.style.position = 'relative';
      buildFloaties(footer, [
        { svg: SHIRT_Y, top:'20%',   right:'8%',  dur:'10s', anim:'fz-float',     opacity:.3 },
        { svg: SMILEY,  bottom:'12%',left:'6%',   dur:'13s', anim:'fz-float-alt', opacity:.25 },
        { svg: STAR,    top:'60%',   right:'20%', dur:'8s',  anim:'fz-float',     opacity:.25 },
      ]);
    }
  }

  /* ---- Confetti burst ---- */
  function launchConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;

    const colors = ['#FF6B35','#FF8C5A','#F5F0E8','#2C2C2E','#A8A09A','#ffffff'];
    const pieces = Array.from({length: 140}, () => ({
      x: Math.random() * canvas.width, y: -10 - Math.random() * 300,
      w: 6 + Math.random() * 9, h: 3 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 3.5, vy: 2.5 + Math.random() * 3.5,
      vr: (Math.random() - 0.5) * 0.18, alpha: 1,
    }));

    let frame = 0;
    (function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.rot += p.vr;
        if (frame > 90) p.alpha = Math.max(0, p.alpha - 0.011);
        ctx.save(); ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color; ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        ctx.restore();
      });
      frame++;
      if (frame < 175) requestAnimationFrame(draw); else canvas.remove();
    })();
  }

  /* ---- Scroll fade-in ---- */
  function initFadeIn() {
    const mainContent = document.getElementById('MainContent') || document.querySelector('main');
    if (!mainContent) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('fz-in'); obs.unobserve(e.target); } });
    }, { threshold: 0.06 });
    mainContent.querySelectorAll('.shopify-section:not(:first-child)').forEach(el => {
      el.classList.add('fz-fade'); obs.observe(el);
    });
  }

  /* ---- Button sparkles ---- */
  function initSparkles() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('button, .button, [class*="btn"], a[style*="border-radius"]');
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      ['✨','🎉','⭐'].forEach((ch, i) => {
        const s = document.createElement('span');
        s.textContent = ch;
        s.style.cssText = `position:fixed;pointer-events:none;z-index:9999;font-size:1.4rem;left:${r.left+r.width/2+(i-1)*28}px;top:${r.top-8}px;animation:fz-spark .9s ease forwards;`;
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 900);
      });
    });
  }

  /* ---- Card glow ---- */
  function initCardGlow() {
    document.querySelectorAll('.card-wrapper, .product-card-wrapper').forEach(card => {
      card.addEventListener('mouseenter', () => card.style.boxShadow = '0 0 0 1px #FDC308, 0 18px 40px rgba(253,195,8,0.25)');
      card.addEventListener('mouseleave', () => card.style.boxShadow = '');
    });
  }

  /* ---- Init ---- */
  function init() {
    injectKeyframes();
    fixNavLogo();
    if (isHomepage) {
      launchConfetti();
      buildHero();
    }
    addSectionFloaties();
    initFadeIn();
    initSparkles();
    setTimeout(initCardGlow, 800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
