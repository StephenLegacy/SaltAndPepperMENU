 // Mobile Menu Toggle
 function toggleMenu() {
    const navbar = document.getElementById('navbar');
    navbar.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  }

  // Close mobile menu when clicking on a link
  document.querySelectorAll('#navbar a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 992) {
        toggleMenu();
      }
    });
  });

  // Scroll Effect for Header
  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Intersection Observer for Scroll Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.job-card, .benefit-item').forEach(item => {
    observer.observe(item);
  });

  // Dark Mode Toggle (placeholder - implement as needed)
  function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    // You would need to add dark mode styles and possibly save preference to localStorage
    console.log('Dark mode toggled - implement functionality as needed');
  }

  // Form Submission
  const form = document.getElementById('careers-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Here you would typically send the form data to your server
      alert('Thank you for your application! We will review your information and get back to you soon.');
      form.reset();
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust for header height
          behavior: 'smooth'
        });
      }
    });
  });
