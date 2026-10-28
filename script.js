/* ==========================================
   UTILITÁRIOS
   ========================================== */

/** Verifica se o elemento já está visível no viewport atual */
function isAlreadyInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

/** Aplica reveal imediato OU observa para revelar ao entrar na tela */
function observeElement(el, observer) {
  if (isAlreadyInViewport(el)) {
    // Já está na tela: revela sem delay (ex: conteúdo do hero no mobile)
    requestAnimationFrame(() => el.classList.add('visible'));
  } else {
    observer.observe(el);
  }
}

/* ==========================================
   SCROLL REVEAL - Intersection Observer
   ========================================== */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // revela só uma vez
      }
    });
  },
  {
    threshold: 0,          // dispara assim que 1px aparece
    rootMargin: '0px',     // sem corte negativo
  }
);

function setupScrollReveal() {
  // Section headers
  document.querySelectorAll('.section-header').forEach((el) => {
    el.classList.add('reveal');
    observeElement(el, revealObserver);
  });

  // Title underlines (observer separado para a animação de largura)
  document.querySelectorAll('.title-underline').forEach((el) => {
    observeElement(el, revealObserver);
  });

  // About cards com stagger
  document.querySelectorAll('.about-grid .about-card').forEach((el, i) => {
    el.classList.add('reveal');
    if (i > 0) el.style.transitionDelay = `${i * 0.15}s`;
    observeElement(el, revealObserver);
  });

  // Project cards com stagger
  document.querySelectorAll('.projects-grid .project-card').forEach((el, i) => {
    el.classList.add('reveal');
    if (i > 0) el.style.transitionDelay = `${i * 0.15}s`;
    observeElement(el, revealObserver);
  });

  // Skill categories com stagger
  document.querySelectorAll('.skills-grid .skill-category').forEach((el, i) => {
    el.classList.add('reveal');
    if (i > 0) el.style.transitionDelay = `${i * 0.1}s`;
    observeElement(el, revealObserver);
  });

  // Contact cards com stagger
  document.querySelectorAll('.contact-cards .contact-card').forEach((el, i) => {
    el.classList.add('reveal');
    if (i > 0) el.style.transitionDelay = `${i * 0.15}s`;
    observeElement(el, revealObserver);
  });

  // Timeline items com slide da esquerda
  document.querySelectorAll('.timeline-item').forEach((el, i) => {
    el.classList.add('reveal-left');
    if (i > 0) el.style.transitionDelay = `${i * 0.2}s`;
    observeElement(el, revealObserver);
  });

  // Soft skills box
  document.querySelectorAll('.soft-skills-box').forEach((el) => {
    el.classList.add('reveal');
    observeElement(el, revealObserver);
  });

  // Segurança: após 2.5s revela tudo que ainda estiver invisível
  // (garante que nada fica preso em opacity:0 em browsers problemáticos)
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible), .reveal-left:not(.visible)').forEach((el) => {
      el.classList.add('visible');
    });
    document.querySelectorAll('.title-underline:not(.visible)').forEach((el) => {
      el.classList.add('visible');
    });
  }, 2500);
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

    if (!isDeleting && charIndex === currentText.length) {
      setTimeout(() => { isDeleting = true; tick(); }, pauseTime);
      return;
    }

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
  // Evita criar partículas em telas muito pequenas (economia de performance)
  if (window.innerWidth < 480) return;

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
    const size     = Math.random() * 2.5 + 0.8;
    const x        = Math.random() * 100;
    const duration = Math.random() * 22 + 16;
    const delay    = Math.random() * -25;
    const opacity  = (Math.random() * 0.25 + 0.06).toFixed(2);
    const colorRaw = colors[Math.floor(Math.random() * colors.length)];
    const color    = colorRaw.replace('VAL', opacity);

    p.style.cssText = [
      'position:absolute',
      'bottom:-6px',
      `left:${x}%`,
      `width:${size}px`,
      `height:${size}px`,
      'border-radius:50%',
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

  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 60
      ? '0 4px 30px rgba(0,0,0,0.35)'
      : 'none';
  }, { passive: true });

  if (sections.length === 0) return;

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
