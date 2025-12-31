/**
* Template Name: Tour
* Template URL: https://bootstrapmade.com/tour-bootstrap-travel-website-template/
* Updated: Jul 01 2025 with Bootstrap v5.3.7
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
  const body = document.querySelector('body');

  function mobileNavToogle() {
    const isActive = body.classList.toggle('mobile-nav-active');
    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.classList.toggle('bi-list');
      mobileNavToggleBtn.classList.toggle('bi-x');
      // Update aria-expanded for accessibility
      if (mobileNavToggleBtn.hasAttribute('aria-expanded')) {
        mobileNavToggleBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      }
    }
  }
  
  // Only initialize if not already initialized by include.js
  if (mobileNavToggleBtn && !mobileNavToggleBtn.hasAttribute('data-initialized')) {
    mobileNavToggleBtn.setAttribute('data-initialized', 'true');
    // Support both click and touch events for better mobile interaction
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
    mobileNavToggleBtn.addEventListener('touchend', function(e) {
      e.preventDefault();
      mobileNavToogle();
    });
  }

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

  /**
   * Hide mobile nav on same-page/hash links
   * But don't close if clicking on dropdown toggle or dropdown parent link
   */
  document.querySelectorAll('#navmenu a, #navmenu-mobile a').forEach(link => {
    link.addEventListener('click', function(e) {
      // Don't close menu if clicking on dropdown toggle icon
      if (e.target.classList.contains('toggle-dropdown') || e.target.closest('.toggle-dropdown')) {
        return;
      }
      
      // Check if this is a dropdown parent link (direct child of .dropdown li)
      const parentLi = this.closest('li');
      const dropdownLi = this.closest('.dropdown');
      
      // If this link is the direct child of a dropdown li (the parent link), don't close menu
      if (dropdownLi && parentLi === dropdownLi && dropdownLi.contains(this)) {
        // Check if this is actually the parent link, not a submenu link
        const isParentLink = dropdownLi.querySelector('> a') === this;
        if (isParentLink) {
          // Let the dropdown handler manage this - don't close menu
          return;
        }
      }
      
      // Close menu for regular links and submenu links (links inside dropdown ul)
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(toggleIcon => {
    toggleIcon.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Get the dropdown li element
      const dropdownLi = this.closest('.dropdown');
      if (!dropdownLi) return;
      
      // Toggle active class on the dropdown li - this will show/hide the submenu via CSS
      dropdownLi.classList.toggle('active');
      
      // Rotate the chevron icon
      this.style.transform = dropdownLi.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
    });
  });
  
  // Also handle clicking on the dropdown parent link (not just the icon)
  document.querySelectorAll('.navmenu .dropdown > a').forEach(dropdownLink => {
    dropdownLink.addEventListener('click', function(e) {
      // If clicking directly on the toggle icon, let that handler manage it
      if (e.target.classList.contains('toggle-dropdown') || e.target.closest('.toggle-dropdown')) {
        return;
      }
      
      // Prevent navigation for dropdown parent links
      e.preventDefault();
      e.stopPropagation();
      
      const dropdownLi = this.closest('.dropdown');
      if (!dropdownLi) return;
      
      // Toggle active class on the dropdown li
      dropdownLi.classList.toggle('active');
      
      // Rotate the chevron icon
      const toggleIcon = this.querySelector('.toggle-dropdown');
      if (toggleIcon) {
        toggleIcon.style.transform = dropdownLi.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle, .faq-item .faq-header').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * WhatsApp Link Handler
   */
  document.querySelectorAll('.whatsapp-link').forEach((whatsappLink) => {
    whatsappLink.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const href = this.getAttribute('href');
      if (href) {
        window.open(href, '_blank', 'noopener,noreferrer');
      }
    });
  });

})();