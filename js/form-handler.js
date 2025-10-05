document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');
  const submitBtn = document.getElementById('submit-btn');
  const submitText = document.getElementById('submit-text');
  const submitSpinner = document.getElementById('submit-spinner');
  
  if (!contactForm) return;
  
  // Handle form submission
  contactForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Check honeypot field for spam protection
    const honeypot = document.getElementById('honeypot');
    if (honeypot && honeypot.value) {
      // If honeypot is filled, it's likely a bot
      showFormMessage('Submission blocked for security reasons.', 'error');
      return;
    }
    
    // Validate all inputs before submission
    const formInputs = contactForm.querySelectorAll('input[required], textarea[required]');
    let isFormValid = true;
    
    formInputs.forEach(input => {
      if (!validateInput(input)) {
        isFormValid = false;
      }
    });
    
    if (!isFormValid) {
      showFormMessage('Please fix the errors in the form', 'error');
      return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    // Get form data
    const formData = new FormData(contactForm);
    const formObject = {};
    
    formData.forEach((value, key) => {
      if (key !== 'honeypot') { // Don't include honeypot in the data
        formObject[key] = value;
      }
    });
    
    // Show loading message
    showFormMessage('Sending your message...', 'info');
    
    // Submit to Formspree
    fetch(contactForm.action, {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Network response was not ok');
      }
    })
    .then(data => {
      // Reset form
      contactForm.reset();
      
      // Show success message
      showFormMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
    })
    .catch(error => {
      console.error('Form submission error:', error);
      // Show error message
      showFormMessage('Oops! Something went wrong. Please try again later.', 'error');
    })
    .finally(() => {
      // Reset loading state
      setLoadingState(false);
    });
  });
  
  // Function to set loading state
  function setLoadingState(isLoading) {
    if (!submitBtn || !submitText || !submitSpinner) return;
    
    if (isLoading) {
      submitBtn.disabled = true;
      submitText.textContent = 'Sending...';
      submitSpinner.classList.remove('hidden');
    } else {
      submitBtn.disabled = false;
      submitText.textContent = 'Send Message';
      submitSpinner.classList.add('hidden');
    }
  }
  
  // Function to show form messages
  function showFormMessage(message, type) {
    if (!formMessage) return;
    
    // Set message content
    formMessage.textContent = message;
    
    // Remove existing classes
    formMessage.classList.remove(
      'hidden', 
      'bg-green-100', 
      'text-green-700', 
      'bg-red-100', 
      'text-red-700',
      'bg-blue-100',
      'text-blue-700',
      'p-4',
      'rounded-md'
    );
    
    // Add appropriate classes based on message type
    formMessage.classList.add('p-4', 'rounded-md');
    
    switch (type) {
      case 'success':
        formMessage.classList.add('bg-green-100', 'text-green-700');
        break;
      case 'error':
        formMessage.classList.add('bg-red-100', 'text-red-700');
        break;
      case 'info':
        formMessage.classList.add('bg-blue-100', 'text-blue-700');
        break;
    }
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        formMessage.classList.add('hidden');
      }, 5000);
    }
  }
  
  // Form validation
  const formInputs = contactForm.querySelectorAll('input, textarea');
  
  formInputs.forEach(input => {
    // Skip honeypot field
    if (input.id === 'honeypot') return;
    
    // Add validation on blur
    input.addEventListener('blur', function() {
      validateInput(this);
    });
    
    // Remove error styling on input
    input.addEventListener('input', function() {
      if (this.classList.contains('border-red-500')) {
        this.classList.remove('border-red-500');
        const errorMsg = this.parentNode.querySelector('.error-message');
        if (errorMsg) {
          errorMsg.remove();
        }
      }
    });
  });
  
  // Function to validate individual inputs
  function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error message
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
    
    // Remove error styling
    input.classList.remove('border-red-500');
    
    // Check if required and empty
    if (input.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }
    
    // Name validation (min length)
    if (input.id === 'name' && value) {
      if (value.length < 2) {
        isValid = false;
        errorMessage = 'Name must be at least 2 characters long';
      }
    }
    
    // Email validation
    if (input.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }
    
    // Subject validation (min length)
    if (input.id === 'subject' && value) {
      if (value.length < 3) {
        isValid = false;
        errorMessage = 'Subject must be at least 3 characters long';
      }
    }
    
    // Message validation (min length)
    if (input.id === 'message' && value) {
      if (value.length < 10) {
        isValid = false;
        errorMessage = 'Message must be at least 10 characters long';
      }
    }
    
    // Privacy checkbox validation
    if (input.id === 'privacy' && input.hasAttribute('required')) {
      if (!input.checked) {
        isValid = false;
        errorMessage = 'You must agree to the privacy policy';
      }
    }
    
    // Display error if not valid
    if (!isValid) {
      input.classList.add('border-red-500');
      
      const errorElement = document.createElement('p');
      errorElement.className = 'error-message text-red-500 text-sm mt-1';
      errorElement.textContent = errorMessage;
      
      input.parentNode.appendChild(errorElement);
    }
    
    return isValid;
  }
});