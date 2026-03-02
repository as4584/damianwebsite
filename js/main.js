/* ═══════════════════════════════════════════════════════════
   Innovation Business Development Solutions
   Elegant Motion & Interaction Layer
   ═══════════════════════════════════════════════════════════
   
   Principles:
   - Fade-up on scroll (IntersectionObserver)
   - Subtle parallax (CSS transform, not JS scroll)
   - 0.2–0.35s transitions
   - NO bounce, NO elastic curves
   - If it feels playful, it's wrong.
   ═══════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  // ── Scroll Reveal ──────────────────────────────────────
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  document.querySelectorAll('.reveal').forEach((el) => {
    revealObserver.observe(el);
  });

  // ── Navigation Scroll ──────────────────────────────────
  const nav = document.getElementById('siteNav');
  if (nav) {
    let lastScroll = 0;
    const scrollThreshold = 80;

    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      nav.classList.toggle('scrolled', currentScroll > scrollThreshold);
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ── Mobile Navigation Toggle ────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Subtle Parallax on Hero ─────────────────────────────
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && window.matchMedia('(min-width: 769px)').matches) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          const rate = 0.15; // Very subtle
          if (scrolled < window.innerHeight) {
            heroBg.style.transform = `scale(1) translateY(${scrolled * rate}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ── FAQ Accordion (smooth) ──────────────────────────────
  document.querySelectorAll('.faq-item').forEach((item) => {
    const summary = item.querySelector('summary');
    const content = item.querySelector('p');

    if (summary && content) {
      summary.addEventListener('click', (e) => {
        e.preventDefault();

        if (item.hasAttribute('open')) {
          content.style.maxHeight = content.scrollHeight + 'px';
          requestAnimationFrame(() => {
            content.style.maxHeight = '0';
            content.style.opacity = '0';
          });
          setTimeout(() => {
            item.removeAttribute('open');
            content.style.maxHeight = '';
            content.style.opacity = '';
          }, 300);
        } else {
          item.setAttribute('open', '');
          const height = content.scrollHeight;
          content.style.maxHeight = '0';
          content.style.opacity = '0';
          content.style.overflow = 'hidden';
          content.style.transition = 'max-height 0.35s cubic-bezier(0.25,0.1,0.25,1), opacity 0.3s ease';
          requestAnimationFrame(() => {
            content.style.maxHeight = height + 'px';
            content.style.opacity = '1';
          });
          setTimeout(() => {
            content.style.maxHeight = '';
            content.style.overflow = '';
            content.style.transition = '';
          }, 350);
        }
      });
    }
  });

  // ── Active nav link ─────────────────────────────────────
  const currentPath = window.location.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const linkPath = link.getAttribute('href').replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
    if (linkPath === currentPath) {
      link.classList.add('active');
    }
  });

  // ── Form validation (light) ─────────────────────────────
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn');
      if (btn) {
        btn.textContent = 'MESSAGE SENT';
        btn.style.background = 'var(--accent)';
        btn.style.color = 'var(--bg-dark)';
        btn.disabled = true;
      }
    });
  }

})();
