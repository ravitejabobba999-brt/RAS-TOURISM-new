/**
 * Visa Page Functionality
 * Handles tab switching, country search, and dropdown interactions
 */

(function() {
  'use strict';

  // Tab switching functionality
  const tabButtons = document.querySelectorAll('.tab-btn');
  const countrySearch = document.getElementById('country-search');
  const countryDropdown = document.getElementById('country-dropdown');
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  const showVisaBtn = document.getElementById('show-visa-btn');

  // Tab switching
  if (tabButtons.length > 0) {
    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all tabs
        tabButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked tab
        this.classList.add('active');
        
        // Here you can add functionality to switch content based on tab
        const tabName = this.getAttribute('data-tab');
        console.log('Switched to:', tabName);
      });
    });
  }

  // Country search and dropdown functionality
  if (countrySearch && countryDropdown) {
    // Show dropdown on focus
    countrySearch.addEventListener('focus', function() {
      countryDropdown.style.display = 'block';
    });

    // Filter dropdown items based on search
    countrySearch.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      let hasVisibleItems = false;

      dropdownItems.forEach(item => {
        const countryName = item.textContent.toLowerCase();
        if (countryName.includes(searchTerm)) {
          item.style.display = 'block';
          hasVisibleItems = true;
        } else {
          item.style.display = 'none';
        }
      });

      countryDropdown.style.display = hasVisibleItems ? 'block' : 'none';
    });

    // Handle Enter key to redirect to visa details
    countrySearch.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const searchValue = this.value.trim();
        if (searchValue) {
          // Find matching country from dropdown items
          let selectedCountry = null;
          dropdownItems.forEach(item => {
            if (item.textContent.trim().toLowerCase() === searchValue.toLowerCase()) {
              selectedCountry = item.getAttribute('data-country');
              // Mark as active
              dropdownItems.forEach(i => i.classList.remove('active'));
              item.classList.add('active');
              this.setAttribute('data-selected-country', selectedCountry);
            }
          });
          
          if (selectedCountry) {
            countryDropdown.style.display = 'none';
            window.location.href = `visa-details.html?country=${selectedCountry}`;
          } else {
            alert('Please select a valid country from the dropdown.');
            // Show dropdown if it's hidden
            countryDropdown.style.display = 'block';
          }
        }
      }
    });

    // Select country from dropdown
    dropdownItems.forEach(item => {
      item.addEventListener('click', function() {
        const countryName = this.textContent.trim();
        countrySearch.value = countryName;
        countryDropdown.style.display = 'none';
        
        // Remove active state from all items
        dropdownItems.forEach(i => i.classList.remove('active'));
        // Add active state to selected item
        this.classList.add('active');
        
        // Store selected country data attribute
        const countryCode = this.getAttribute('data-country');
        countrySearch.setAttribute('data-selected-country', countryCode);
        
        // Automatically redirect to visa-details.html with selected country
        if (countryCode) {
          window.location.href = `visa-details.html?country=${countryCode}`;
        }
      });

      // Hover effect
      item.addEventListener('mouseenter', function() {
        dropdownItems.forEach(i => i.classList.remove('hover'));
        this.classList.add('hover');
      });
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', function(event) {
      if (!countrySearch.contains(event.target) && !countryDropdown.contains(event.target)) {
        countryDropdown.style.display = 'none';
      }
    });
  }

  // Show Visa button functionality
  if (showVisaBtn) {
    showVisaBtn.addEventListener('click', function() {
      // Get selected country from dropdown or search input
      let selectedCountry = null;
      
      // Check if a dropdown item is active
      const activeItem = document.querySelector('.dropdown-item.active');
      if (activeItem) {
        selectedCountry = activeItem.getAttribute('data-country');
      } else {
        // Fallback to search input value
        const searchValue = countrySearch.value.trim();
        if (searchValue) {
          // Find matching country from dropdown items
          dropdownItems.forEach(item => {
            if (item.textContent.trim().toLowerCase() === searchValue.toLowerCase()) {
              selectedCountry = item.getAttribute('data-country');
            }
          });
        }
      }

      if (selectedCountry) {
        // Redirect to visa-details.html with country parameter
        window.location.href = `visa-details.html?country=${selectedCountry}`;
      } else {
        alert('Please select a country from the dropdown first.');
      }
    });
  }

})();

