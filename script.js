document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initFadeInEffects();
  initMenuButton();
  initCarousels();
  initMobileMenu();
  initScrollEffects();
});

function initFadeInEffects() {
  const sections = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('show');
    });
  }, { threshold: 0.3 });

  sections.forEach(section => observer.observe(section));
}

function initMenuButton() {
  const menuBtn = document.getElementById('menuBtn');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      document.getElementById('food-menu').scrollIntoView({ behavior: 'smooth' });
    });
  }
}

function initCarousels() {
  const carousels = ['food', 'bar', 'cocktail'];
  
  carousels.forEach(name => {
    const slideContainer = document.getElementById(`carousel-${name}`);
    const counterDisplay = document.getElementById(`counter-${name}`);
    const prevBtn = document.querySelector(`.prevBtn[data-carousel="${name}"]`);
    const nextBtn = document.querySelector(`.nextBtn[data-carousel="${name}"]`);

    let currentIndex = 0;
    let intervalId;
    let pauseTimeout;

    function getImages() {
      return slideContainer.querySelectorAll('img');
    }

    function showSlide(i) {
      const images = getImages();
      images.forEach((img, idx) => {
        img.style.display = (idx === i) ? 'block' : 'none';
      });
      counterDisplay.textContent = `Slide ${i + 1} of ${images.length}`;
    }

    function nextSlide() {
      const images = getImages();
      currentIndex = (currentIndex + 1) % images.length;
      showSlide(currentIndex);
    }

    function prevSlide() {
      const images = getImages();
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showSlide(currentIndex);
    }

    function startAutoSlide() {
      intervalId = setInterval(nextSlide, 30000);
    }

    function pauseAutoSlide() {
      clearInterval(intervalId);
      clearTimeout(pauseTimeout);
      pauseTimeout = setTimeout(startAutoSlide, 120000);
    }

    // Event listeners
    nextBtn.addEventListener('click', () => {
      nextSlide();
      pauseAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      pauseAutoSlide();
    });

    // Initialize
    showSlide(currentIndex);
    startAutoSlide();
    window.addEventListener('resize', () => showSlide(currentIndex));
  });
}

function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navbar = document.getElementById('navbar');

  function toggleMenu() {
    navbar.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  }

  menuToggle.addEventListener('click', toggleMenu);

  // Close menu when clicking on a link
  document.querySelectorAll('#navbar a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 991) {
        toggleMenu();
      }
    });
  });
}

function initScrollEffects() {
  const header = document.querySelector('header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}