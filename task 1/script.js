// Mobile Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// Contact Form Validation
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    let isValid = true;
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    // Reset errors
    document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');
    document.getElementById('successMsg').style.display = 'none';

    // Validate Name
    if (name.value.trim().length < 2) {
      document.getElementById('nameError').style.display = 'block';
      isValid = false;
    }

    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
      document.getElementById('emailError').style.display = 'block';
      isValid = false;
    }

    // Validate Message
    if (message.value.trim().length < 10) {
      document.getElementById('messageError').style.display = 'block';
      isValid = false;
    }

    // If all valid
    if (isValid) {
      document.getElementById('successMsg').style.display = 'block';
      contactForm.reset();
    }
  });
}