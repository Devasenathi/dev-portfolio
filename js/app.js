/**
 * GRAPHIC DESIGN PORTFOLIO VISUAL SYSTEM — DEVA
 * Interactive functionality & design system showcase
 */

document.addEventListener('DOMContentLoaded', () => {
  initPortraitToggle();
  initCategoryFilter();
  initCopyEmail();
  initProjectModals();
  initDesignSystemModal();
  initResumeModal();
  initScrollNav();
  initMobileMenu();
});

function initResumeModal() {
  const modal = document.getElementById('resume-modal');
  const openBtns = document.querySelectorAll('.open-resume-btn');
  const closeBtn = document.getElementById('resume-modal-close');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    links.classList.toggle('mobile-open');
  });

  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('mobile-open');
    });
  });
}

/* ==========================================================================
   PORTRAIT TREATMENT SWITCHER (Treatment A vs Treatment B)
   ========================================================================== */
function initPortraitToggle() {
  const container = document.getElementById('portrait-system-box');
  const btnB = document.getElementById('btn-treatment-b');
  const btnA = document.getElementById('btn-treatment-a');

  if (!container || !btnB || !btnA) return;

  btnB.addEventListener('click', () => {
    container.classList.remove('treatment-active-a');
    container.classList.add('treatment-active-b');
    btnB.classList.add('active');
    btnA.classList.remove('active');
    showToast('Switched to Treatment B: Monochrome Editorial Collage');
  });

  btnA.addEventListener('click', () => {
    container.classList.remove('treatment-active-b');
    container.classList.add('treatment-active-a');
    btnA.classList.add('active');
    btnB.classList.remove('active');
    showToast('Switched to Treatment A: Sticker Cutout with White Contour');
  });
}

/* ==========================================================================
   CATEGORY TILES FILTER & HIGHLIGHT (From Ref 2's 4 Yellow Cards)
   ========================================================================== */
function initCategoryFilter() {
  const tiles = document.querySelectorAll('.category-tile');
  const projects = document.querySelectorAll('.project-card');

  tiles.forEach(tile => {
    tile.addEventListener('click', () => {
      const category = tile.getAttribute('data-category');
      const isAlreadyActive = tile.classList.contains('active-filter');

      // Reset tiles
      tiles.forEach(t => t.classList.remove('active-filter'));

      if (!isAlreadyActive && category !== 'all') {
        tile.classList.add('active-filter');
        
        // Highlight matching projects
        projects.forEach(card => {
          const cardTags = card.getAttribute('data-categories') || '';
          if (cardTags.includes(category)) {
            card.style.opacity = '1';
            card.style.transform = 'translate(-4px, -4px)';
            card.style.boxShadow = '10px 10px 0 var(--primary-highlight)';
          } else {
            card.style.opacity = '0.45';
            card.style.transform = 'none';
            card.style.boxShadow = '6px 6px 0 var(--border-line)';
          }
        });
        showToast(`Filtered projects by: ${tile.querySelector('.category-tile-title').innerText}`);
      } else {
        // Reset all projects
        projects.forEach(card => {
          card.style.opacity = '1';
          card.style.transform = 'none';
          card.style.boxShadow = '6px 6px 0 var(--border-line)';
        });
      }
    });
  });
}

/* ==========================================================================
   COPY EMAIL INTERACTION
   ========================================================================== */
function initCopyEmail() {
  const copyBtns = document.querySelectorAll('.copy-email-btn');
  const email = 'devapathi79@gmail.com';

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => {
          showToast('✓ devapathi79@gmail.com copied to clipboard!');
        }).catch(() => {
          fallbackCopy(email);
        });
      } else {
        fallbackCopy(email);
      }
    });
  });
}

function fallbackCopy(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showToast('✓ devapathi79@gmail.com copied to clipboard!');
  } catch (err) {
    showToast('Email: devapathi79@gmail.com');
  }
  document.body.removeChild(textArea);
}

/* ==========================================================================
   PROJECT LIGHTBOX / MODAL
   ========================================================================== */
const projectData = {
  kaapi: {
    title: 'Kaapi Kadai: brand identity for a filter-coffee shop',
    type: 'Real client',
    role: 'Solo designer',
    img: './assets/images/kaapi-kadai.jpg',
    desc: 'Designed the logo, a bilingual Tamil–English menu board, cup sleeves and an Instagram post template for a small coffee shop near my college. I sketched about 30 logo ideas on paper, showed the owner three, and refined the one he chose.',
    learning: 'The owner now uses the menu board and cup sleeves in the shop. I learned how to design for print at very small sizes, and how to make Tamil and English text feel equal instead of one looking like an afterthought.'
  },
  margazhi: {
    title: 'Margazhi Season poster series',
    type: 'Self-initiated',
    role: 'Designer and illustrator',
    img: './assets/images/margazhi-posters.jpg',
    desc: 'Made a series of three posters for the December music season, one each for veena, nadaswaram and mridangam. I hand-drew each instrument in Procreate and paired it with a bold Tamil headline that I lettered myself.',
    learning: 'I learned how to keep a series consistent with one grid, one colour rule and one type pair, while still letting each poster feel different.'
  }
};

function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const triggers = document.querySelectorAll('[data-project-trigger]');

  if (!modal || !closeBtn) return;

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const key = trigger.getAttribute('data-project-trigger');
      const data = projectData[key];
      if (!data) return;

      document.getElementById('modal-title').textContent = data.title;
      document.getElementById('modal-type').textContent = `Type: ${data.type} · Role: ${data.role}`;
      document.getElementById('modal-img').src = data.img;
      document.getElementById('modal-img').alt = data.title;
      document.getElementById('modal-desc').textContent = data.desc;
      document.getElementById('modal-learning').textContent = data.learning;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ==========================================================================
   DESIGN SYSTEM INSPECTOR MODAL
   ========================================================================== */
function initDesignSystemModal() {
  const modal = document.getElementById('system-modal');
  const openBtn = document.getElementById('open-system-btn');
  const closeBtn = document.getElementById('system-modal-close');

  if (!modal || !openBtn || !closeBtn) return;

  openBtn.addEventListener('click', () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Swatch copy triggers
  const swatches = document.querySelectorAll('.system-swatch-clickable');
  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const hex = swatch.getAttribute('data-hex');
      if (hex) {
        navigator.clipboard.writeText(hex).then(() => {
          showToast(`Copied token ${hex} to clipboard!`);
        });
      }
    });
  });
}

/* ==========================================================================
   SMOOTH SCROLL & ACTIVE LINK NAVIGATION
   ========================================================================== */
function initScrollNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   TOAST HELPER
   ========================================================================== */
let toastTimeout;
function showToast(message) {
  let toast = document.getElementById('toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}
