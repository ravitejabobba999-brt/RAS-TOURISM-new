/**
 * Visa Details Page Functionality
 * Handles displaying visa information based on country selection
 */

(function() {
  'use strict';

  // Visa data for different countries
  const visaData = {
    'germany': {
      name: 'GERMANY',
      visas: [
        {
          type: 'TOURIST VISA',
          processingTime: 10,
          stayPeriod: 90,
          validity: 90,
          entry: 'Single Entry',
          fee: '₹14,000/-'
        },
        {
          type: 'BUSINESS VISA',
          processingTime: 12,
          stayPeriod: 90,
          validity: 90,
          entry: 'Single Entry',
          fee: '₹15,000/-'
        },
        {
          type: 'MULTIPLE ENTRY VISA',
          processingTime: 15,
          stayPeriod: 90,
          validity: 180,
          entry: 'Multiple Entry',
          fee: '₹18,000/-'
        }
      ],
      requiredDocuments: [
        'Valid passport with at least 3 months validity beyond return date',
        'Completed Schengen visa application form',
        'Two recent passport-size photographs',
        'Travel insurance (minimum €30,000 coverage)',
        'Return flight tickets',
        'Hotel booking confirmation',
        'Bank statements (last 3 months)',
        'Travel itinerary',
        'Cover letter explaining purpose of visit'
      ]
    },
    'brazil': {
      name: 'BRAZIL',
      visas: [
        {
          type: 'TOURIST VISA',
          processingTime: 15,
          stayPeriod: 90,
          validity: 90,
          entry: 'Single Entry',
          fee: '₹11,500/-'
        },
        {
          type: 'BUSINESS VISA',
          processingTime: 18,
          stayPeriod: 90,
          validity: 90,
          entry: 'Single Entry',
          fee: '₹12,500/-'
        },
        {
          type: 'MULTIPLE ENTRY VISA',
          processingTime: 20,
          stayPeriod: 90,
          validity: 180,
          entry: 'Multiple Entry',
          fee: '₹15,000/-'
        }
      ],
      requiredDocuments: [
        'Valid passport with at least 6 months validity',
        'Completed visa application form',
        'Two recent passport-size photographs',
        'Return flight tickets',
        'Hotel booking confirmation',
        'Bank statements (last 3 months)',
        'Travel insurance',
        'Yellow fever vaccination certificate'
      ]
    },
    'france': {
      name: 'FRANCE',
      visas: [
        {
          type: 'TOURIST VISA',
          processingTime: 10,
          stayPeriod: 90,
          validity: 90,
          entry: 'Single Entry',
          fee: '₹13,500/-'
        },
        {
          type: 'BUSINESS VISA',
          processingTime: 12,
          stayPeriod: 90,
          validity: 90,
          entry: 'Single Entry',
          fee: '₹14,500/-'
        }
      ],
      requiredDocuments: [
        'Valid passport with at least 3 months validity beyond return date',
        'Completed Schengen visa application form',
        'Two recent passport-size photographs',
        'Travel insurance (minimum €30,000 coverage)',
        'Return flight tickets',
        'Hotel booking confirmation',
        'Bank statements (last 3 months)',
        'Travel itinerary',
        'Cover letter explaining purpose of visit'
      ]
    },
    'united-states': {
      name: 'UNITED STATES',
      visas: [
        {
          type: 'TOURIST VISA',
          processingTime: 20,
          stayPeriod: 180,
          validity: 180,
          entry: 'Multiple Entry',
          fee: '₹21,000/-'
        },
        {
          type: 'BUSINESS VISA',
          processingTime: 25,
          stayPeriod: 180,
          validity: 180,
          entry: 'Multiple Entry',
          fee: '₹23,000/-'
        }
      ],
      requiredDocuments: [
        'Valid passport with at least 6 months validity',
        'Completed DS-160 visa application form',
        'One recent passport-size photograph (5cm x 5cm)',
        'Visa interview appointment confirmation',
        'Return flight tickets',
        'Hotel booking confirmation',
        'Bank statements (last 6 months)',
        'Travel itinerary',
        'Employment letter or business registration',
        'Travel insurance'
      ]
    },
    'united-kingdom': {
      name: 'UNITED KINGDOM',
      visas: [
        {
          type: 'TOURIST VISA',
          processingTime: 12,
          stayPeriod: 180,
          validity: 180,
          entry: 'Multiple Entry',
          fee: '₹16,000/-'
        },
        {
          type: 'BUSINESS VISA',
          processingTime: 15,
          stayPeriod: 180,
          validity: 180,
          entry: 'Multiple Entry',
          fee: '₹18,000/-'
        }
      ],
      requiredDocuments: [
        'Valid passport with at least 6 months validity',
        'Completed UK visa application form',
        'Two recent passport-size photographs',
        'Return flight tickets',
        'Hotel booking confirmation',
        'Bank statements (last 6 months)',
        'Travel itinerary',
        'Travel insurance',
        'Proof of employment or business registration',
        'Cover letter explaining purpose of visit'
      ]
    },
    'japan': {
      name: 'JAPAN',
      visas: [
        {
          type: 'TOURIST VISA',
          processingTime: 8,
          stayPeriod: 90,
          validity: 90,
          entry: 'Single Entry',
          fee: '₹12,000/-'
        },
        {
          type: 'BUSINESS VISA',
          processingTime: 10,
          stayPeriod: 90,
          validity: 90,
          entry: 'Single Entry',
          fee: '₹13,000/-'
        }
      ],
      requiredDocuments: [
        'Valid passport with at least 6 months validity',
        'Completed visa application form',
        'Two recent passport-size photographs (4.5cm x 4.5cm)',
        'Return flight tickets',
        'Hotel booking confirmation',
        'Bank statements (last 3 months)',
        'Travel itinerary',
        'Travel insurance',
        'Proof of employment or business registration'
      ]
    },
    'thailand': {
      name: 'THAILAND',
      visas: [
        {
          type: 'TOURIST VISA',
          processingTime: 5,
          stayPeriod: 60,
          validity: 60,
          entry: 'Single Entry',
          fee: '₹6,500/-'
        },
        {
          type: 'MULTIPLE ENTRY VISA',
          processingTime: 7,
          stayPeriod: 60,
          validity: 180,
          entry: 'Multiple Entry',
          fee: '₹9,000/-'
        }
      ],
      requiredDocuments: [
        'Valid passport with at least 6 months validity',
        'Completed visa application form',
        'Two recent passport-size photographs',
        'Return flight tickets',
        'Hotel booking confirmation',
        'Bank statements (last 3 months)',
        'Travel insurance',
        'Proof of sufficient funds (THB 20,000 per person)'
      ]
    },
    'egypt': {
      name: 'EGYPT',
      visas: [
        {
          type: 'TOURIST VISA',
          processingTime: 7,
          stayPeriod: 30,
          validity: 30,
          entry: 'Single Entry',
          fee: '₹8,000/-'
        }
      ],
      requiredDocuments: [
        'Valid passport with at least 6 months validity',
        'Completed visa application form',
        'Two recent passport-size photographs',
        'Return flight tickets',
        'Hotel booking confirmation',
        'Bank statements (last 3 months)',
        'Travel insurance',
        'Travel itinerary'
      ]
    },
    'hungary': {
      name: 'HUNGARY',
      visas: [
        {
          type: 'TOURIST VISA',
          processingTime: 10,
          stayPeriod: 90,
          validity: 90,
          entry: 'Single Entry',
          fee: '₹12,500/-'
        }
      ],
      requiredDocuments: [
        'Valid passport with at least 3 months validity beyond return date',
        'Completed Schengen visa application form',
        'Two recent passport-size photographs',
        'Travel insurance (minimum €30,000 coverage)',
        'Return flight tickets',
        'Hotel booking confirmation',
        'Bank statements (last 3 months)',
        'Travel itinerary',
        'Cover letter explaining purpose of visit'
      ]
    },
    'india': {
      name: 'INDIA',
      visas: [
        {
          type: 'TOURIST VISA',
          processingTime: 5,
          stayPeriod: 90,
          validity: 90,
          entry: 'Single Entry',
          fee: '₹7,000/-'
        },
        {
          type: 'MULTIPLE ENTRY VISA',
          processingTime: 7,
          stayPeriod: 90,
          validity: 180,
          entry: 'Multiple Entry',
          fee: '₹10,000/-'
        }
      ],
      requiredDocuments: [
        'Valid passport with at least 6 months validity',
        'Completed visa application form',
        'Two recent passport-size photographs',
        'Proof of accommodation',
        'Travel itinerary',
        'Bank statements (last 3 months)',
        'Travel insurance'
      ]
    },
    'maldives': {
      name: 'MALDIVES',
      visas: [
        {
          type: 'TOURIST VISA',
          processingTime: 3,
          stayPeriod: 30,
          validity: 30,
          entry: 'Single Entry',
          fee: '₹5,500/-'
        },
        {
          type: 'EXTENDED TOURIST VISA',
          processingTime: 5,
          stayPeriod: 90,
          validity: 90,
          entry: 'Single Entry',
          fee: '₹7,500/-'
        }
      ],
      requiredDocuments: [
        'Valid passport with at least 6 months validity',
        'Return flight tickets',
        'Hotel booking confirmation',
        'Proof of sufficient funds (USD 100 per day)',
        'Completed arrival card',
        'Yellow fever vaccination certificate (if applicable)'
      ]
    },
    'malaysia': {
      name: 'MALAYSIA',
      visas: [
        {
          type: 'TOURIST VISA',
          processingTime: 5,
          stayPeriod: 30,
          validity: 30,
          entry: 'Single Entry',
          fee: '₹6,000/-'
        },
        {
          type: 'MULTIPLE ENTRY VISA',
          processingTime: 7,
          stayPeriod: 30,
          validity: 90,
          entry: 'Multiple Entry',
          fee: '₹8,500/-'
        }
      ],
      requiredDocuments: [
        'Valid passport with at least 6 months validity',
        'Completed visa application form',
        'Two recent passport-size photographs',
        'Return flight tickets',
        'Hotel booking confirmation',
        'Bank statements (last 3 months)',
        'Travel insurance'
      ]
    },
    'bali': {
      name: 'BALI (INDONESIA)',
      visas: [
        {
          type: 'TOURIST VISA',
          processingTime: 4,
          stayPeriod: 30,
          validity: 30,
          entry: 'Single Entry',
          fee: '₹6,500/-'
        },
        {
          type: 'VISA ON ARRIVAL',
          processingTime: 0,
          stayPeriod: 30,
          validity: 30,
          entry: 'Single Entry',
          fee: 'USD 35 (Payable on arrival)'
        }
      ],
      requiredDocuments: [
        'Valid passport with at least 6 months validity',
        'Return flight tickets',
        'Hotel booking confirmation',
        'Proof of sufficient funds',
        'Completed arrival card',
        'Yellow fever vaccination certificate (if applicable)',
        'Travel insurance'
      ]
    },
    'singapore': {
      name: 'SINGAPORE',
      visas: [
        {
          type: 'TOURIST VISA',
          processingTime: 5,
          stayPeriod: 30,
          validity: 30,
          entry: 'Single Entry',
          fee: '₹6,000/-'
        },
        {
          type: 'MULTIPLE ENTRY VISA',
          processingTime: 7,
          stayPeriod: 30,
          validity: 90,
          entry: 'Multiple Entry',
          fee: '₹9,000/-'
        }
      ],
      requiredDocuments: [
        'Valid passport with at least 6 months validity',
        'Completed visa application form (Form 14A)',
        'Two recent passport-size photographs',
        'Return flight tickets',
        'Hotel booking confirmation',
        'Bank statements (last 3 months)',
        'Travel itinerary',
        'Travel insurance'
      ]
    },
    'vietnam': {
      name: 'VIETNAM',
      visas: [
        {
          type: 'TOURIST VISA',
          processingTime: 5,
          stayPeriod: 30,
          validity: 30,
          entry: 'Single Entry',
          fee: '₹7,000/-'
        },
        {
          type: 'MULTIPLE ENTRY VISA',
          processingTime: 7,
          stayPeriod: 30,
          validity: 90,
          entry: 'Multiple Entry',
          fee: '₹10,500/-'
        }
      ],
      requiredDocuments: [
        'Valid passport with at least 6 months validity',
        'Completed visa application form',
        'Two recent passport-size photographs',
        'Visa approval letter (for e-visa)',
        'Return flight tickets',
        'Hotel booking confirmation',
        'Bank statements (last 3 months)'
      ]
    },
    'bangkok': {
      name: 'BANGKOK (THAILAND)',
      visas: [
        {
          type: 'TOURIST VISA',
          processingTime: 5,
          stayPeriod: 60,
          validity: 60,
          entry: 'Single Entry',
          fee: '₹6,500/-'
        },
        {
          type: 'MULTIPLE ENTRY VISA',
          processingTime: 7,
          stayPeriod: 60,
          validity: 180,
          entry: 'Multiple Entry',
          fee: '₹9,000/-'
        }
      ],
      requiredDocuments: [
        'Valid passport with at least 6 months validity',
        'Completed visa application form',
        'Two recent passport-size photographs',
        'Return flight tickets',
        'Hotel booking confirmation',
        'Bank statements (last 3 months)',
        'Travel insurance',
        'Proof of sufficient funds (THB 20,000 per person)'
      ]
    },
    'dubai': {
      name: 'DUBAI (UAE)',
      visas: [
        {
          type: 'TOURIST VISA',
          processingTime: 4,
          stayPeriod: 30,
          validity: 30,
          entry: 'Single Entry',
          fee: '₹8,000/-'
        },
        {
          type: 'MULTIPLE ENTRY VISA',
          processingTime: 6,
          stayPeriod: 30,
          validity: 90,
          entry: 'Multiple Entry',
          fee: '₹12,000/-'
        },
        {
          type: '96 HOURS TRANSIT VISA',
          processingTime: 2,
          stayPeriod: 4,
          validity: 4,
          entry: 'Single Entry',
          fee: '₹5,500/-'
        }
      ],
      requiredDocuments: [
        'Valid passport with at least 6 months validity',
        'Completed visa application form',
        'Two recent passport-size photographs (white background)',
        'Return flight tickets',
        'Hotel booking confirmation',
        'Bank statements (last 3 months)',
        'Travel insurance',
        'Copy of confirmed flight tickets'
      ]
    },
    'rome': {
      name: 'ROME (ITALY)',
      visas: [
        {
          type: 'TOURIST VISA',
          processingTime: 10,
          stayPeriod: 90,
          validity: 90,
          entry: 'Single Entry',
          fee: '₹14,000/-'
        },
        {
          type: 'MULTIPLE ENTRY VISA',
          processingTime: 15,
          stayPeriod: 90,
          validity: 180,
          entry: 'Multiple Entry',
          fee: '₹18,000/-'
        }
      ],
      requiredDocuments: [
        'Valid passport with at least 3 months validity beyond return date',
        'Completed Schengen visa application form',
        'Two recent passport-size photographs',
        'Travel insurance (minimum €30,000 coverage)',
        'Return flight tickets',
        'Hotel booking confirmation',
        'Bank statements (last 3 months)',
        'Travel itinerary',
        'Cover letter explaining purpose of visit'
      ]
    }
  };

  /**
   * Get country from URL parameters
   */
  function getCountryFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const country = urlParams.get('country');
    return country ? country.toLowerCase() : 'germany'; // Default to Germany
  }

  /**
   * Get country name from data attribute
   */
  function getCountryFromDataAttribute() {
    const urlParams = new URLSearchParams(window.location.search);
    const country = urlParams.get('country');
    if (!country) {
      // Try to get from hash
      const hash = window.location.hash.substring(1);
      return hash || 'germany';
    }
    return country.toLowerCase();
  }

  /**
   * Create visa card HTML
   */
  function createVisaCard(visa, index, countryData) {
    const isActive = index === 0 ? 'active' : '';
    const cardId = `visa-card-${index}`;
    const documentsId = `required-documents-${index}`;
    const hasDocuments = countryData.requiredDocuments && countryData.requiredDocuments.length > 0;
    
    let documentsHTML = '';
    if (hasDocuments) {
      documentsHTML = `
        <div class="required-documents-section" id="${documentsId}" style="display: none;">
          <h4 class="documents-title">Required Documents:</h4>
          <ul class="documents-list">
            ${countryData.requiredDocuments.map(doc => `<li>${doc}</li>`).join('')}
          </ul>
        </div>
      `;
    }
    
    return `
      <div class="visa-card ${isActive}" id="${cardId}" data-aos="fade-up" data-aos-delay="${index * 100}">
        <div class="visa-card-header ${isActive}">
          <h3>${visa.type}</h3>
        </div>
        <div class="visa-card-body">
          <div class="visa-detail-row">
            <span class="visa-label">Processing time:</span>
            <span class="visa-value">${visa.processingTime} days</span>
          </div>
          <div class="visa-detail-row">
            <span class="visa-label">Stay period:</span>
            <span class="visa-value">${visa.stayPeriod} days</span>
          </div>
          <div class="visa-detail-row">
            <span class="visa-label">Validity:</span>
            <span class="visa-value">${visa.validity} days</span>
          </div>
          <div class="visa-detail-row">
            <span class="visa-label">Entry:</span>
            <span class="visa-value">${visa.entry}</span>
          </div>
          <div class="visa-detail-row visa-fee-row">
            <span class="visa-label">Visa Fee:</span>
            <span class="visa-value visa-fee">${visa.fee}</span>
          </div>
          ${documentsHTML}
          ${hasDocuments ? `<div class="visa-card-footer">
            <button class="btn-required-documents" type="button" data-target="${documentsId}">
              <i class="bi bi-file-earmark-text"></i> Required Documents
            </button>
          </div>` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Display visa information for selected country
   */
  function displayVisaDetails() {
    const country = getCountryFromURL();
    console.log('Selected country from URL:', country); // Debug log
    
    const countryData = visaData[country];
    console.log('Country data found:', countryData ? 'Yes' : 'No'); // Debug log

    if (!countryData) {
      console.warn(`No visa data found for country: ${country}. Defaulting to Germany.`);
      // If country not found, default to Germany
      const defaultData = visaData['germany'];
      if (defaultData) {
        renderVisaDetails('germany', defaultData);
      } else {
        console.error('Default visa data (Germany) not found!');
      }
      return;
    }

    renderVisaDetails(country, countryData);
  }

  /**
   * Render visa details on the page
   */
  function renderVisaDetails(country, countryData) {
    console.log('Rendering visa details for:', country, countryData); // Debug log
    
    // Update page title
    const pageTitle = document.getElementById('page-country-title');
    const countryNameDisplay = document.getElementById('country-name-display');
    const breadcrumbCountry = document.getElementById('breadcrumb-country');
    const visaDetailsTitle = document.getElementById('visa-details-title');

    if (pageTitle) {
      pageTitle.textContent = `${countryData.name} Visa Details`;
    } else {
      console.warn('page-country-title element not found');
    }

    if (countryNameDisplay) {
      countryNameDisplay.textContent = countryData.name;
    } else {
      console.warn('country-name-display element not found');
    }

    if (breadcrumbCountry) {
      breadcrumbCountry.textContent = countryData.name;
    } else {
      console.warn('breadcrumb-country element not found');
    }

    // Render visa cards
    const cardsContainer = document.getElementById('visa-cards-container');
    if (!cardsContainer) {
      console.error('visa-cards-container element not found!');
      return;
    }
    
    if (!countryData.visas || countryData.visas.length === 0) {
      console.warn('No visa data available for country:', country);
      cardsContainer.innerHTML = '<p>No visa information available for this country.</p>';
      return;
    }
    
    if (cardsContainer && countryData.visas) {
      cardsContainer.innerHTML = countryData.visas
        .map((visa, index) => createVisaCard(visa, index, countryData))
        .join('');

      // Add click handlers for Required Documents buttons
      const requiredDocButtons = cardsContainer.querySelectorAll('.btn-required-documents');
      requiredDocButtons.forEach(button => {
        button.addEventListener('click', function(e) {
          e.stopPropagation(); // Prevent card click event
          const targetId = this.getAttribute('data-target');
          const documentsSection = document.getElementById(targetId);
          
          if (documentsSection) {
            const isVisible = documentsSection.style.display !== 'none';
            
            // Toggle visibility
            if (isVisible) {
              documentsSection.style.display = 'none';
              this.innerHTML = '<i class="bi bi-file-earmark-text"></i> Required Documents';
              this.classList.remove('active');
            } else {
              documentsSection.style.display = 'block';
              this.innerHTML = '<i class="bi bi-chevron-up"></i> Hide Documents';
              this.classList.add('active');
              
              // Smooth scroll to documents section
              setTimeout(() => {
                documentsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }, 100);
            }
          }
        });
      });

      // Add click handlers for visa cards to toggle active state
      const visaCards = cardsContainer.querySelectorAll('.visa-card');
      visaCards.forEach(card => {
        card.addEventListener('click', function(e) {
          // Don't toggle if clicking buttons or documents section
          if (e.target.closest('.btn-required-documents') ||
              e.target.closest('.required-documents-section')) {
            return;
          }
          
          // Remove active from all cards
          visaCards.forEach(c => {
            c.classList.remove('active');
            c.querySelector('.visa-card-header').classList.remove('active');
          });
          
          // Add active to clicked card
          this.classList.add('active');
          this.querySelector('.visa-card-header').classList.add('active');
        });
      });
    }
  }

  // Initialize when DOM is ready
  function initializeVisaDetails() {
    // Wait a bit to ensure all elements are loaded
    const cardsContainer = document.getElementById('visa-cards-container');
    if (!cardsContainer) {
      console.warn('visa-cards-container not found, retrying...');
      setTimeout(initializeVisaDetails, 100);
      return;
    }
    displayVisaDetails();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(initializeVisaDetails, 50);
    });
  } else {
    setTimeout(initializeVisaDetails, 50);
  }

})();

