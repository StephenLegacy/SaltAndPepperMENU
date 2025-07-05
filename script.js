document.addEventListener('DOMContentLoaded', () => {
  // Fade-in effect
  const sections = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('show');
    });
  }, { threshold: 0.3 });

  sections.forEach(section => observer.observe(section));

  // Optional smooth scroll if menuBtn exists
  const menuBtn = document.getElementById('menuBtn');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      document.getElementById('food-menu').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Carousel configuration for each type
  const carousels = ['food', 'bar', 'cocktail'];

  carousels.forEach(name => {
    const slideContainer = document.getElementById(`carousel-${name}`);
    const counterDisplay = document.getElementById(`counter-${name}`);
    const prevBtn = document.querySelector(`.prevBtn[data-carousel="${name}"]`);
    const nextBtn = document.querySelector(`.nextBtn[data-carousel="${name}"]`);

    let currentIndex = 0;
    let intervalId;
    let pauseTimeout;

    // Get updated image list every time
    const getImages = () => slideContainer.querySelectorAll('img');

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
      intervalId = setInterval(() => {
        nextSlide();
      }, 30000);
    }

    function stopAutoSlide() {
      clearInterval(intervalId);
    }

    function pauseAutoSlide() {
      stopAutoSlide();
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

    // Show first slide on load
    showSlide(currentIndex);
    startAutoSlide();

    // Keep current image visible on resize
    window.addEventListener('resize', () => showSlide(currentIndex));
  });
});

// Mobile menu toggle functionality
function toggleMenu() {
  const navbar = document.getElementById('navbar');
  if (navbar.style.display === 'flex') {
    navbar.style.display = 'none';
  } else {
    navbar.style.display = 'flex';
  }
}

// Close menu when clicking on a link (for mobile)
document.querySelectorAll('#navbar a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      toggleMenu();
    }
  });
});