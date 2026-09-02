/* ===================================================================
   Yair Cohen — Portfolio  ·  Main JavaScript
   Pure vanilla JS — no jQuery, no external dependencies
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Loader ────────────────────────────────────────────────────── */
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 600);
    });
    // Fallback: force-hide after 3 s even if some assets fail
    setTimeout(() => loader.classList.add('hidden'), 3000);
  }

  /* ── Navbar scroll effect ──────────────────────────────────────── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile menu ───────────────────────────────────────────────── */
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks   = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
    // Close when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ── Active nav link on scroll ─────────────────────────────────── */
  const sections = document.querySelectorAll('.section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  if (sections.length && navAnchors.length) {
    const activateLink = () => {
      const scrollPos = window.scrollY + 200;
      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.id;
        if (scrollPos >= top && scrollPos < top + height) {
          navAnchors.forEach(a => a.classList.remove('active'));
          const match = document.querySelector(`.nav-links a[href="#${id}"]`);
          if (match) match.classList.add('active');
        }
      });
    };
    window.addEventListener('scroll', activateLink, { passive: true });
    activateLink();
  }

  /* ── Typing effect ─────────────────────────────────────────────── */
  const typingEl = document.querySelector('.typing-text');
  if (typingEl) {
    const phrases = JSON.parse(typingEl.dataset.phrases || '[]');
    let phraseIdx = 0;
    let charIdx   = 0;
    let deleting   = false;
    const speed    = { type: 80, delete: 40, pause: 1800 };

    function typeLoop() {
      const current = phrases[phraseIdx] || '';
      if (!deleting) {
        typingEl.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx >= current.length) {
          deleting = true;
          setTimeout(typeLoop, speed.pause);
          return;
        }
        setTimeout(typeLoop, speed.type);
      } else {
        typingEl.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx <= 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(typeLoop, 300);
          return;
        }
        setTimeout(typeLoop, speed.delete);
      }
    }
    typeLoop();
  }

  /* ── Scroll reveal (Intersection Observer) ─────────────────────── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  /* ── Slideshow (project detail pages) ──────────────────────────── */
  const slideshow = document.querySelector('.slideshow');
  if (slideshow) {
    const slides   = slideshow.querySelectorAll('.slide');
    const dots     = slideshow.querySelectorAll('.slide-dot');
    const prevBtn  = slideshow.querySelector('.prev');
    const nextBtn  = slideshow.querySelector('.next');
    let current    = 0;

    function goTo(idx) {
      slides.forEach(s => s.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    // Auto-advance every 5s
    let autoplay = setInterval(() => goTo(current + 1), 5000);
    slideshow.addEventListener('mouseenter', () => clearInterval(autoplay));
    slideshow.addEventListener('mouseleave', () => {
      autoplay = setInterval(() => goTo(current + 1), 5000);
    });

    goTo(0);
  }

  /* ── Lightbox ──────────────────────────────────────────────────── */
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  if (lightbox && lightboxImg) {
    document.querySelectorAll('[data-lightbox]').forEach(img => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
      });
    });
    lightbox.addEventListener('click', () => {
      lightbox.classList.remove('active');
      lightboxImg.src = '';
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        lightbox.classList.remove('active');
        lightboxImg.src = '';
      }
    });
  }

});