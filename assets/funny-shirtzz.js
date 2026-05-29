/* ============================================
   FUNNY SHIRTZZ — Animations & Interactions
   ============================================ */
(function () {
  'use strict';

  /* ---- SVG shapes ---- */
  const SHIRT   = `<svg width="70" height="70" viewBox="0 0 24 24" fill="#FDC308"><path d="M16 2l-2 3H10L8 2 3 6v6l3 1v9h12v-9l3-1V6z"/></svg>`;
  const SHIRT_Y = `<svg width="64" height="64" viewBox="0 0 24 24" fill="#FDF502"><path d="M16 2l-2 3H10L8 2 3 6v6l3 1v9h12v-9l3-1V6z"/></svg>`;
  const STAR    = `<svg width="50" height="50" viewBox="0 0 24 24" fill="#FCD55A"><polygon points="12,2 15,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 9,9"/></svg>`;
  const STAR_SM = `<svg width="36" height="36" viewBox="0 0 24 24" fill="#FDC308"><polygon points="12,2 15,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 9,9"/></svg>`;
  const SMILEY  = `<svg width="62" height="62" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#FDF502"/><circle cx="8.5" cy="10" r="1.6" fill="#06065A"/><circle cx="15.5" cy="10" r="1.6" fill="#06065A"/><path d="M7 14c1.5 2.5 8.5 2.5 10 0" stroke="#06065A" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>`;
  const BOLT    = `<svg width="45" height="45" viewBox="0 0 24 24" fill="#FDF502"><path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H13z"/></svg>`;
  const CIRCLE  = `<svg width="80" height="80" viewBox="0 0 24 24" fill="#FDC308" opacity="0.4"><circle cx="12" cy="12" r="10"/></svg>`;

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

  /* ---- Rebuild the hero to match the mockup ---- */
  function buildHero() {
    // The hero is the FIRST section inside #MainContent
    const mainContent = document.getElementById('MainContent') || document.querySelector('main');
    if (!mainContent) return;
    const heroSection = mainContent.querySelector('.shopify-section:first-child, .shopify-section:first-of-type');
    if (!heroSection || heroSection.querySelector('.fz-hero-built')) return;
    heroSection.querySelector('.fz-hero-built'); // guard

    // Force hero background
    heroSection.style.cssText = `
      position:relative;
      min-height:88vh;
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      background:
        radial-gradient(circle at 20% 20%, rgba(1,0,188,.6), transparent 45%),
        radial-gradient(circle at 80% 70%, rgba(0,0,114,.7), transparent 50%),
        linear-gradient(160deg,#06065A,#0100BC) !important;
      overflow:hidden;
    `;

    // Hide existing Shopify hero content (image, existing text blocks)
    heroSection.querySelectorAll('*').forEach(el => {
      if (!el.closest('.fz-hero-inject')) el.style.display = 'none';
    });

    // Build our hero content
    const inject = document.createElement('div');
    inject.className = 'fz-hero-inject';
    inject.style.cssText = `
      position:relative;z-index:2;
      display:flex;flex-direction:column;
      align-items:center;justify-content:center;
      text-align:center;padding:60px 20px;
      width:100%;
    `;

    inject.innerHTML = `
      <div class="fz-hero-tag" style="
        display:inline-block;
        background:rgba(253,195,8,.15);
        border:1px solid #FDC308;
        color:#FCD55A;
        padding:7px 20px;border-radius:30px;
        font-weight:800;font-size:.8rem;
        letter-spacing:1px;text-transform:uppercase;
        margin-bottom:18px;
        animation:fz-pop-in .8s ease both;
        font-family:'Nunito',sans-serif;
      ">Custom Tees • Printed Fresh • Shipped Fast</div>

      <div style="width:min(680px,92vw);margin:0 auto 8px;">
        <svg viewBox="0 0 680 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;">
          <defs>
            <filter id="fur" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="noise"/>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G"/>
            </filter>
          </defs>
          <text x="50%" y="75%" text-anchor="middle" font-size="88"
            font-family="Fredoka, sans-serif" font-weight="700"
            fill="#FDF502" filter="url(#fur)">Funny Shirtz</text>
        </svg>
      </div>

      <p style="
        max-width:560px;font-size:1.15rem;
        color:#cdd2ff;margin-bottom:30px;line-height:1.6;
        font-family:'Nunito',sans-serif;
      ">Wearable jokes that actually land. Bold designs, soft cotton, zero seriousness allowed.</p>

      <div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center;">
        <a href="/collections/all" style="
          background:#FDC308;color:#06065A;
          padding:16px 36px;border-radius:40px;
          font-weight:800;font-size:1.05rem;
          text-decoration:none;
          box-shadow:0 8px 24px rgba(253,195,8,.35);
          transition:.25s;font-family:'Nunito',sans-serif;
          display:inline-block;
        "
        onmouseover="this.style.background='#FDF502';this.style.transform='translateY(-3px) scale(1.03)'"
        onmouseout="this.style.background='#FDC308';this.style.transform='none'"
        >Shop the Drop</a>

        <a href="/collections" style="
          background:transparent;color:#fff;
          padding:16px 32px;border-radius:40px;
          font-weight:800;font-size:1.05rem;
          border:2px solid rgba(255,255,255,.4);
          text-decoration:none;transition:.25s;
          font-family:'Nunito',sans-serif;
          display:inline-block;
        "
        onmouseover="this.style.borderColor='#FDF502';this.style.color='#FDF502'"
        onmouseout="this.style.borderColor='rgba(255,255,255,.4)';this.style.color='#fff'"
        >Browse Collections</a>
      </div>
    `;

    heroSection.appendChild(inject);
    heroSection.dataset.fzBuilt = '1';

    // Add floating elements
    buildFloaties(heroSection, [
      { svg: SHIRT,   top:'12%',  left:'8%',   dur:'8s',  anim:'fz-float',     opacity:.85 },
      { svg: STAR,    top:'65%',  left:'14%',  dur:'10s', anim:'fz-float-alt', opacity:.85 },
      { svg: SMILEY,  top:'20%',  right:'10%', dur:'11s', anim:'fz-float',     opacity:.85 },
      { svg: SHIRT_Y, top:'72%',  right:'16%', dur:'9s',  anim:'fz-float-alt', opacity:.85 },
      { svg: STAR_SM, top:'42%',  left:'48%',  dur:'7s',  anim:'fz-float',     opacity:.45 },
      { svg: BOLT,    top:'55%',  right:'5%',  dur:'6s',  anim:'fz-float-alt', opacity:.5  },
    ]);
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

    const colors = ['#FDC308','#FDF502','#FCD55A','#0100BC','#dfe2ff','#ffffff'];
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
    launchConfetti();
    fixNavLogo();
    buildHero();
    addSectionFloaties();
    initFadeIn();
    initSparkles();
    setTimeout(initCardGlow, 800); // wait for product cards to render
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
