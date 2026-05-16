/* ============================================================
   SAMWEL OGENDO PORTFOLIO — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────
     CUSTOM CURSOR
  ────────────────────────────────────────────── */
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = (mx - 4) + 'px';
    cursor.style.top  = (my - 4) + 'px';
  });

  function animateRing() {
    rx += (mx - rx - 20) * 0.12;
    ry += (my - ry - 20) * 0.12;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform        = 'scale(2.5)';
      cursorRing.style.transform    = 'scale(1.4)';
      cursorRing.style.borderColor  = 'rgba(0,229,255,0.8)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform        = 'scale(1)';
      cursorRing.style.transform    = 'scale(1)';
      cursorRing.style.borderColor  = 'rgba(0,229,255,0.4)';
    });
  });

  /* ──────────────────────────────────────────────
     NAVBAR — SHRINK ON SCROLL + HAMBURGER
  ────────────────────────────────────────────── */
  const nav       = document.querySelector('nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ──────────────────────────────────────────────
     TYPED ROLE ANIMATION
  ────────────────────────────────────────────── */
  const roles = [
    'ICT Technician & Developer',
    'Network Engineer',
    'Full-Stack Developer',
    'Database Architect',
    'Systems Designer',
    'Graphics Designer',
    'Hardware Specialist'
  ];
  let roleIdx = 0, charIdx = 0, deleting = false;
  const typedEl = document.getElementById('typed-role');

  if (typedEl) {
    typedEl.classList.add('typed');

    function typeLoop() {
      const role = roles[roleIdx];
      if (!deleting) {
        typedEl.textContent = role.slice(0, ++charIdx);
        if (charIdx === role.length) {
          deleting = true;
          setTimeout(typeLoop, 2200);
          return;
        }
      } else {
        typedEl.textContent = role.slice(0, --charIdx);
        if (charIdx === 0) {
          deleting = false;
          roleIdx  = (roleIdx + 1) % roles.length;
        }
      }
      setTimeout(typeLoop, deleting ? 38 : 80);
    }
    setTimeout(typeLoop, 1000);
  }

  /* ──────────────────────────────────────────────
     SCROLL REVEAL
  ────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  revealEls.forEach(el => revealObs.observe(el));

  /* ──────────────────────────────────────────────
     SKILL BARS ANIMATION
  ────────────────────────────────────────────── */
  const skillBarsSection = document.querySelector('.skill-bars');
  if (skillBarsSection) {
    const barObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
            bar.style.width = bar.dataset.width + '%';
          });
          barObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    barObs.observe(skillBarsSection);
  }

  /* ──────────────────────────────────────────────
     COUNTER ANIMATION (STATS BAR)
  ────────────────────────────────────────────── */
  function animateCounter(el, target) {
    let count = 0;
    const step  = Math.max(1, Math.ceil(target / 45));
    const timer = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = count + '+';
      if (count >= target) clearInterval(timer);
    }, 36);
  }

  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) {
    const statsObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.stat-num').forEach(el => {
            animateCounter(el, parseInt(el.dataset.target));
          });
          statsObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statsObs.observe(statsBar);
  }

  /* ──────────────────────────────────────────────
     HERO PARALLAX ORBS
  ────────────────────────────────────────────── */
  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 24;
    const y = (e.clientY / window.innerHeight - 0.5) * 24;
    document.querySelectorAll('.hero-orb').forEach(orb => {
      orb.style.transform = `translateY(-50%) translate(${x}px, ${y}px)`;
    });
    document.querySelectorAll('.hero-orb2').forEach(orb => {
      orb.style.transform = `translate(${-x * 0.6}px, ${-y * 0.6}px)`;
    });
  });

  /* ──────────────────────────────────────────────
     CONTACT FORM — FORMSPREE INTEGRATION
  ────────────────────────────────────────────── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      
      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.textContent;
      const formStatus = document.getElementById('formStatus');
      
      // Disable button and show loading state
      btn.disabled = true;
      btn.textContent = 'Sending...';
      btn.style.opacity = '0.7';
      
      try {
        // Collect form data
        const formData = new FormData(form);
        
        // Submit to Formspree
        const response = await fetch('https://formspree.io/f/xeevaaao', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          // Success
          btn.textContent = 'Message Sent! ✓';
          btn.style.background = 'var(--accent2)';
          btn.style.color = 'var(--bg)';
          
          // Show success message
          formStatus.style.display = 'block';
          formStatus.style.background = 'rgba(127,255,110,0.1)';
          formStatus.style.border = '1px solid rgba(127,255,110,0.3)';
          formStatus.style.color = 'var(--accent2)';
          formStatus.textContent = '✓ Your message has been sent successfully! I'll get back to you soon.';
          
          // Reset form
          form.reset();
          
          // Reset button after 3.5s
          setTimeout(() => {
            btn.textContent = orig;
            btn.style.background = '';
            btn.style.color = '';
            btn.style.opacity = '1';
            btn.disabled = false;
            formStatus.style.display = 'none';
          }, 3500);
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        // Error handling
        console.error('Form error:', error);
        btn.textContent = 'Error sending ✗';
        btn.style.background = 'rgba(255,107,53,0.3)';
        btn.style.color = 'var(--accent3)';
        
        // Show error message
        formStatus.style.display = 'block';
        formStatus.style.background = 'rgba(255,107,53,0.1)';
        formStatus.style.border = '1px solid rgba(255,107,53,0.3)';
        formStatus.style.color = 'var(--accent3)';
        formStatus.textContent = '✗ Error sending message. Please try again or contact me directly.';
        
        // Reset button after 3.5s
        setTimeout(() => {
          btn.textContent = orig;
          btn.style.background = '';
          btn.style.color = '';
          btn.style.opacity = '1';
          btn.disabled = false;
        }, 3500);
      }
    });
  }

  /* ──────────────────────────────────────────────
     ACTIVE NAV HIGHLIGHT ON SCROLL
  ────────────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}`
            ? 'var(--accent)' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObs.observe(s));

});
