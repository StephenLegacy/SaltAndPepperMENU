// script.js
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('show');
      });
    }, { threshold: 0.3 });
  
    sections.forEach(section => observer.observe(section));
  
    // Smooth scroll for menu button
    document.getElementById('menuBtn').addEventListener('click', () => {
      document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
    });
  });
  

const carouselSlide = document.getElementById('carousel-slide');
const images = carouselSlide.querySelectorAll('img');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const slideCounter = document.getElementById('slide-counter');

let counter = 0;
let autoSlideInterval;
let pauseTimeout;

// Update slide counter
function updateCounter() {
  slideCounter.textContent = `Slide ${counter + 1} of ${images.length}`;
}

// Show current slide and hide others
function showSlide(index) {
  // Hide all images
  images.forEach((img) => img.classList.remove('active'));

  // Show the current image
  images[index].classList.add('active');
  updateCounter();
}

// Move to next slide
function nextSlide() {
  counter = (counter + 1) % images.length;
  showSlide(counter);
}

// Move to previous slide
function prevSlide() {
  counter = (counter - 1 + images.length) % images.length;
  showSlide(counter);
}

// Start auto-slide with a 30-second timer
function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    nextSlide();
  }, 30000); // 30 seconds
}

// Stop auto-slide
function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

// Handle user interaction (pause auto-slide for 2 minutes)
function handleUserInteraction() {
  stopAutoSlide();
  clearTimeout(pauseTimeout);
  pauseTimeout = setTimeout(() => {
    startAutoSlide();
  }, 120000); // Pause for 2 minutes
}

// Event listeners for buttons
nextBtn.addEventListener('click', () => {
  nextSlide();
  handleUserInteraction();
});

prevBtn.addEventListener('click', () => {
  prevSlide();
  handleUserInteraction();
});

// Recalculate on window resize
window.addEventListener('resize', () => {
  showSlide(counter);
});

// Initial Setup
startAutoSlide();
showSlide(counter); // Show the first slide initially