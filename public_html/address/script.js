// 1. NAV SCROLL EFFECT
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// 2. SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// 3. MOBILE HAMBURGER MENU
const hamburger = document.querySelector('.nav-hamburger');
hamburger.addEventListener('click', () => {
  header.classList.toggle('nav-open');
  const isOpen = header.classList.contains('nav-open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// 4. HERO COUNTER ANIMATION (requestAnimationFrame + easeOutQuart)
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num');
  const duration = 1800;
  const easeOutQuart = t => 1 - Math.pow(1 - t, 4);
  
  counters.forEach(counter => {
    const target = parseFloat(counter.dataset.target);
    const decimals = parseInt(counter.dataset.decimal);
    const start = performance.now();
    
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = target * easeOutQuart(progress);
      counter.textContent = value.toFixed(decimals);
      
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

// 4.5 HERO SLIDER ANIMATION
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;
  let currentSlide = 0;
  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 5000); // 5 seconds per slide
}

document.addEventListener('DOMContentLoaded', () => {
  animateCounters();
  initHeroSlider();
});

// 5. INTERSECTION OBSERVER — section fade-in on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('section').forEach(s => observer.observe(s));

// 6. FLOOR PLAN TAB SWITCHER
document.querySelectorAll('.fp-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.fp-tab').forEach(t => { 
      t.classList.remove('active'); 
      t.setAttribute('aria-selected', 'false'); 
    });
    document.querySelectorAll('.fp-panel').forEach(p => p.classList.add('hidden'));
    
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const panelId = tab.getAttribute('aria-controls');
    document.getElementById(panelId).classList.remove('hidden');
  });
});

// 7. FLOOR PLAN UNIT TOOLTIP & 8. SITE PLAN TOWER TOOLTIP & 10. TOOLTIP POSITIONING
const tooltip = document.createElement('div');
tooltip.className = 'global-tooltip';
document.body.appendChild(tooltip);

function showTooltip(e, contentHTML) {
  tooltip.innerHTML = contentHTML;
  tooltip.classList.add('active');
  positionTooltip(e);
}

function hideTooltip() {
  tooltip.classList.remove('active');
}

function positionTooltip(e) {
  const x = e.clientX;
  const y = e.clientY;
  const tRect = tooltip.getBoundingClientRect();
  
  let top = y + 15;
  let left = x + 15;
  
  if (left + tRect.width > window.innerWidth) {
    left = x - tRect.width - 15;
  }
  if (top + tRect.height > window.innerHeight) {
    top = y - tRect.height - 15;
  }
  
  tooltip.style.top = `${top + window.scrollY}px`;
  tooltip.style.left = `${left + window.scrollX}px`;
}

document.querySelectorAll('.fp-unit').forEach(unit => {
  unit.addEventListener('click', (e) => {
    e.stopPropagation();
    const { unit: u, type, sba, carpet, facing } = unit.dataset;
    const html = `<strong>Unit ${u}</strong><br>${type}<br>SBA: ${sba} sq.ft.<br>Carpet: ${carpet} sq.ft.<br>Facing: ${facing || 'N/A'}`;
    showTooltip(e, html);
  });
});

document.querySelectorAll('.tower-fp').forEach(tower => {
  tower.addEventListener('click', (e) => {
    e.stopPropagation();
    const { tower: t, type, size, floors } = tower.dataset;
    const html = `<strong>${t}</strong><br>${type}<br>${size}<br>${floors}`;
    showTooltip(e, html);
  });
});

document.addEventListener('click', hideTooltip);

// 9. FAQ ACCORDION
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.faq-question').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.hidden = true;
      b.querySelector('.faq-chevron').style.transform = 'rotate(0deg)';
    });
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      btn.nextElementSibling.hidden = false;
      btn.querySelector('.faq-chevron').style.transform = 'rotate(180deg)';
    }
  });
});
