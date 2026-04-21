/* ===========================
   FIDELAVIS — Main JS
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile menu toggle ---
  const burger = document.querySelector('.nav__burger');
  const navLinks = document.querySelector('.nav__links');

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('nav__links--open');
      burger.classList.toggle('nav__burger--open');
    });

    navLinks.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('nav__links--open');
        burger.classList.remove('nav__burger--open');
      });
    });
  }

  // --- Navbar scroll effect ---
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
    });
  }

  // --- FAQ accordion ---
  document.querySelectorAll('.faq-item__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('faq-item--open');

      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('faq-item--open');
      });

      if (!isOpen) {
        item.classList.add('faq-item--open');
      }
    });
  });

  // --- Scroll reveal animations ---
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // --- Demo carousel arrows ---
  const carousel = document.querySelector('.demo__screens');
  const arrowLeft = document.querySelector('.demo__arrow--left');
  const arrowRight = document.querySelector('.demo__arrow--right');

  if (carousel && arrowLeft && arrowRight) {
    const scrollAmount = 280;

    arrowRight.addEventListener('click', () => {
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    arrowLeft.addEventListener('click', () => {
      carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
  }

  // --- Modal démo ---
  const modal = document.getElementById('demo-modal');

  function openModal() {
    if (!modal) return;
    modal.classList.add('modal--visible');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => modal.classList.add('modal--open'));
    });
    const firstInput = document.getElementById('f-prenom');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('modal--open');
    setTimeout(() => {
      modal.classList.remove('modal--visible');
      document.body.style.overflow = '';
      // Reset form state
      const fc = document.getElementById('form-container');
      const fs = document.getElementById('form-success');
      const form = document.getElementById('demo-form');
      const errEl = document.getElementById('form-error');
      const btnLabel = document.getElementById('btn-label');
      const btnLoader = document.getElementById('btn-loader');
      const submitBtn = document.getElementById('form-submit-btn');
      if (fc) fc.hidden = false;
      if (fs) fs.hidden = true;
      if (form) form.reset();
      if (errEl) errEl.hidden = true;
      if (btnLabel) btnLabel.hidden = false;
      if (btnLoader) btnLoader.hidden = true;
      if (submitBtn) submitBtn.disabled = false;
    }, 300);
  }

  // Event delegation — catches all [data-open-demo] clicks anywhere on page
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-open-demo]');
    if (trigger) {
      e.preventDefault();
      openModal();
    }
  });

  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  const closeSuccessBtn = document.getElementById('modal-close-success');
  if (overlay) overlay.addEventListener('click', closeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.hidden) closeModal();
  });

  // Form submit
  const demoForm = document.getElementById('demo-form');
  if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const prenom     = document.getElementById('f-prenom').value.trim();
      const nom        = document.getElementById('f-nom').value.trim();
      const entreprise = document.getElementById('f-entreprise').value.trim();
      const telephone  = document.getElementById('f-telephone').value.trim();
      const email      = document.getElementById('f-email').value.trim();
      const errEl      = document.getElementById('form-error');
      const btnLabel   = document.getElementById('btn-label');
      const btnLoader  = document.getElementById('btn-loader');
      const submitBtn  = document.getElementById('form-submit-btn');

      if (!prenom || !nom || !entreprise || !telephone || !email) {
        errEl.hidden = false;
        return;
      }
      errEl.hidden = true;
      btnLabel.hidden = true;
      btnLoader.hidden = false;
      submitBtn.disabled = true;

      fetch('https://formsubmit.co/ajax/support@fidelavis.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: `Nouvelle demande de démo — ${prenom} ${nom}`,
          _captcha: 'false',
          Prénom: prenom,
          Nom: nom,
          Entreprise: entreprise,
          Téléphone: telephone,
          Email: email
        })
      })
      .then(r => r.json())
      .then(() => {
        document.getElementById('form-container').hidden = true;
        document.getElementById('success-prenom').textContent = prenom;
        document.getElementById('form-success').hidden = false;
        demoForm.reset();
      })
      .catch(() => {
        btnLabel.hidden = false;
        btnLoader.hidden = true;
        submitBtn.disabled = false;
        errEl.textContent = 'Erreur réseau. Réessayez ou contactez support@fidelavis.com';
        errEl.hidden = false;
      });
    });
  }

  // --- Counter animation for stats ---
  const counters = document.querySelectorAll('.stat__number[data-target]');

  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          const duration = 1500;
          const start = performance.now();

          function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(target * eased) + suffix;
            if (progress < 1) requestAnimationFrame(update);
          }

          requestAnimationFrame(update);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

});
