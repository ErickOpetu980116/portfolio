// script.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("Portfolio loaded successfully!");

  // ===== Smooth Scroll for Navigation and Buttons =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = 80; // Account for fixed header
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== Animated Counters on Scroll =====
  const counters = document.querySelectorAll('.counter');
  const statsSection = document.getElementById('stats');
  let hasAnimated = false;

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000; // 2 seconds
      const frameDuration = 1000 / 60; // 60fps
      const totalFrames = Math.round(duration / frameDuration);
      const easeOutQuad = t => t * (2 - t);
      
      let frame = 0;
      const timer = setInterval(() => {
        frame++;
        const progress = easeOutQuad(frame / totalFrames);
        const currentCount = Math.round(target * progress);
        
        counter.textContent = currentCount;
        
        if (frame === totalFrames) {
          clearInterval(timer);
          counter.textContent = target;
        }
      }, frameDuration);
    });
  };

  // Intersection Observer for Stats Animation
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        setTimeout(() => {
          animateCounters();
        }, 200);
        hasAnimated = true;
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
  });

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // ===== FAQ Accordion =====
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other FAQ items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });

  // ===== Contact Form Enhancement =====
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const name = formData.get('name').trim();
      const email = formData.get('email').trim();
      const phone = formData.get('phone').trim();
      const message = formData.get('message').trim();
      
      // Simple validation
      if (!name || !email || !message) {
        showAlert('Please fill in all required fields.', 'error');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showAlert('Please enter a valid email address.', 'error');
        return;
      }
      
      // Show loading state
      const submitBtn = this.querySelector('.primary-btn');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      // Simulate form submission (replace with actual backend call)
      setTimeout(() => {
        showAlert(`Thank you, ${name}! Your message has been sent successfully. I'll get back to you soon.`, 'success');
        this.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }

  // ===== Alert Function =====
  function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.custom-alert');
    existingAlerts.forEach(alert => alert.remove());
    
    const alert = document.createElement('div');
    alert.className = `custom-alert alert-${type}`;
    alert.textContent = message;
    
    const alertStyles = {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '15px 20px',
      borderRadius: '8px',
      color: 'white',
      fontSize: '14px',
      fontWeight: '500',
      zIndex: '10000',
      maxWidth: '300px',
      opacity: '0',
      transform: 'translateY(-20px)',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
    };
    
    Object.assign(alert.style, alertStyles);
    
    if (type === 'success') {
      alert.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    } else if (type === 'error') {
      alert.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    } else {
      alert.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
    }
    
    document.body.appendChild(alert);
    
    // Animate in
    setTimeout(() => {
      alert.style.opacity = '1';
      alert.style.transform = 'translateY(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      alert.style.opacity = '0';
      alert.style.transform = 'translateY(-20px)';
      setTimeout(() => alert.remove(), 300);
    }, 5000);
  }

  // ===== Navbar Active Link Highlighting =====
  const navLinks = document.querySelectorAll('.main-nav a');
  const sections = document.querySelectorAll('section[id]');

  const highlightNavLink = () => {
    let current = '';
    const scrollPos = window.pageYOffset + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
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
  };

  // ===== Scroll to Top Button =====
  const scrollToTopBtn = document.createElement('button');
  scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollToTopBtn.className = 'scroll-to-top';
  scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');

  document.body.appendChild(scrollToTopBtn);

  // Show/hide scroll to top button
  const toggleScrollButton = () => {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.style.display = 'block';
    } else {
      scrollToTopBtn.style.display = 'none';
    }
  };

  // Scroll to top functionality
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ===== Scroll Event Listeners =====
  let ticking = false;
  
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        highlightNavLink();
        toggleScrollButton();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll);

  // ===== Skill Cards Animation on Scroll =====
  const skillCards = document.querySelectorAll('.skill-card');
  const projectCards = document.querySelectorAll('.project-card');
  const testimonials = document.querySelectorAll('.testimonial');

  const animateOnScroll = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  };

  const scrollObserver = new IntersectionObserver(animateOnScroll, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Initially hide elements and observe them
  [...skillCards, ...projectCards, ...testimonials].forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    scrollObserver.observe(element);
  });

  // ===== Loading Animation =====
  const hideLoader = () => {
    const loader = document.querySelector('.loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }
  };

  // Hide loader after everything is loaded
  window.addEventListener('load', hideLoader);

  // ===== Keyboard Navigation Enhancement =====
  document.addEventListener('keydown', (e) => {
    // Escape key closes FAQ items
    if (e.key === 'Escape') {
      faqItems.forEach(item => {
        item.classList.remove('active');
      });
    }
    
    // Enter key on FAQ items
    if (e.key === 'Enter' && e.target.classList.contains('faq-question')) {
      e.target.click();
    }
  });

  // ===== Mobile Menu Enhancement =====
  const createMobileMenuToggle = () => {
    if (window.innerWidth <= 768) {
      const headerContent = document.querySelector('.header-content');
      const nav = document.querySelector('.main-nav');
      
      if (!document.querySelector('.mobile-menu-toggle')) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'mobile-menu-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
        toggleBtn.style.cssText = `
          display: none;
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 5px;
        `;
        
        toggleBtn.addEventListener('click', () => {
          nav.style.display = nav.style.display === 'none' ? 'block' : 'none';
          const icon = toggleBtn.querySelector('i');
          icon.className = nav.style.display === 'none' ? 'fas fa-bars' : 'fas fa-times';
        });
        
        headerContent.appendChild(toggleBtn);
        
        // Show toggle button on mobile
        if (window.innerWidth <= 768) {
          toggleBtn.style.display = 'block';
        }
      }
    }
  };

  // ===== Resize Handler =====
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      createMobileMenuToggle();
      
      // Reset mobile menu on desktop
      if (window.innerWidth > 768) {
        const nav = document.querySelector('.main-nav');
        const toggle = document.querySelector('.mobile-menu-toggle');
        if (nav) nav.style.display = '';
        if (toggle) toggle.style.display = 'none';
      }
    }, 250);
  });

  // Initialize mobile menu
  createMobileMenuToggle();

  // ===== Performance Optimization =====
  // Preload critical images
  const preloadImages = () => {
    const imageUrls = [
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg'
    ];
    
    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  };

  preloadImages();

  // ===== Console Welcome Message =====
  console.log(`
    🚀 Welcome to Erick Opetu's Portfolio!
    
    💼 Looking for a skilled developer? You've come to the right place!
    📧 Contact: opetuerick@gmail.com
    🔗 LinkedIn: https://linkedin.com/in/ErickOpetu
    
    Built with ❤️ using vanilla HTML, CSS & JavaScript
  `);

  // ===== Initialize everything =====
  setTimeout(() => {
    highlightNavLink();
    toggleScrollButton();
  }, 100);

});