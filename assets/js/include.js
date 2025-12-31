/**
 * Include Header and Footer
 * Loads common header and footer HTML files into pages
 */

(function() {
  'use strict';

  /**
   * Load HTML content into an element
   */
  function loadHTML(elementId, filePath) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Element with id "${elementId}" not found`);
      return;
    }

    fetch(filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        element.innerHTML = html;
        
        // After loading header, update active navigation link based on current page
        if (elementId === 'header') {
          updateActiveNavLink();
          // Re-initialize mobile nav toggle after header is loaded
          initMobileNav();
        }
      })
      .catch(error => {
        console.error(`Error loading ${filePath}:`, error);
      });
  }

  /**
   * Update active navigation link based on current page
   */
  function updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('#navmenu a');
    
    // Remove active class from all links
    navLinks.forEach(link => {
      link.classList.remove('active');
    });
    
    // Add active class to matching link
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /**
   * Initialize mobile navigation toggle
   */
  function initMobileNav() {
    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
    const body = document.querySelector('body');
    
    if (mobileNavToggleBtn && !mobileNavToggleBtn.hasAttribute('data-initialized')) {
      mobileNavToggleBtn.setAttribute('data-initialized', 'true');
      
      function mobileNavToogle() {
        const isActive = body.classList.toggle('mobile-nav-active');
        mobileNavToggleBtn.classList.toggle('bi-list');
        mobileNavToggleBtn.classList.toggle('bi-x');
        // Update aria-expanded for accessibility
        if (mobileNavToggleBtn.hasAttribute('aria-expanded')) {
          mobileNavToggleBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        }
      }
      
      mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
      mobileNavToggleBtn.addEventListener('touchend', function(e) {
        e.preventDefault();
        mobileNavToogle();
      });
      
      // Close menu when clicking outside (on the overlay)
      document.addEventListener('click', function(e) {
        if (body.classList.contains('mobile-nav-active')) {
          const navmenu = document.querySelector('#navmenu-mobile');
          const isClickInsideNav = navmenu && navmenu.contains(e.target);
          const isClickOnToggle = mobileNavToggleBtn && mobileNavToggleBtn.contains(e.target);
          
          if (!isClickInsideNav && !isClickOnToggle) {
            mobileNavToogle();
          }
        }
      });
      
      // Hide mobile nav on same-page/hash links (both desktop and mobile menus)
      document.querySelectorAll('#navmenu a, #navmenu-mobile a').forEach(navmenu => {
        navmenu.addEventListener('click', () => {
          if (body.classList.contains('mobile-nav-active')) {
            mobileNavToogle();
          }
        });
      });
      
      // Toggle mobile nav dropdowns
      document.querySelectorAll('#navmenu-mobile .toggle-dropdown').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          const parent = this.closest('.dropdown');
          if (parent) {
            parent.classList.toggle('active');
            const dropdown = parent.querySelector('ul');
            if (dropdown) {
              dropdown.classList.toggle('dropdown-active');
            }
          }
        });
      });
    }
  }

  // Load header and footer when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      loadHTML('header', 'includes/header.html');
      loadHTML('footer', 'includes/footer.html');
    });
  } else {
    // DOM is already ready
    loadHTML('header', 'includes/header.html');
    loadHTML('footer', 'includes/footer.html');
  }

})();

