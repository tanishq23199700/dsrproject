document.addEventListener('DOMContentLoaded', () => {

  // 1. NAV SCROLL EFFECT
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. ACTIVE NAV TRACKING
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= (sectionTop - 150)) {
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

  // 3. SMOOTH SCROLL
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if(targetId === '#' || !targetId.startsWith('#')) return;
      const targetElement = document.querySelector(targetId);
      if(targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Close mobile nav if open
        header.classList.remove('nav-open');
        const navLinksMenu = document.querySelector('.nav-links');
        if (navLinksMenu) navLinksMenu.classList.remove('nav-open');
        const hamburger = document.querySelector('.nav-hamburger');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // 4. MOBILE HAMBURGER
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinksMenu = document.querySelector('.nav-links');
  if(hamburger && navLinksMenu) {
    hamburger.addEventListener('click', () => {
      header.classList.toggle('nav-open');
      navLinksMenu.classList.toggle('nav-open');
      const expanded = navLinksMenu.classList.contains('nav-open');
      hamburger.setAttribute('aria-expanded', expanded);
    });
  }

  // 5. COUNTER ANIMATION
  function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
  }
  function animateCounter(element, duration) {
    const target = parseFloat(element.getAttribute('data-target'));
    if (isNaN(target)) return;
    let startTime = null;
    function step(currentTime) {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const value = target * easeOutQuart(progress);
      element.innerText = Math.floor(value);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.innerText = target;
      }
    }
    window.requestAnimationFrame(step);
  }

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('.stat-num[data-target]');
        counters.forEach(counter => animateCounter(counter, 2500));
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statObserver.observe(heroStats);

  // 6. SCROLL REVEAL
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // 7. PROJECT FILTER TABS
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;
      
      // Update active state on tabs
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Filter logic
      document.querySelectorAll('.project-card').forEach(card => {
        const matchCity = filter === 'all' || card.dataset.city === filter;
        const matchStatus = filter === 'all' || card.dataset.status === filter;
        const isCityFilter = filter === 'bengaluru' || filter === 'hyderabad';
        
        if ((isCityFilter && matchCity) || (!isCityFilter && matchStatus)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px) scale(0.98)';
          setTimeout(() => { 
            if(card.style.opacity === '0') card.style.display = 'none'; 
          }, 400); // Matches var(--t-med)
        }
      });
    });
  });

  // 8. FAQ ACCORDION
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      
      // Collapse siblings
      document.querySelectorAll('.faq-question').forEach(btn => {
        if (btn !== button) {
          btn.setAttribute('aria-expanded', 'false');
          btn.nextElementSibling.style.maxHeight = '0px';
        }
      });

      button.setAttribute('aria-expanded', !isExpanded);
      const answer = button.nextElementSibling;
      if (!isExpanded) {
        answer.style.maxHeight = answer.scrollHeight + "px";
      } else {
        answer.style.maxHeight = "0px";
      }
    });
  });

});
