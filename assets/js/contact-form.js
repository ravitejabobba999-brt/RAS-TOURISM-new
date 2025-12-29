/**
 * Contact Form Handler
 * Handles form submission using EmailJS for real email delivery
 * 
 * SETUP INSTRUCTIONS:
 * 1. Sign up for a free account at https://www.emailjs.com/
 * 2. Create an email service (Gmail, Outlook, etc.)
 * 3. Create an email template with these variables: {{from_name}}, {{from_email}}, {{subject}}, {{message}}
 * 4. Get your Service ID, Template ID, and Public Key from EmailJS dashboard
 * 5. Update the configuration below with your credentials
 */

(function() {
  "use strict";

  // ============================================
  // EMAILJS CONFIGURATION
  // ============================================
  // Configuration is loaded from emailjs-config.js
  // If that file doesn't exist or isn't loaded, use inline config below
  let EMAILJS_CONFIG;
  
  // Try to load from external config file, fallback to inline config
  if (typeof window.EMAILJS_CONFIG !== 'undefined') {
    EMAILJS_CONFIG = window.EMAILJS_CONFIG;
    console.log('📋 EmailJS config loaded from emailjs-config.js');
  } else {
    // Inline fallback configuration - UPDATE THESE VALUES
    EMAILJS_CONFIG = {
      SERVICE_ID: 'YOUR_SERVICE_ID',        // Your EmailJS Service ID
      TEMPLATE_ID: 'YOUR_TEMPLATE_ID',      // Your EmailJS Template ID
      PUBLIC_KEY: 'YOUR_PUBLIC_KEY',        // Your EmailJS Public Key
      TO_EMAIL: 'rasgroupofcompany17@gmail.com' // Recipient email address
    };
    console.warn('⚠️ Using inline fallback config. Make sure emailjs-config.js is loaded.');
  }
  
  // Log configuration status on load
  console.log('🔍 EmailJS Configuration Status:');
  console.log('  SERVICE_ID:', EMAILJS_CONFIG.SERVICE_ID === 'YOUR_SERVICE_ID' ? '❌ NOT SET' : '✅ Set');
  console.log('  TEMPLATE_ID:', EMAILJS_CONFIG.TEMPLATE_ID === 'YOUR_TEMPLATE_ID' ? '❌ NOT SET' : '✅ Set');
  console.log('  PUBLIC_KEY:', EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY' ? '❌ NOT SET' : '✅ Set');

  // Initialize EmailJS
  let emailjsInitialized = false;

  function initEmailJS() {
    // Check if EmailJS SDK is loaded
    if (typeof emailjs === 'undefined') {
      console.error('❌ EmailJS SDK not loaded. Check if the script is included in contact.html');
      return false;
    }
    
    // Check if configuration exists
    if (!EMAILJS_CONFIG) {
      console.error('❌ EMAILJS_CONFIG not found. Make sure emailjs-config.js is loaded before contact-form.js');
      return false;
    }
    
    // Check if configuration is set (not using placeholder values)
    if (EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY' ||
        EMAILJS_CONFIG.SERVICE_ID === 'YOUR_SERVICE_ID' ||
        EMAILJS_CONFIG.TEMPLATE_ID === 'YOUR_TEMPLATE_ID') {
      console.warn('⚠️ EmailJS not configured!');
      console.warn('Please update assets/js/emailjs-config.js with your EmailJS credentials:');
      console.warn('  - SERVICE_ID: ' + EMAILJS_CONFIG.SERVICE_ID);
      console.warn('  - TEMPLATE_ID: ' + EMAILJS_CONFIG.TEMPLATE_ID);
      console.warn('  - PUBLIC_KEY: ' + EMAILJS_CONFIG.PUBLIC_KEY);
      console.warn('See EMAILJS_SETUP_STEPS.md for detailed instructions.');
      return false;
    }
    
    // Initialize EmailJS
    try {
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
      emailjsInitialized = true;
      console.log('✅ EmailJS initialized successfully');
      console.log('📧 Service ID:', EMAILJS_CONFIG.SERVICE_ID);
      console.log('📝 Template ID:', EMAILJS_CONFIG.TEMPLATE_ID);
      console.log('📮 To Email:', EMAILJS_CONFIG.TO_EMAIL);
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize EmailJS:', error);
      emailjsInitialized = false;
      return false;
    }
  }

  // Wait for DOM and EmailJS to be ready
  document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) {
      console.error('Contact form not found');
      return;
    }

    // Initialize EmailJS - wait for SDK to load
    function tryInitEmailJS() {
      if (typeof emailjs !== 'undefined') {
        initEmailJS();
      } else {
        // Retry after a short delay if EmailJS hasn't loaded yet
        setTimeout(tryInitEmailJS, 100);
      }
    }

    // Start initialization
    tryInitEmailJS();

    // Also try on window load as fallback
    window.addEventListener('load', function() {
      if (typeof emailjs !== 'undefined' && !emailjsInitialized) {
        initEmailJS();
      }
    });

    contactForm.addEventListener('submit', handleFormSubmit);
  });

  /**
   * Handle form submission
   */
  function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Get form values
    const name = formData.get('name') || '';
    const email = formData.get('email') || '';
    const subject = formData.get('subject') || '';
    const message = formData.get('message') || '';

    // Validate form
    if (!validateForm(form, name, email, subject, message)) {
      return;
    }

    // Show loading state
    showLoading(form);
    hideMessages(form);

    // Process form submission and send email
    processFormSubmission(form, { name, email, subject, message });
  }

  /**
   * Validate form inputs
   */
  function validateForm(form, name, email, subject, message) {
    let isValid = true;
    const errors = [];

    // Validate name
    if (!name || name.trim().length < 2) {
      errors.push('Please enter a valid name (at least 2 characters)');
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
      isValid = false;
    }

    // Validate subject
    if (!subject || subject.trim().length < 3) {
      errors.push('Please enter a subject (at least 3 characters)');
      isValid = false;
    }

    // Validate message
    if (!message || message.trim().length < 10) {
      errors.push('Please enter a message (at least 10 characters)');
      isValid = false;
    }

    if (!isValid) {
      displayError(form, errors.join('<br>'));
      return false;
    }

    return true;
  }

  /**
   * Process form submission using EmailJS sendForm()
   * This is the recommended method as it automatically maps form fields
   */
  function processFormSubmission(form, data) {
    // Check if EmailJS SDK is loaded
    if (typeof emailjs === 'undefined') {
      displayError(form, 'Email service is not available. Please refresh the page and try again.');
      console.error('❌ EmailJS SDK not loaded!');
      return;
    }

    // Check if configuration exists
    if (!EMAILJS_CONFIG) {
      displayError(form, 'Email service is not configured. Please make sure assets/js/emailjs-config.js is loaded.');
      console.error('❌ EMAILJS_CONFIG not found!');
      console.error('Make sure emailjs-config.js is loaded before contact-form.js in contact.html');
      return;
    }
    
    // Debug: Log current config values
    console.log('🔍 Checking EmailJS configuration...');
    console.log('  SERVICE_ID:', EMAILJS_CONFIG.SERVICE_ID);
    console.log('  TEMPLATE_ID:', EMAILJS_CONFIG.TEMPLATE_ID);
    console.log('  PUBLIC_KEY:', EMAILJS_CONFIG.PUBLIC_KEY ? '***' + EMAILJS_CONFIG.PUBLIC_KEY.slice(-4) : 'NOT SET');

    // Check if configuration is set (not using placeholder values)
    if (EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY' ||
        EMAILJS_CONFIG.SERVICE_ID === 'YOUR_SERVICE_ID' ||
        EMAILJS_CONFIG.TEMPLATE_ID === 'YOUR_TEMPLATE_ID') {
      // User-friendly error message (don't show technical details to end users)
      displayError(form, 'Email service is temporarily unavailable. Please contact us directly at rasgroupofcompany17@gmail.com or try again later.');
      console.error('❌ EmailJS not configured!');
      console.error('Current values:');
      console.error('  SERVICE_ID:', EMAILJS_CONFIG.SERVICE_ID);
      console.error('  TEMPLATE_ID:', EMAILJS_CONFIG.TEMPLATE_ID);
      console.error('  PUBLIC_KEY:', EMAILJS_CONFIG.PUBLIC_KEY);
      console.error('⚠️ DEVELOPER NOTE: Please update assets/js/emailjs-config.js with your actual EmailJS credentials.');
      console.error('See EMAILJS_SETUP_STEPS.md for step-by-step instructions.');
      return;
    }

    // Check if EmailJS is initialized
    if (!emailjsInitialized) {
      // Try to initialize now
      if (!initEmailJS()) {
        displayError(form, 'Email service is temporarily unavailable. Please contact us directly at rasgroupofcompany17@gmail.com.');
        return;
      }
    }

    // Use sendForm() - recommended method that automatically maps form fields
    // The form fields (name, email, subject, message) will be automatically mapped
    // to template variables with the same names
    emailjs.sendForm(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      form
    )
    .then(function(response) {
      // Email sent successfully
      console.log('✅ Email sent successfully!', response.status, response.text);
      console.log('📧 Email delivered to:', EMAILJS_CONFIG.TO_EMAIL);
      showSuccess(form);
      form.reset();
    })
    .catch(function(error) {
      // Email sending failed
      console.error('❌ Email sending failed:', error);
      let errorMessage = 'Failed to send email. ';
      
      if (error.text) {
        errorMessage += error.text;
      } else if (error.message) {
        errorMessage += error.message;
      } else if (error.status) {
        errorMessage += `Error ${error.status}. Please try again later.`;
      } else {
        errorMessage += 'Please try again later or contact us directly at ' + EMAILJS_CONFIG.TO_EMAIL;
      }
      
      displayError(form, errorMessage);
    });
  }

  /**
   * Show loading state
   */
  function showLoading(form) {
    const loading = form.querySelector('.loading');
    if (loading) {
      loading.classList.add('d-block');
    }
  }

  /**
   * Hide loading state
   */
  function hideLoading(form) {
    const loading = form.querySelector('.loading');
    if (loading) {
      loading.classList.remove('d-block');
    }
  }

  /**
   * Show success message
   */
  function showSuccess(form) {
    hideLoading(form);
    const sentMessage = form.querySelector('.sent-message');
    if (sentMessage) {
      sentMessage.classList.add('d-block');
      // Scroll to success message
      sentMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /**
   * Display error message
   */
  function displayError(form, error) {
    hideLoading(form);
    const errorMessage = form.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.innerHTML = typeof error === 'string' ? error : 'An error occurred. Please try again.';
      errorMessage.classList.add('d-block');
      // Scroll to error message
      errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /**
   * Hide all messages
   */
  function hideMessages(form) {
    const errorMessage = form.querySelector('.error-message');
    const sentMessage = form.querySelector('.sent-message');
    
    if (errorMessage) {
      errorMessage.classList.remove('d-block');
      errorMessage.innerHTML = '';
    }
    if (sentMessage) {
      sentMessage.classList.remove('d-block');
    }
  }

})();




