/* =========================================================
   SWATHI DURGAM — PORTFOLIO SCRIPT
   Organized by feature. All vanilla JS, no dependencies.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     1. LOADING SCREEN
     --------------------------------------------------------- */
  const loader = document.getElementById('loader');
  const loaderProgress = document.getElementById('loaderProgress');
  window.addEventListener('load', () => {
    requestAnimationFrame(() => { loaderProgress.style.width = '100%'; });
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 700);
  });
  // Fallback in case 'load' already fired
  setTimeout(() => { loaderProgress.style.width = '100%'; }, 100);
  setTimeout(() => { loader.classList.add('hidden'); }, 1200);


  /* ---------------------------------------------------------
     2. SCROLL PROGRESS BAR
     --------------------------------------------------------- */
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();


  /* ---------------------------------------------------------
     3. NAVBAR — scroll state, mobile toggle, active link
     --------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navLinkEls = document.querySelectorAll('.nav-link');

  function updateNavbarState(){
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', updateNavbarState, { passive: true });
  updateNavbarState();

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinkEls.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Highlight active nav link based on section in view
  const sections = document.querySelectorAll('main section, header.hero');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const id = entry.target.getAttribute('id');
        navLinkEls.forEach(link => {
          link.classList.toggle('active-link', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
  sections.forEach(sec => navObserver.observe(sec));


  /* ---------------------------------------------------------
     4. SCROLL REVEAL ANIMATIONS (AOS-style, dependency-free)
     --------------------------------------------------------- */
  const aosEls = document.querySelectorAll('[data-aos]');
  const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const delay = entry.target.getAttribute('data-aos-delay') || 0;
        entry.target.style.transitionDelay = delay + 'ms';
        entry.target.classList.add('aos-in');
        aosObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  aosEls.forEach(el => aosObserver.observe(el));


  /* ---------------------------------------------------------
     5. TYPING ANIMATION (Hero terminal)
     --------------------------------------------------------- */
  const typedTextEl = document.getElementById('typedText');
  const roles = ['AI Developer', 'Python Programmer', 'Machine Learning Enthusiast', 'Web Developer'];
  let roleIndex = 0, charIndex = 0, isDeleting = false;

  function typeLoop(){
    const current = roles[roleIndex];
    if (isDeleting){
      charIndex--;
      typedTextEl.textContent = current.substring(0, charIndex);
    } else {
      charIndex++;
      typedTextEl.textContent = current.substring(0, charIndex);
    }

    let speed = isDeleting ? 45 : 85;

    if (!isDeleting && charIndex === current.length){
      speed = 1400; // pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0){
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      speed = 350;
    }
    setTimeout(typeLoop, speed);
  }
  if (typedTextEl) typeLoop();


  /* ---------------------------------------------------------
     6. ANIMATED SKILL BARS (fill on scroll into view)
     --------------------------------------------------------- */
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const width = entry.target.getAttribute('data-width');
        entry.target.style.width = width + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  skillBars.forEach(bar => skillObserver.observe(bar));


  /* ---------------------------------------------------------
     7. ANIMATED COUNTERS (About section)
     --------------------------------------------------------- */
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-count'));
        const decimal = el.getAttribute('data-decimal');
        const duration = 1400;
        const start = performance.now();

        function animateCount(now){
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = target * eased;
          el.textContent = decimal ? value.toFixed(2) : Math.floor(value);
          if (progress < 1){
            requestAnimationFrame(animateCount);
          } else {
            el.textContent = decimal ? target.toFixed(2) : target;
          }
        }
        requestAnimationFrame(animateCount);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterObserver.observe(c));


  /* ---------------------------------------------------------
     8. PROJECT FILTER ANIMATION
     --------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;
        if (shouldShow){
          card.classList.remove('hide');
          card.style.animation = 'none';
          void card.offsetWidth; // reflow to restart animation
          card.style.animation = 'fadeInScale 0.5s ease forwards';
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  // Keyframe injected via JS since it's only needed for filter transitions
  const styleTag = document.createElement('style');
  styleTag.textContent = `@keyframes fadeInScale{ from{ opacity:0; transform: scale(0.94) translateY(10px);} to{ opacity:1; transform: scale(1) translateY(0);} }`;
  document.head.appendChild(styleTag);


  /* ---------------------------------------------------------
     9. BACK TO TOP BUTTON
     --------------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 480);
  }, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ---------------------------------------------------------
     10. ANIMATED BACKGROUND PARTICLES (canvas)
     --------------------------------------------------------- */
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resizeCanvas(){
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function initParticles(){
    const count = Math.min(70, Math.floor((width * height) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      hue: Math.random() > 0.5 ? '91,124,250' : '155,92,246'
    }));
  }
  initParticles();
  window.addEventListener('resize', initParticles);

  const maxLinkDist = 140;

  function drawParticles(){
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.hue},0.55)`;
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++){
      for (let j = i + 1; j < particles.length; j++){
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxLinkDist){
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(120,140,255,${0.12 * (1 - dist / maxLinkDist)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  }

  if (!prefersReducedMotion){
    drawParticles();
  }


  /* ---------------------------------------------------------
     11. SMOOTH ANCHOR SCROLL (offset for fixed navbar)
     --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e){
      const targetId = this.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (target){
        e.preventDefault();
        const navHeight = document.getElementById('navbar').offsetHeight;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

});
