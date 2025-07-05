document.addEventListener('DOMContentLoaded', function() {
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
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  
    // Intersection Observer for Scroll Animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  
    document.querySelectorAll('.job-card, .benefit-item').forEach(item => {
      observer.observe(item);
    });
  
    // Dark Mode Toggle
    function toggleDarkMode() {
      document.body.classList.toggle('dark-mode');
      const mode = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
      localStorage.setItem('color-mode', mode);
    }
  
    // Check for saved dark mode preference
    if (localStorage.getItem('color-mode') === 'dark') {
      document.body.classList.add('dark-mode');
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
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });
  
    // Form Validation and Submission
    const form = document.getElementById('careers-form');
    if (form) {
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form elements
        const name = form.elements['name'];
        const email = form.elements['email'];
        const phone = form.elements['phone'];
        const position = form.elements['position'];
        const experience = form.elements['experience'];
        const cv = form.elements['cv'];
        const submitBtn = form.querySelector('.submit-btn');
        
        // Validate fields
        if (!validateName(name.value)) {
          showError(name, 'Please enter a valid name');
          return;
        }
        
        if (!validateEmail(email.value)) {
          showError(email, 'Please enter a valid email');
          return;
        }
        
        if (!validatePhone(phone.value)) {
          showError(phone, 'Please enter a valid phone number');
          return;
        }
        
        if (position.value === '') {
          showError(position, 'Please select a position');
          return;
        }
        
        if (experience.value.trim().length < 20) {
          showError(experience, 'Please describe your experience (at least 20 characters)');
          return;
        }
        
        if (!cv.files[0]) {
          showError(cv, 'Please upload your CV');
          return;
        }
        
        if (cv.files[0].size > 20 * 1024 * 1024) {
          showError(cv, 'CV file must be less than 20MB');
          return;
        }
        
        if (!cv.files[0].name.endsWith('.pdf')) {
          showError(cv, 'Only PDF files are accepted');
          return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        try {
          // Create FormData object
          const formData = new FormData(form);
          
          // Send to FormSubmit
          const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json'
            }
          });
          
          if (response.ok) {
            // Show success message
            showFeedback('success', 'Application submitted successfully! We will contact you soon.');
            form.reset();
          } else {
            throw new Error('Network response was not ok');
          }
        } catch (error) {
          console.error('Error:', error);
          showFeedback('error', 'There was an error submitting your application. Please try again later.');
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Application';
        }
      });
      
      // Add input event listeners for real-time validation
      form.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('input', () => clearError(input));
      });
    }
    
    // Validation Functions
    function validateName(name) {
      return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name);
    }
    
    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function validatePhone(phone) {
      return /^[0-9\-\+\s\(\)]{10,}$/.test(phone);
    }
    
    // Error Handling Functions
    function showError(input, message) {
      clearError(input);
      const errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      errorElement.textContent = message;
      errorElement.style.color = '#ff3333';
      errorElement.style.fontSize = '0.8rem';
      errorElement.style.marginTop = '5px';
      input.parentNode.appendChild(errorElement);
      input.focus();
    }
    
    function clearError(input) {
      const errorElement = input.parentNode.querySelector('.error-message');
      if (errorElement) {
        errorElement.remove();
      }
    }
    
    function showFeedback(type, message) {
      // Remove existing feedback
      const existingFeedback = document.querySelector('.form-feedback');
      if (existingFeedback) existingFeedback.remove();
      
      // Create new feedback element
      const feedback = document.createElement('div');
      feedback.className = `form-feedback ${type}`;
      feedback.textContent = message;
      feedback.style.padding = '15px';
      feedback.style.margin = '20px 0';
      feedback.style.borderRadius = '5px';
      feedback.style.textAlign = 'center';
      feedback.style.fontWeight = '500';
      
      if (type === 'success') {
        feedback.style.backgroundColor = 'rgba(40, 167, 69, 0.2)';
        feedback.style.color = '#28a745';
      } else {
        feedback.style.backgroundColor = 'rgba(220, 53, 69, 0.2)';
        feedback.style.color = '#dc3545';
      }
      
      // Insert feedback above the form
      form.parentNode.insertBefore(feedback, form);
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        feedback.style.transition = 'opacity 0.5s ease';
        feedback.style.opacity = '0';
        setTimeout(() => feedback.remove(), 500);
      }, 5000);
    }
  });