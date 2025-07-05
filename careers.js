document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  function toggleMenu() {
    const navbar = document.getElementById('navbar');
    navbar.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  }

  // Assign toggle to the menu icon
  const menuToggleButton = document.querySelector('.menu-toggle'); // Changed here to match your HTML icon
  if (menuToggleButton) {
    menuToggleButton.addEventListener('click', toggleMenu);
  }

  // Close menu when link is clicked (on mobile)
  document.querySelectorAll('#navbar a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 992 && document.getElementById('navbar').classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // Sticky Header on Scroll
  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    header.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Reveal job/benefit items on scroll
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

  const darkModeToggleBtn = document.getElementById('dark-mode-toggle');
  if (darkModeToggleBtn) {
    darkModeToggleBtn.addEventListener('click', toggleDarkMode);
  }

  if (localStorage.getItem('color-mode') === 'dark') {
    document.body.classList.add('dark-mode');
  }

  // Smooth Scroll for anchor links
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

  // Form Handling
  const form = document.getElementById('careers-form');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      const nameInput = form.elements['name'];
      const emailInput = form.elements['email'];
      const phoneInput = form.elements['phone'];
      const positionInput = form.elements['position'];
      const experienceInput = form.elements['experience'];
      const cvInput = form.elements['cv'];
      const submitBtn = form.querySelector('.submit-btn');

      const replyToInput = document.querySelector('input[name="_replyto"]');
      const fromInput = document.querySelector('input[name="_from"]');

      if (replyToInput) replyToInput.value = emailInput.value;
      if (fromInput) fromInput.value = `${nameInput.value} via Salt & Pepper Website`;

      let isValid = true;

      if (!validateName(nameInput.value)) {
        showError(nameInput, 'Please enter a valid name (at least 2 characters, letters and spaces only)');
        isValid = false;
      }

      if (!validateEmail(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email address');
        isValid = false;
      }

      if (!validatePhone(phoneInput.value)) {
        showError(phoneInput, 'Please enter a valid phone number (10+ digits, allows +, -, (, ))');
        isValid = false;
      }

      if (positionInput.value === '') {
        showError(positionInput, 'Please select a position');
        isValid = false;
      }

      if (experienceInput.value.trim().length < 20) {
        showError(experienceInput, 'Please describe your experience (at least 20 characters)');
        isValid = false;
      }

      if (!cvInput.files[0]) {
        showError(cvInput, 'Please upload your CV');
        isValid = false;
      } else {
        if (cvInput.files[0].size > 20 * 1024 * 1024) {
          showError(cvInput, 'CV file must be less than 20MB');
          isValid = false;
        }
        if (!cvInput.files[0].name.toLowerCase().endsWith('.pdf')) {
          showError(cvInput, 'Only PDF files are accepted');
          isValid = false;
        }
      }

      if (!isValid) return;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      try {
        const formData = new FormData(form);

        const formSubmitResponse = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!formSubmitResponse.ok) {
          throw new Error(`Form submission failed with status: ${formSubmitResponse.status}`);
        }

        const googleSheetsResponse = await fetch("https://script.google.com/macros/s/AKfycbw7iy7mUGs1hz-DdinswMj1JpPyq7Lkmd7ceexRsedrQkUQJEQPmyR4bhXwV5ggITc/exec", {
          method: 'POST',
          body: formData
        });

        if (!googleSheetsResponse.ok) {
          console.warn(`Google Sheets submission failed with status: ${googleSheetsResponse.status}`);
        }

        const whatsappApiUrl = `https://api.callmebot.com/whatsapp.php?phone=+254716631667&text=${encodeURIComponent(
          `New Job Application:\nName: ${nameInput.value}\nEmail: ${emailInput.value}\nPhone: ${phoneInput.value}\nPosition: ${positionInput.value}`
        )}&apikey=8466042`;

        const whatsappResponse = await fetch(whatsappApiUrl);
        if (!whatsappResponse.ok) {
          console.warn(`WhatsApp notification failed with status: ${whatsappResponse.status}`);
        }

        showFeedback('success', 'Application submitted successfully! We will contact you soon.');
        form.reset();

      } catch (error) {
        console.error('Submission error:', error);
        showFeedback('error', 'There was an error submitting your application. Please try again later.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Application';
      }
    });

    form.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('input', () => clearError(input));
      input.addEventListener('change', () => clearError(input));
    });
  }

  function validateName(name) {
    return name.trim().length >= 2 && /^[a-zA-Z\s-]+$/.test(name);
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    return /^[0-9\-\+\s\(\)]{10,}$/.test(phone);
  }

  function showError(input, message) {
    clearError(input);
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#ff3333';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '5px';
    input.parentNode.insertBefore(errorElement, input.nextSibling);
    input.classList.add('error-border');
    input.focus();
  }

  function clearError(input) {
    const errorElement = input.parentNode.querySelector('.error-message');
    if (errorElement) errorElement.remove();
    input.classList.remove('error-border');
  }

  function showFeedback(type, message) {
    const existingFeedback = document.querySelector('.form-feedback');
    if (existingFeedback) existingFeedback.remove();

    const feedback = document.createElement('div');
    feedback.className = `form-feedback ${type}`;
    feedback.textContent = message;
    feedback.style.padding = '15px';
    feedback.style.margin = '20px 0';
    feedback.style.borderRadius = '5px';
    feedback.style.textAlign = 'center';
    feedback.style.fontWeight = '500';
    feedback.style.opacity = '0';
    feedback.style.transition = 'opacity 0.5s ease';

    if (type === 'success') {
      feedback.style.backgroundColor = 'rgba(40, 167, 69, 0.2)';
      feedback.style.color = '#28a745';
    } else {
      feedback.style.backgroundColor = 'rgba(220, 53, 69, 0.2)';
      feedback.style.color = '#dc3545';
    }

    form.parentNode.insertBefore(feedback, form);
    setTimeout(() => feedback.style.opacity = '1', 10);
    setTimeout(() => {
      feedback.style.opacity = '0';
      setTimeout(() => feedback.remove(), 500);
    }, 5000);
  }
});
