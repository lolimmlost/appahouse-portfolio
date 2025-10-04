document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');
  
  if (!contactForm) return;
  
  // Handle form submission
  contactForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const formObject = {};
    
    formData.forEach((value, key) => {
      formObject[key] = value;
    });
    
    // Show loading message
    showFormMessage('Sending your message...', 'info');
    
    // Simulate form submission (replace with actual Formspree integration)
    setTimeout(() => {
      // In a real implementation, you would send the data to Formspree
      // For now, we'll simulate a successful submission
      
      // Reset form
      contactForm.reset();
      
      // Show success message
      showFormMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
    }, 1500);
  });
  
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
    
    // Email validation
    if (input.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
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
  
  // Validate all inputs on form submission
  contactForm.addEventListener('submit', function(event) {
    let isFormValid = true;
    
    formInputs.forEach(input => {
      if (!validateInput(input)) {
        isFormValid = false;
      }
    });
    
    if (!isFormValid) {
      event.preventDefault();
      showFormMessage('Please fix the errors in the form', 'error');
    }
  });
});