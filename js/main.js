// ── ANALYTICA MAIN JS ──

// App version
const APP = {
  name: 'Analytica',
  version: '1.0.0',
  url: 'https://analytica.netlify.app'
};

// ── SCROLL REVEAL ANIMATION ──
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.08 });

  reveals.forEach(el => observer.observe(el));
}

// ── MOBILE MENU TOGGLE ──
function initMobileMenu() {
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      menuBtn.textContent = 
        mobileMenu.classList.contains('open') ? '✕' : '☰';
    });
  }
}

// ── ACTIVE NAV LINK ──
function initActiveNav() {
  const currentPage = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
}

// ── SMOOTH SCROLL FOR ANCHOR LINKS ──
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ── TOAST NOTIFICATION ──
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 14px 22px;
    background: ${type === 'success' ? '#27AE60' : '#E74C3C'};
    color: white;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    z-index: 9999;
    animation: fadeUp 0.3s ease;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ── RUN EVERYTHING ON PAGE LOAD ──
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initMobileMenu();
  initActiveNav();
  initSmoothScroll();
  console.log(`${APP.name} v${APP.version} loaded ✓`);
});