/* ===========================
   FUNNY SHIRTZZ — Animations
   =========================== */

(function () {
  'use strict';

  /* ---------- Floating emoji background ---------- */
  const EMOJIS = ['😂', '👕', '🤣', '✨', '🎉', '😜', '👚', '💥', '🔥', '😎', '🤙', '💀'];

  function createFloaters() {
    const container = document.createElement('div');
    container.className = 'fz-floaters';
    document.body.prepend(container);

    for (let i = 0; i < 18; i++) {
      const el = document.createElement('span');
      el.className = 'fz-floater';
      el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      el.style.left = Math.random() * 100 + 'vw';
      el.style.fontSize = (1.2 + Math.random() * 2) + 'rem';
      el.style.animationDuration = (12 + Math.random() * 18) + 's';
      el.style.animationDelay = (Math.random() * 20) + 's';
      container.appendChild(el);
    }
  }

  /* ---------- Confetti burst on load ---------- */
  function launchConfetti() {
    const canvas = document.createElement('canvas');
    canvas.id = 'fz-confetti-canvas';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#ff6b35', '#ff3d7f', '#ffe600', '#7b2fff', '#00c6ff', '#ffffff'];
    const pieces = [];

    for (let i = 0; i < 120; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: -10 - Math.random() * 200,
        w: 8 + Math.random() * 8,
        h: 4 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 4,
        vr: (Math.random() - 0.5) * 0.2,
        opacity: 1,
      });
    }

    let frame = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.rotation += p.vr;
        if (frame > 80) p.opacity -= 0.012;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      frame++;
      if (frame < 160) requestAnimationFrame(draw);
      else canvas.remove();
    }
    draw();
  }

  /* ---------- Scroll fade-in ---------- */
  function initScrollFade() {
    const targets = document.querySelectorAll('.shopify-section, .section');
    targets.forEach(el => el.classList.add('fz-fade-in'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('fz-visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });

    targets.forEach(el => observer.observe(el));
  }

  /* ---------- Product card wiggle on hover ---------- */
  function initCardWiggle() {
    document.addEventListener('mouseover', (e) => {
      const card = e.target.closest('.card-wrapper, .product-card-wrapper');
      if (card) {
        card.style.animation = 'none';
        void card.offsetWidth; // reflow
        card.style.animation = '';
      }
    });
  }

  /* ---------- Sparkles on button click ---------- */
  function initButtonSparkles() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.button, [class*="button"], .btn');
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      ['✨', '🎉', '💥'].forEach((emoji, i) => {
        const el = document.createElement('span');
        el.className = 'fz-sparkle';
        el.textContent = emoji;
        el.style.left = (rect.left + rect.width / 2 + (i - 1) * 30) + 'px';
        el.style.top = (rect.top - 10 + window.scrollY) + 'px';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1000);
      });
    });
  }

  /* ---------- Typing effect on hero heading ---------- */
  function initHeroType() {
    const heroText = document.querySelector('.hero .rte p, .hero p, [class*="hero"] p');
    if (!heroText) return;
    const original = heroText.textContent.trim();
    heroText.textContent = '';
    heroText.style.borderRight = '2px solid currentColor';
    let i = 0;
    const timer = setInterval(() => {
      heroText.textContent += original[i];
      i++;
      if (i >= original.length) {
        clearInterval(timer);
        setTimeout(() => heroText.style.borderRight = 'none', 800);
      }
    }, 60);
  }

  /* ---------- Init ---------- */
  function init() {
    createFloaters();
    launchConfetti();
    initScrollFade();
    initCardWiggle();
    initButtonSparkles();
    setTimeout(initHeroType, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
