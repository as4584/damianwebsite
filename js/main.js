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
    const scrollThreshold = 80;
    const hasHero = !!document.querySelector('.hero');

    const syncNavState = () => {
      const currentScroll = window.scrollY;
      const shouldBeScrolled = !hasHero || currentScroll > scrollThreshold;
      nav.classList.toggle('scrolled', shouldBeScrolled);
    };

    syncNavState();

    window.addEventListener('scroll', () => {
      syncNavState();
    }, { passive: true });
  }

  // ── Mobile Navigation Toggle ────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  let navOverlay = null;

  if (navToggle && navLinks) {
    const ensureOverlay = () => {
      if (navOverlay) return navOverlay;
      navOverlay = document.createElement('div');
      navOverlay.className = 'nav-overlay';
      document.body.appendChild(navOverlay);
      navOverlay.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navOverlay.classList.remove('open');
        document.body.style.overflow = '';
      });
      return navOverlay;
    };

    const closeMenu = () => {
      navLinks.classList.remove('open');
      if (navOverlay) {
        navOverlay.classList.remove('open');
      }
      document.body.style.overflow = '';
    };

    navToggle.addEventListener('click', () => {
      const isOpening = !navLinks.classList.contains('open');
      navLinks.classList.toggle('open', isOpening);
      const overlay = ensureOverlay();
      overlay.classList.toggle('open', isOpening);
      document.body.style.overflow = isOpening ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 960) {
        closeMenu();
      }
    });
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

  // ── Animated Stat Counters ──────────────────────────────
  const statElements = document.querySelectorAll('.hero-stat-number, .stat-number');
  if (statElements.length > 0) {
    const statObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent.trim();
          
          if (/^[\d,]+(\+)?$/.test(text)) {
            const isPlus = text.includes('+');
            const targetNum = parseInt(text.replace(/[,+]/g, ''), 10);
            
            if (!isNaN(targetNum)) {
              let startTimestamp = null;
              const duration = 1200;
              
              const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                
                const easeProgress = 1 - Math.pow(1 - progress, 4); // easeOutQuart
                const currentNum = Math.floor(easeProgress * targetNum);
                
                el.textContent = currentNum.toLocaleString('en-US') + (isPlus ? '+' : '');
                
                if (progress < 1) {
                  window.requestAnimationFrame(step);
                } else {
                  el.textContent = text;
                }
              };
              
              window.requestAnimationFrame(step);
            }
          }
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.1 });
    
    statElements.forEach(el => statObserver.observe(el));
  }

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
