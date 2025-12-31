/**
 * Hotels Search and Display Handler
 * Handles hotel search form submission and displays results
 */

(function() {
  'use strict';

  // Store original hotel data for filtering/sorting
  let originalHotelData = null;
  let allProperties = [];

  // Set minimum date to today
  function setMinDates() {
    const today = new Date().toISOString().split('T')[0];
    const checkInInput = document.getElementById('check_in_date');
    const checkOutInput = document.getElementById('check_out_date');
    
    if (checkInInput) {
      checkInInput.setAttribute('min', today);
    }
    if (checkOutInput) {
      checkOutInput.setAttribute('min', today);
    }

    // Set check-out minimum to check-in date
    if (checkInInput && checkOutInput) {
      checkInInput.addEventListener('change', function() {
        const checkInDate = this.value;
        if (checkInDate) {
          const nextDay = new Date(checkInDate);
          nextDay.setDate(nextDay.getDate() + 1);
          checkOutInput.setAttribute('min', nextDay.toISOString().split('T')[0]);
          
          // If check-out is before or equal to check-in, update it
          if (checkOutInput.value && checkOutInput.value <= checkInDate) {
            checkOutInput.value = nextDay.toISOString().split('T')[0];
          }
        }
      });
    }
  }

  // Format price
  function formatPrice(price) {
    if (!price) return 'Price not available';
    if (typeof price === 'string') {
      // If already formatted, return as is
      if (price.includes('₹') || price.includes('$')) {
        return price;
      }
      return '₹' + price;
    }
    return '₹' + price.toLocaleString('en-IN');
  }

  // Format rating
  function formatRating(rating) {
    if (!rating) return 'N/A';
    return rating.toFixed(1);
  }

  // Create hotel property card
  function createHotelCard(property, index) {
    const name = property.name || 'Unnamed Property';
    const type = property.type || 'hotel';
    const rating = property.overall_rating || 0;
    const reviews = property.reviews || 0;
    const hotelClass = property.hotel_class || property.extracted_hotel_class || '';
    const hotelClassText = hotelClass ? `${hotelClass}-star` : '';
    
    // Get price
    let pricePerNight = 'N/A';
    let totalPrice = 'N/A';
    let extractedPrice = null;
    
    if (property.rate_per_night && property.rate_per_night.lowest) {
      pricePerNight = property.rate_per_night.lowest;
      extractedPrice = property.rate_per_night.extracted_lowest;
    } else if (property.total_rate && property.total_rate.lowest) {
      totalPrice = property.total_rate.lowest;
      extractedPrice = property.total_rate.extracted_lowest;
    }

    // Get image
    const imageUrl = property.images && property.images.length > 0 
      ? property.images[0].original_image || property.images[0].thumbnail 
      : 'assets/img/placeholder-hotel.jpg';

    // Get amenities (limit to 5)
    const amenities = property.amenities || [];
    const amenitiesList = amenities.slice(0, 5).join(', ');

    // Get location rating
    const locationRating = property.location_rating || null;

    // Get GPS coordinates
    const gps = property.gps_coordinates || null;

    return `
      <div class="col-12">
        <div class="hotel-card" data-price="${extractedPrice || 0}" data-rating="${rating}" data-reviews="${reviews}" data-hotel-class="${hotelClass}">
          <div class="row g-0">
            <div class="col-md-4">
              <div class="hotel-image-wrapper">
                <img src="${imageUrl}" alt="${name}" class="hotel-image" onerror="this.src='assets/img/placeholder-hotel.jpg'">
                ${hotelClassText ? `<span class="hotel-class-badge">${hotelClassText}</span>` : ''}
              </div>
            </div>
            <div class="col-md-8">
              <div class="hotel-card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div class="hotel-info">
                    <h5 class="hotel-name mb-1">${name}</h5>
                    <p class="hotel-type text-muted small mb-2">${type.charAt(0).toUpperCase() + type.slice(1)}</p>
                    ${gps ? `<p class="hotel-location text-muted small mb-2"><i class="bi bi-geo-alt"></i> Coordinates: ${gps.latitude.toFixed(4)}, ${gps.longitude.toFixed(4)}</p>` : ''}
                  </div>
                  <div class="hotel-price text-end">
                    ${pricePerNight !== 'N/A' ? `<div class="price-per-night">${pricePerNight}</div>` : ''}
                    ${totalPrice !== 'N/A' && pricePerNight === 'N/A' ? `<div class="total-price">${totalPrice}</div>` : ''}
                    ${pricePerNight !== 'N/A' && totalPrice !== 'N/A' ? `<div class="total-price small text-muted">Total: ${totalPrice}</div>` : ''}
                  </div>
                </div>

                ${rating > 0 ? `
                  <div class="hotel-rating mb-2">
                    <span class="rating-stars">
                      ${'★'.repeat(Math.floor(rating))}${rating % 1 >= 0.5 ? '½' : ''}
                    </span>
                    <span class="rating-value">${formatRating(rating)}</span>
                    ${reviews > 0 ? `<span class="rating-reviews">(${reviews.toLocaleString()} reviews)</span>` : ''}
                    ${locationRating ? `<span class="location-rating ms-2"><i class="bi bi-geo-alt"></i> Location: ${formatRating(locationRating)}</span>` : ''}
                  </div>
                ` : ''}

                ${amenities.length > 0 ? `
                  <div class="hotel-amenities mb-2">
                    <small class="text-muted">
                      <i class="bi bi-check-circle"></i> ${amenitiesList}
                      ${amenities.length > 5 ? ` +${amenities.length - 5} more` : ''}
                    </small>
                  </div>
                ` : ''}

                ${property.description ? `
                  <p class="hotel-description small text-muted mb-2">${property.description.substring(0, 150)}${property.description.length > 150 ? '...' : ''}</p>
                ` : ''}

                ${property.link ? `
                  <a href="${property.link}" target="_blank" class="btn btn-sm btn-primary mt-2">
                    View Details <i class="bi bi-box-arrow-up-right ms-1"></i>
                  </a>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Display hotel results
  function displayHotelResults(data) {
    const resultsSection = document.getElementById('hotel-results');
    const propertiesContainer = document.getElementById('properties-container');
    const noResults = document.getElementById('no-results');
    const filtersSection = document.querySelector('.hotel-filters-section');

    if (!resultsSection || !propertiesContainer) return;

    // Show results section
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Store original data
    originalHotelData = data;
    allProperties = [];

    // Get properties from data
    if (data.properties && data.properties.length > 0) {
      allProperties = data.properties;
    } else if (data.ads && data.ads.length > 0) {
      // Convert ads to property format
      allProperties = data.ads.map(ad => ({
        name: ad.name,
        type: 'hotel',
        overall_rating: ad.overall_rating,
        reviews: ad.reviews,
        hotel_class: ad.hotel_class,
        rate_per_night: {
          lowest: ad.price,
          extracted_lowest: ad.extracted_price
        },
        thumbnail: ad.thumbnail,
        images: ad.thumbnail ? [{ thumbnail: ad.thumbnail, original_image: ad.thumbnail }] : [],
        amenities: ad.amenities || [],
        gps_coordinates: ad.gps_coordinates,
        link: ad.link
      }));
    }

    // Filter out properties with price 0
    allProperties = allProperties.filter(prop => {
      const price = prop.rate_per_night?.extracted_lowest || prop.total_rate?.extracted_lowest || 0;
      return price > 0;
    });

    if (allProperties.length === 0) {
      noResults.style.display = 'block';
      propertiesContainer.innerHTML = '';
      if (filtersSection) filtersSection.style.display = 'none';
      return;
    }

    noResults.style.display = 'none';

    // Show filters
    if (filtersSection) {
      filtersSection.style.display = 'block';
    }

    // Display all properties
    displayFilteredResults(allProperties);

    // Set up filter handlers
    setupFilterHandlers();
  }

  // Display filtered results
  function displayFilteredResults(properties) {
    const propertiesContainer = document.getElementById('properties-container');
    if (!propertiesContainer) return;

    propertiesContainer.innerHTML = '';

    if (properties.length === 0) {
      const noResults = document.getElementById('no-results');
      if (noResults) noResults.style.display = 'block';
      return;
    }

    properties.forEach((property, index) => {
      propertiesContainer.innerHTML += createHotelCard(property, index);
    });

    // Re-initialize AOS for new elements
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }

  // Setup filter handlers
  function setupFilterHandlers() {
    const sortSelect = document.getElementById('sort-by');
    const hotelClassFilter = document.getElementById('hotel-class-filter');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');

    if (sortSelect) {
      sortSelect.addEventListener('change', filterAndSortHotels);
    }

    if (hotelClassFilter) {
      hotelClassFilter.addEventListener('change', filterAndSortHotels);
    }

    if (minPriceInput) {
      minPriceInput.addEventListener('input', filterAndSortHotels);
    }

    if (maxPriceInput) {
      maxPriceInput.addEventListener('input', filterAndSortHotels);
    }
  }

  // Filter and sort hotels
  function filterAndSortHotels() {
    if (!originalHotelData) return;

    let filtered = [...allProperties];

    // Apply hotel class filter
    const hotelClassFilter = document.getElementById('hotel-class-filter');
    if (hotelClassFilter && hotelClassFilter.value) {
      const selectedClass = parseInt(hotelClassFilter.value);
      filtered = filtered.filter(prop => {
        const propClass = prop.hotel_class || prop.extracted_hotel_class;
        return propClass === selectedClass;
      });
    }

    // Apply price filters
    const minPrice = document.getElementById('min-price')?.value;
    const maxPrice = document.getElementById('max-price')?.value;

    if (minPrice) {
      filtered = filtered.filter(prop => {
        const price = prop.rate_per_night?.extracted_lowest || prop.total_rate?.extracted_lowest || 0;
        return price >= parseFloat(minPrice);
      });
    }

    if (maxPrice) {
      filtered = filtered.filter(prop => {
        const price = prop.rate_per_night?.extracted_lowest || prop.total_rate?.extracted_lowest || 0;
        return price <= parseFloat(maxPrice);
      });
    }

    // Apply sorting
    const sortBy = document.getElementById('sort-by')?.value || 'default';

    if (sortBy !== 'default') {
      filtered.sort((a, b) => {
        switch(sortBy) {
          case 'price_low':
            const priceA = a.rate_per_night?.extracted_lowest || a.total_rate?.extracted_lowest || 0;
            const priceB = b.rate_per_night?.extracted_lowest || b.total_rate?.extracted_lowest || 0;
            return priceA - priceB;
          case 'price_high':
            const priceA2 = a.rate_per_night?.extracted_lowest || a.total_rate?.extracted_lowest || 0;
            const priceB2 = b.rate_per_night?.extracted_lowest || b.total_rate?.extracted_lowest || 0;
            return priceB2 - priceA2;
          case 'rating_high':
            return (b.overall_rating || 0) - (a.overall_rating || 0);
          case 'reviews_high':
            return (b.reviews || 0) - (a.reviews || 0);
          default:
            return 0;
        }
      });
    }

    // Filter out properties with price 0
    filtered = filtered.filter(prop => {
      const price = prop.rate_per_night?.extracted_lowest || prop.total_rate?.extracted_lowest || 0;
      return price > 0;
    });

    displayFilteredResults(filtered);
  }

  // Handle form submission
  function handleFormSubmission() {
    const hotelForm = document.getElementById('hotel-search-form');
    
    if (!hotelForm) return;

    hotelForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form elements
      const loading = hotelForm.querySelector('.loading');
      const errorMessage = hotelForm.querySelector('.error-message');
      const sentMessage = hotelForm.querySelector('.sent-message');
      const submitBtn = hotelForm.querySelector('button[type="submit"]');

      // Hide previous messages
      if (errorMessage) errorMessage.classList.remove('d-block');
      if (sentMessage) sentMessage.classList.remove('d-block');
      if (loading) loading.classList.add('d-block');

      // Disable submit button
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Searching...';
      }

      // Get form data
      const formData = new FormData(hotelForm);
      const location = formData.get('location');
      const checkInDate = formData.get('check_in_date');
      const checkOutDate = formData.get('check_out_date');

      // Validate dates
      if (checkInDate && checkOutDate) {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        
        if (checkOut <= checkIn) {
          if (errorMessage) {
            errorMessage.textContent = 'Check-out date must be after check-in date.';
            errorMessage.classList.add('d-block');
          }
          if (loading) loading.classList.remove('d-block');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bi bi-search me-2"></i>Search';
          }
          return;
        }
      }

      // Build request data
      const requestData = {
        q: location,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        adults: formData.get('adults') || '2',
        children: formData.get('children') || '0'
      };

      // Send AJAX request
      fetch('forms/hotels-api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })
      .then(response => {
        if (loading) loading.classList.remove('d-block');
        
        if (!response.ok) {
          return response.json().then(data => {
            throw new Error(data.message || 'Server error: ' + response.status);
          });
        }
        return response.json();
      })
      .then(data => {
        if (data.error) {
          throw new Error(data.message || 'Failed to search hotels');
        }

        // Success - display results
        if (data.data) {
          displayHotelResults(data.data);
        } else {
          throw new Error('No data received from server');
        }
      })
      .catch(error => {
        // Error
        if (errorMessage) {
          errorMessage.textContent = error.message || 'Failed to search hotels. Please try again later.';
          errorMessage.classList.add('d-block');
          errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        console.error('Hotel search error:', error);
      })
      .finally(() => {
        // Re-enable submit button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="bi bi-search me-2"></i>Search';
        }
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setMinDates();
      handleFormSubmission();
    });
  } else {
    setMinDates();
    handleFormSubmission();
  }
})();

