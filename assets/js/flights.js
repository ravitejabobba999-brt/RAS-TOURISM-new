/**
 * Flights Search and Display Handler
 * Handles flight search form submission and displays results
 */

(function() {
  'use strict';

  // Store original flight data for filtering/sorting
  let originalFlightData = null;
  let allFlights = [];

  // Set minimum date to today
  function setMinDates() {
    const today = new Date().toISOString().split('T')[0];
    const outboundDateInput = document.getElementById('outbound_date');
    const returnDateInput = document.getElementById('return_date');
    
    if (outboundDateInput) {
      outboundDateInput.setAttribute('min', today);
    }
    if (returnDateInput) {
      returnDateInput.setAttribute('min', today);
    }
  }

  // Handle trip type change
  function handleTripTypeChange() {
    const tripTypeRadios = document.querySelectorAll('input[name="trip_type"]');
    const returnDateGroup = document.getElementById('return-date-group');
    const returnDateInput = document.getElementById('return_date');

    tripTypeRadios.forEach(radio => {
      radio.addEventListener('change', function() {
        if (this.value === 'one_way') {
          returnDateGroup.style.display = 'none';
          returnDateInput.removeAttribute('required');
        } else {
          returnDateGroup.style.display = 'block';
          returnDateInput.setAttribute('required', 'required');
        }
      });
    });
  }

  // Initialize city autocomplete
  function initializeCityAutocomplete() {
    const departureInput = document.getElementById('departure_city');
    const arrivalInput = document.getElementById('arrival_city');
    const departureSuggestions = document.getElementById('departure-suggestions');
    const arrivalSuggestions = document.getElementById('arrival-suggestions');
    const departureCodeInput = document.getElementById('departure_id');
    const arrivalCodeInput = document.getElementById('arrival_id');

    function setupAutocomplete(input, suggestionsContainer, codeInput) {
      let selectedIndex = -1;
      let currentSuggestions = [];
      let isClickingSuggestion = false;

      function showSuggestions(suggestions) {
        if (!suggestions || suggestions.length === 0) {
          suggestionsContainer.innerHTML = '';
          suggestionsContainer.style.display = 'none';
          return;
        }

        currentSuggestions = suggestions;
        suggestionsContainer.innerHTML = suggestions.map((airport, index) => `
          <div class="suggestion-item" data-index="${index}" data-code="${airport.code}">
            <div class="suggestion-city">${airport.city}, ${airport.country}</div>
            <div class="suggestion-airport">${airport.name} (${airport.code})</div>
          </div>
        `).join('');

        suggestionsContainer.style.display = 'block';

        // Add click handlers - use mousedown to fire before blur
        suggestionsContainer.querySelectorAll('.suggestion-item').forEach((item, index) => {
          item.addEventListener('mousedown', function(e) {
            e.preventDefault(); // Prevent input blur
            isClickingSuggestion = true;
            const airport = currentSuggestions[index];
            if (airport) {
              input.value = `${airport.city}, ${airport.country}`;
              codeInput.value = airport.code;
              input.classList.add('is-valid');
              suggestionsContainer.style.display = 'none';
              selectedIndex = -1;
              // Focus back to input to maintain form flow
              setTimeout(() => {
                input.focus();
                isClickingSuggestion = false;
              }, 10);
            }
          });

          // Also handle click as backup
          item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (!isClickingSuggestion) {
              const airport = currentSuggestions[index];
              if (airport) {
                input.value = `${airport.city}, ${airport.country}`;
                codeInput.value = airport.code;
                input.classList.add('is-valid');
                suggestionsContainer.style.display = 'none';
                selectedIndex = -1;
              }
            }
          });

          item.addEventListener('mouseenter', function() {
            suggestionsContainer.querySelectorAll('.suggestion-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            selectedIndex = index;
          });
        });
      }

      function hideSuggestions() {
        // Don't hide if user is clicking on a suggestion
        if (isClickingSuggestion) {
          return;
        }
        setTimeout(() => {
          if (!isClickingSuggestion) {
            suggestionsContainer.style.display = 'none';
          }
        }, 200);
      }

      input.addEventListener('input', function() {
        const query = this.value.trim();
        
        // Clear validation and code if user is typing
        if (query.length === 0) {
          codeInput.value = '';
          input.classList.remove('is-valid');
        }
        
        if (query.length < 2) {
          suggestionsContainer.style.display = 'none';
          codeInput.value = '';
          input.classList.remove('is-valid');
          return;
        }

        const suggestions = searchAirports(query);
        if (suggestions.length > 0) {
          showSuggestions(suggestions.slice(0, 10));
        } else {
          suggestionsContainer.style.display = 'none';
          codeInput.value = '';
          input.classList.remove('is-valid');
        }
      });

      input.addEventListener('focus', function() {
        const query = this.value.trim();
        if (query.length >= 2) {
          const suggestions = searchAirports(query);
          if (suggestions.length > 0) {
            showSuggestions(suggestions.slice(0, 10));
          }
        } else {
          // Show some popular airports when focusing on empty input
          const popularAirports = (window.airportsData || []).slice(0, 10);
          showSuggestions(popularAirports);
        }
      });

      input.addEventListener('blur', function() {
        // Delay to allow click event to fire first
        setTimeout(() => {
          if (!isClickingSuggestion) {
            hideSuggestions();
          }
        }, 150);
      });

      // Prevent hiding when clicking inside suggestions container
      suggestionsContainer.addEventListener('mousedown', function(e) {
        e.preventDefault();
        isClickingSuggestion = true;
      });

      suggestionsContainer.addEventListener('click', function(e) {
        e.stopPropagation();
      });

      // Keyboard navigation
      input.addEventListener('keydown', function(e) {
        if (!suggestionsContainer.style.display || suggestionsContainer.style.display === 'none') {
          return;
        }

        const items = suggestionsContainer.querySelectorAll('.suggestion-item');

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          selectedIndex = (selectedIndex + 1) % items.length;
          items[selectedIndex].scrollIntoView({ block: 'nearest' });
          items.forEach((item, idx) => {
            item.classList.toggle('active', idx === selectedIndex);
          });
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          selectedIndex = selectedIndex <= 0 ? items.length - 1 : selectedIndex - 1;
          items[selectedIndex].scrollIntoView({ block: 'nearest' });
          items.forEach((item, idx) => {
            item.classList.toggle('active', idx === selectedIndex);
          });
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
          e.preventDefault();
          items[selectedIndex].click();
        } else if (e.key === 'Escape') {
          suggestionsContainer.style.display = 'none';
          selectedIndex = -1;
        }
      });
    }

    if (departureInput && departureSuggestions && departureCodeInput) {
      setupAutocomplete(departureInput, departureSuggestions, departureCodeInput);
    }

    if (arrivalInput && arrivalSuggestions && arrivalCodeInput) {
      setupAutocomplete(arrivalInput, arrivalSuggestions, arrivalCodeInput);
    }
  }

  // Format duration from minutes to readable format
  function formatDuration(minutes) {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}m`;
    }
  }

  // Format date time
  function formatDateTime(dateTimeString) {
    if (!dateTimeString) return 'N/A';
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return dateTimeString;
    }
  }

  // Format price in INR
  function formatPrice(price) {
    if (!price) return '₹0';
    return '₹' + parseInt(price).toLocaleString('en-IN');
  }

  // Get first departure time from flight (helper function)
  function getDepartureTimeFromFlight(flight) {
    if (flight && flight.flights && flight.flights.length > 0) {
      const firstFlight = flight.flights[0];
      if (firstFlight.departure_airport && firstFlight.departure_airport.time) {
        return new Date(firstFlight.departure_airport.time).getTime();
      }
    }
    return 0;
  }

  // Create flight card HTML
  function createFlightCard(flightData, index) {
    const flights = flightData.flights || [];
    const layovers = flightData.layovers || [];
    const totalDuration = flightData.total_duration || 0;
    const price = flightData.price || 0;
    const carbonEmissions = flightData.carbon_emissions || {};
    
    let flightsHtml = '';
    flights.forEach((flight, idx) => {
      const departure = flight.departure_airport || {};
      const arrival = flight.arrival_airport || {};
      const airline = flight.airline || 'Unknown';
      const airlineLogo = flight.airline_logo || '';
      const flightNumber = flight.flight_number || '';
      const duration = flight.duration || 0;
      const airplane = flight.airplane || '';
      const legroom = flight.legroom || '';
      const overnight = flight.overnight || false;
      
      flightsHtml += `
        <div class="flight-leg mb-3">
          <div class="flight-leg-header d-flex align-items-center mb-2">
            ${airlineLogo ? `<img src="${airlineLogo}" alt="${airline}" class="airline-logo me-2" style="width: 40px; height: 40px;">` : ''}
            <div>
              <strong>${airline}</strong>
              ${flightNumber ? `<span class="text-muted ms-2">${flightNumber}</span>` : ''}
            </div>
          </div>
          <div class="row align-items-center">
            <div class="col-md-4">
              <div class="airport-info">
                <div class="airport-time">${formatDateTime(departure.time)}</div>
                <div class="airport-code">${departure.id || 'N/A'}</div>
                <div class="airport-name">${departure.name || 'N/A'}</div>
              </div>
            </div>
            <div class="col-md-4 text-center">
              <div class="flight-duration">
                <i class="bi bi-clock"></i> ${formatDuration(duration)}
                ${overnight ? '<span class="badge bg-warning ms-2">Overnight</span>' : ''}
              </div>
              ${airplane ? `<div class="text-muted small mt-1">${airplane}</div>` : ''}
            </div>
            <div class="col-md-4 text-end">
              <div class="airport-info">
                <div class="airport-time">${formatDateTime(arrival.time)}</div>
                <div class="airport-code">${arrival.id || 'N/A'}</div>
                <div class="airport-name">${arrival.name || 'N/A'}</div>
              </div>
            </div>
          </div>
          ${legroom ? `<div class="flight-features mt-2"><small class="text-muted"><i class="bi bi-rulers"></i> Legroom: ${legroom}</small></div>` : ''}
        </div>
      `;
      
      // Add layover info if not last flight
      if (idx < flights.length - 1 && layovers[idx]) {
        const layover = layovers[idx];
        const layoverDuration = layover.duration || 0;
        const layoverName = layover.name || '';
        const layoverId = layover.id || '';
        const layoverOvernight = layover.overnight || false;
        
        flightsHtml += `
          <div class="layover-info text-center my-3">
            <div class="layover-badge">
              <i class="bi bi-pause-circle"></i> 
              Layover: ${layoverName} (${layoverId}) - ${formatDuration(layoverDuration)}
              ${layoverOvernight ? '<span class="badge bg-warning ms-2">Overnight</span>' : ''}
            </div>
          </div>
        `;
      }
    });

    let carbonHtml = '';
    if (carbonEmissions.this_flight) {
      const emissionsKg = Math.round(carbonEmissions.this_flight / 1000);
      const difference = carbonEmissions.difference_percent || 0;
      let differenceClass = 'text-success';
      let differenceIcon = 'bi-arrow-down';
      if (difference > 0) {
        differenceClass = 'text-danger';
        differenceIcon = 'bi-arrow-up';
      } else if (difference === 0) {
        differenceClass = 'text-muted';
        differenceIcon = 'bi-dash';
      }
      
      carbonHtml = `
        <div class="carbon-emissions mt-2">
          <small class="text-muted">
            <i class="bi bi-cloud"></i> Carbon: ${emissionsKg} kg
            ${difference !== 0 ? `<span class="${differenceClass} ms-2">
              <i class="bi ${differenceIcon}"></i> ${Math.abs(difference)}% ${difference > 0 ? 'more' : 'less'} than typical
            </span>` : ''}
          </small>
        </div>
      `;
    }

    // Get primary airline for data attribute
    const primaryAirline = flights.length > 0 && flights[0].airline ? flights[0].airline : '';
    
    return `
      <div class="col-12">
        <div class="flight-card" data-airline="${primaryAirline}" data-price="${price}" data-duration="${totalDuration}" data-departure-time="${getDepartureTimeFromFlight(flightData)}">
          <div class="flight-card-header d-flex justify-content-between align-items-start mb-3">
            <div>
              <h5 class="mb-0">Flight Option ${index + 1}</h5>
              <small class="text-muted">Total Duration: ${formatDuration(totalDuration)}</small>
            </div>
            <div class="flight-price">
              ${formatPrice(price)}
            </div>
          </div>
          <div class="flight-details">
            ${flightsHtml}
            ${carbonHtml}
          </div>
          <!-- Select Flight button hidden -->
        </div>
      </div>
    `;
  }

  // Extract unique airlines from flight data
  function extractAirlines(flights) {
    const airlines = new Set();
    flights.forEach(flight => {
      if (flight.flights && flight.flights.length > 0) {
        flight.flights.forEach(f => {
          if (f.airline) {
            airlines.add(f.airline);
          }
        });
      }
    });
    return Array.from(airlines).sort();
  }

  // Get first departure time from flight (for sorting - alias)
  function getDepartureTime(flight) {
    return getDepartureTimeFromFlight(flight);
  }

  // Check if flight matches airline filter
  function matchesAirlineFilter(flight, selectedAirlines) {
    if (!selectedAirlines || selectedAirlines.length === 0) return true;
    
    if (flight.flights && flight.flights.length > 0) {
      return flight.flights.some(f => selectedAirlines.includes(f.airline));
    }
    return false;
  }

  // Sort flights
  function sortFlights(flights, sortBy) {
    if (!flights || flights.length === 0) return flights;
    
    const sorted = [...flights];
    
    switch(sortBy) {
      case 'price_low':
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price_high':
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'duration_short':
        sorted.sort((a, b) => (a.total_duration || 0) - (b.total_duration || 0));
        break;
      case 'duration_long':
        sorted.sort((a, b) => (b.total_duration || 0) - (a.total_duration || 0));
        break;
      case 'departure_early':
        sorted.sort((a, b) => getDepartureTime(a) - getDepartureTime(b));
        break;
      case 'departure_late':
        sorted.sort((a, b) => getDepartureTime(b) - getDepartureTime(a));
        break;
      default:
        // Keep original order
        break;
    }
    
    return sorted;
  }

  // Filter and sort flights
  function filterAndSortFlights() {
    if (!originalFlightData) return;
    
    const sortBy = document.getElementById('sort-by')?.value || 'default';
    const selectedAirlines = Array.from(document.querySelectorAll('.airline-checkbox:checked')).map(cb => cb.value);
    
    // Combine all flights
    let filteredFlights = [...allFlights];
    
    // Apply airline filter
    if (selectedAirlines.length > 0) {
      filteredFlights = filteredFlights.filter(flight => matchesAirlineFilter(flight, selectedAirlines));
    }
    
    // Apply sorting
    if (sortBy !== 'default') {
      filteredFlights = sortFlights(filteredFlights, sortBy);
    }
    
    // Display filtered/sorted results
    displayFilteredResults(filteredFlights);
  }

  // Display filtered results
  function displayFilteredResults(flights) {
    const bestFlightsContainer = document.getElementById('best-flights-container');
    const otherFlightsContainer = document.getElementById('other-flights-container');
    const bestFlightsSection = document.getElementById('best-flights-section');
    const otherFlightsSection = document.getElementById('other-flights-section');
    const noResults = document.getElementById('no-results');
    
    // Clear previous results
    bestFlightsContainer.innerHTML = '';
    otherFlightsContainer.innerHTML = '';
    
    if (flights.length === 0) {
      noResults.style.display = 'block';
      bestFlightsSection.style.display = 'none';
      otherFlightsSection.style.display = 'none';
      return;
    }
    
    noResults.style.display = 'none';
    
    // Display all flights in a single section
    bestFlightsContainer.innerHTML = '';
    flights.forEach((flight, index) => {
      bestFlightsContainer.innerHTML += createFlightCard(flight, index);
    });
    bestFlightsSection.style.display = 'block';
    
    // Update section title
    const sectionTitle = bestFlightsSection.querySelector('.section-subtitle');
    if (sectionTitle) {
      sectionTitle.textContent = `Flights (${flights.length} found)`;
    }
    
    otherFlightsSection.style.display = 'none';
    
    // Re-initialize AOS for new elements
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }

  // Create airline filter checkboxes
  function createAirlineFilters(airlines) {
    const container = document.getElementById('airline-filters');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (airlines.length === 0) {
      container.innerHTML = '<p class="text-muted small">No airlines found</p>';
      return;
    }
    
    airlines.forEach(airline => {
      const checkbox = document.createElement('div');
      checkbox.className = 'form-check';
      const airlineId = airline.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
      checkbox.innerHTML = `
        <input class="form-check-input airline-checkbox" type="checkbox" value="${airline}" id="airline-${airlineId}">
        <label class="form-check-label" for="airline-${airlineId}">
          ${airline}
        </label>
      `;
      container.appendChild(checkbox);
    });
    
    // Add event listeners
    document.querySelectorAll('.airline-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', filterAndSortFlights);
    });
  }

  // Display flight results
  function displayFlightResults(data) {
    const resultsSection = document.getElementById('flight-results');
    const bestFlightsSection = document.getElementById('best-flights-section');
    const otherFlightsSection = document.getElementById('other-flights-section');
    const bestFlightsContainer = document.getElementById('best-flights-container');
    const otherFlightsContainer = document.getElementById('other-flights-container');
    const noResults = document.getElementById('no-results');
    const priceInsights = document.getElementById('price-insights');
    const filtersSection = document.querySelector('.flight-filters-section');

    // Store original data
    originalFlightData = data;
    
    // Combine all flights for filtering/sorting
    allFlights = [];
    if (data.best_flights && data.best_flights.length > 0) {
      // Filter out flights with price 0
      const validBestFlights = data.best_flights.filter(flight => {
        const price = flight.price || 0;
        return price > 0;
      });
      allFlights.push(...validBestFlights);
    }
    if (data.other_flights && data.other_flights.length > 0) {
      // Filter out flights with price 0
      const validOtherFlights = data.other_flights.filter(flight => {
        const price = flight.price || 0;
        return price > 0;
      });
      allFlights.push(...validOtherFlights);
    }

    // Show results section
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Clear previous results
    bestFlightsContainer.innerHTML = '';
    otherFlightsContainer.innerHTML = '';

    // Display price insights
    if (data.price_insights) {
      const insights = data.price_insights;
      document.getElementById('lowest-price').textContent = formatPrice(insights.lowest_price);
      document.getElementById('price-level').textContent = insights.price_level || '-';
      
      if (insights.typical_price_range && insights.typical_price_range.length === 2) {
        document.getElementById('typical-range').textContent = 
          `${formatPrice(insights.typical_price_range[0])} - ${formatPrice(insights.typical_price_range[1])}`;
      }
      
      priceInsights.style.display = 'block';
    }

    // Show filters section and create airline filters
    if (allFlights.length > 0) {
      const airlines = extractAirlines(allFlights);
      createAirlineFilters(airlines);
      if (filtersSection) {
        filtersSection.style.display = 'block';
      }
      
      // Set up sort handler
      const sortSelect = document.getElementById('sort-by');
      if (sortSelect) {
        sortSelect.addEventListener('change', filterAndSortFlights);
      }
      
      // Display all flights initially
      displayFilteredResults(allFlights);
    } else {
      noResults.style.display = 'block';
      bestFlightsSection.style.display = 'none';
      otherFlightsSection.style.display = 'none';
      if (filtersSection) {
        filtersSection.style.display = 'none';
      }
    }

    // Re-initialize AOS for new elements
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }

  // Handle form submission
  function handleFormSubmission() {
    const flightForm = document.getElementById('flight-search-form');
    
    if (!flightForm) return;

    flightForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form elements
      const loading = flightForm.querySelector('.loading');
      const errorMessage = flightForm.querySelector('.error-message');
      const sentMessage = flightForm.querySelector('.sent-message');
      const submitBtn = flightForm.querySelector('button[type="submit"]');

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
      const formData = new FormData(flightForm);
      const tripType = formData.get('trip_type');
      
      // Get airport codes from hidden inputs
      const departureCode = formData.get('departure_id');
      const arrivalCode = formData.get('arrival_id');
      
      // Validate airport codes are selected
      if (!departureCode || !arrivalCode) {
        if (errorMessage) {
          errorMessage.textContent = 'Please select valid cities from the suggestions';
          errorMessage.classList.add('d-block');
        }
        if (loading) loading.classList.remove('d-block');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="bi bi-search me-2"></i>Search';
        }
        return;
      }
      
      // Build request data
      const requestData = {
        departure_id: departureCode.toUpperCase(),
        arrival_id: arrivalCode.toUpperCase(),
        outbound_date: formData.get('outbound_date'),
        adults: formData.get('adults') || '1',
        children: formData.get('children') || '0',
        travel_class: formData.get('travel_class') || '1',
        stops: formData.get('stops') || '0'
      };

      // Add return date if round trip
      if (tripType === 'round_trip') {
        const returnDate = formData.get('return_date');
        if (returnDate) {
          // Validate return date is after departure date
          const outboundDate = new Date(requestData.outbound_date);
          const returnDateObj = new Date(returnDate);
          if (returnDateObj > outboundDate) {
            requestData.return_date = returnDate;
          } else {
            // If return date is same or before, add 1 day
            outboundDate.setDate(outboundDate.getDate() + 1);
            requestData.return_date = outboundDate.toISOString().split('T')[0];
          }
        }
      }

      // Send AJAX request
      fetch('forms/flights-api.php', {
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
          throw new Error(data.message || 'Failed to search flights');
        }

        // Success - display results
        if (data.data) {
          displayFlightResults(data.data);
        } else {
          throw new Error('No data received from server');
        }
      })
      .catch(error => {
        // Error
        if (errorMessage) {
          errorMessage.textContent = error.message || 'Failed to search flights. Please try again later.';
          errorMessage.classList.add('d-block');
          errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        console.error('Flight search error:', error);
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

  // Load URL parameters and populate form
  function loadURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const fromCode = urlParams.get('from');
    const toCode = urlParams.get('to');
    const departure = urlParams.get('departure');
    const returnDate = urlParams.get('return');
    const adults = urlParams.get('adults');
    const children = urlParams.get('children');
    const tripType = urlParams.get('tripType') || urlParams.get('trip_type') || 'round_trip';
    const autoSearch = urlParams.get('autoSearch') === 'true';

    if (fromCode) {
      // Find airport by code and set city input
      const airport = (window.airportsData || airportsData).find(a => a.code === fromCode.toUpperCase());
      if (airport) {
        const fromInput = document.getElementById('departure_city');
        const fromCodeInput = document.getElementById('departure_id');
        if (fromInput && fromCodeInput) {
          fromInput.value = `${airport.city}, ${airport.country}`;
          fromCodeInput.value = airport.code;
          fromInput.classList.add('is-valid');
        }
      }
    }

    if (toCode) {
      const airport = (window.airportsData || airportsData).find(a => a.code === toCode.toUpperCase());
      if (airport) {
        const toInput = document.getElementById('arrival_city');
        const toCodeInput = document.getElementById('arrival_id');
        if (toInput && toCodeInput) {
          toInput.value = `${airport.city}, ${airport.country}`;
          toCodeInput.value = airport.code;
          toInput.classList.add('is-valid');
        }
      }
    }

    if (departure) {
      const departureInput = document.getElementById('outbound_date');
      if (departureInput) {
        departureInput.value = departure;
      }
    }

    // Set trip type
    const tripTypeRadio = document.querySelector(`input[name="trip_type"][value="${tripType}"]`);
    if (tripTypeRadio) {
      tripTypeRadio.checked = true;
      // Trigger change event to update return date visibility
      tripTypeRadio.dispatchEvent(new Event('change'));
    }

    if (returnDate && tripType === 'round_trip') {
      const returnInput = document.getElementById('return_date');
      const returnGroup = document.getElementById('return-date-group');
      if (returnInput) {
        returnInput.value = returnDate;
      }
      if (returnGroup) {
        returnGroup.style.display = 'block';
      }
    }

    if (adults) {
      const adultsSelect = document.getElementById('adults');
      if (adultsSelect) {
        adultsSelect.value = adults;
      }
    }

    if (children) {
      const childrenSelect = document.getElementById('children');
      if (childrenSelect) {
        childrenSelect.value = children;
      }
    }

    // Auto-trigger search if autoSearch flag is set
    if (autoSearch && fromCode && toCode && departure) {
      // Wait a bit for form to be fully populated, then trigger search
      setTimeout(function() {
        const flightForm = document.getElementById('flight-search-form');
        if (flightForm) {
          // Scroll to search form
          flightForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Create and dispatch submit event to trigger the form handler
          const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
          flightForm.dispatchEvent(submitEvent);
        }
      }, 500);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setMinDates();
      handleTripTypeChange();
      initializeCityAutocomplete();
      handleFormSubmission();
      // Load URL parameters after a short delay to ensure autocomplete is initialized
      setTimeout(loadURLParameters, 100);
    });
  } else {
    setMinDates();
    handleTripTypeChange();
    initializeCityAutocomplete();
    handleFormSubmission();
    setTimeout(loadURLParameters, 100);
  }

})();

