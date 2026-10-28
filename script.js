/* ==========================================
   SCROLL REVEAL - Intersection Observer
   ========================================== */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

// Registra elementos de scroll reveal
function setupScrollReveal() {
  // Section headers
  document.querySelectorAll('.section-header').forEach((el) => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // Title underlines
  document.querySelectorAll('.title-underline').forEach((el) => {
    revealObserver.observe(el);
  });

  // About cards com stagger
  document.querySelectorAll('.about-grid .about-card').forEach((el, i) => {
    el.classList.add('reveal', `stagger-${Math.min(i + 1, 5)}`);
    revealObserver.observe(el);
  });

  // Project cards com stagger
  document.querySelectorAll('.projects-grid .project-card').forEach((el, i) => {
    el.classList.add('reveal', `stagger-${Math.min(i + 1, 5)}`);
    revealObserver.observe(el);
  });

  // Skill categories com stagger
  document.querySelectorAll('.skills-grid .skill-category').forEach((el, i) => {
    el.classList.add('reveal', `stagger-${Math.min(i + 1, 5)}`);
    revealObserver.observe(el);
  });

  // Contact cards com stagger
  document.querySelectorAll('.contact-cards .contact-card').forEach((el, i) => {
    el.classList.add('reveal', `stagger-${Math.min(i + 1, 5)}`);
    revealObserver.observe(el);
  });

  // Timeline items com slide da esquerda
  document.querySelectorAll('.timeline-item').forEach((el, i) => {
    el.classList.add('reveal-left', `stagger-${Math.min(i + 1, 5)}`);
    revealObserver.observe(el);
  });

  // Soft skills box
  document.querySelectorAll('.soft-skills-box').forEach((el) => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });
}

/* ==========================================
   EFEITO DE DIGITAÇÃO
   ========================================== */
function typeEffect(element, texts, typingSpeed = 75, deletingSpeed = 40, pauseTime = 2200) {
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  // Cria cursor piscando
  const cursor = document.createElement('span');
  cursor.classList.add('typing-cursor');
  element.insertAdjacentElement('afterend', cursor);

  function tick() {
    const currentText = texts[textIndex];

    if (isDeleting) {
      element.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      element.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    // Fim da palavra → pausar e depois deletar
    if (!isDeleting && charIndex === currentText.length) {
      setTimeout(() => {
        isDeleting = true;
        tick();
      }, pauseTime);
      return;
    }

    // Palavra deletada → próxima
    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
    }

    setTimeout(tick, isDeleting ? deletingSpeed : typingSpeed);
  }

  tick();
}

function setupTypingEffect() {
  const roleEl = document.querySelector('.hero-role');
  if (!roleEl) return;

  roleEl.textContent = '';
  typeEffect(roleEl, [
    'Desenvolvedor de Software Júnior',
    'Back-end Developer',
    'Web Developer',
    'Python & Java Developer',
    'API & Django Developer',
  ]);
}

/* ==========================================
   PARTÍCULAS FLUTUANTES
   ========================================== */
function createParticles() {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('aria-hidden', 'true');
  wrapper.style.cssText = [
    'position:fixed',
    'inset:0',
    'pointer-events:none',
    'z-index:0',
    'overflow:hidden',
  ].join(';');

  const colors = [
    'rgba(99,102,241,VAL)',
    'rgba(56,189,248,VAL)',
    'rgba(168,85,247,VAL)',
  ];

  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    const size       = Math.random() * 2.5 + 0.8;
    const x          = Math.random() * 100;
    const duration   = Math.random() * 22 + 16;
    const delay      = Math.random() * -25; // negativo para começar no meio
    const opacity    = (Math.random() * 0.25 + 0.06).toFixed(2);
    const colorRaw   = colors[Math.floor(Math.random() * colors.length)];
    const color      = colorRaw.replace('VAL', opacity);

    p.style.cssText = [
      `position:absolute`,
      `bottom:-6px`,
      `left:${x}%`,
      `width:${size}px`,
      `height:${size}px`,
      `border-radius:50%`,
      `background:${color}`,
      `animation:particleRise ${duration}s linear ${delay}s infinite`,
    ].join(';');

    wrapper.appendChild(p);
  }

  document.body.appendChild(wrapper);
}

/* ==========================================
   NAVBAR - sombra ao rolar + link ativo
   ========================================== */
function setupNavbar() {
  const header   = document.querySelector('.header');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('main section[id]');

  // Sombra ao rolar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.style.boxShadow = '0 4px 30px rgba(0,0,0,0.35)';
    } else {
      header.style.boxShadow = 'none';
    }
  }, { passive: true });

  // Link ativo conforme seção visível
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.remove('active'));
          const activeLink = document.querySelector(
            `.nav-links a[href="#${entry.target.id}"]`
          );
          if (activeLink) activeLink.classList.add('active');
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

/* ==========================================
   INICIALIZAÇÃO
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
  setupScrollReveal();
  setupTypingEffect();
  createParticles();
  setupNavbar();
});
