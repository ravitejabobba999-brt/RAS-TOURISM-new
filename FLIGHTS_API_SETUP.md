# Flights API Setup Guide

## Overview
This component integrates with SerpAPI's Google Flights API to search and display flight information.

## Setup Instructions

### 1. Get Your SerpAPI Key

1. Sign up for a SerpAPI account at [https://serpapi.com/](https://serpapi.com/)
2. Navigate to your dashboard and copy your API key
3. Open `forms/flights-api.php`
4. Find this line (around line 50):
   ```php
   $api_key = 'YOUR_SERPAPI_KEY_HERE';
   ```
5. Replace `YOUR_SERPAPI_KEY_HERE` with your actual API key:
   ```php
   $api_key = 'your-actual-api-key-here';
   ```

### 2. Test the Integration

1. Make sure you're running the site on a PHP server (XAMPP, WAMP, or PHP built-in server)
2. Navigate to `flights.html` in your browser
3. Fill in the search form:
   - **From**: Enter departure airport code (e.g., DEL, BOM, JFK)
   - **To**: Enter arrival airport code (e.g., LHR, CDG, JFK)
   - **Departure Date**: Select a future date
   - **Return Date**: Select a date after departure (for round trip)
   - **Passengers**: Select number of adults, children
   - **Class**: Select travel class (Economy, Premium, Business, First)
   - **Stops**: Select preferred number of stops
4. Click "Search Flights"
5. Results should display below the search form

## API Parameters

The component supports the following parameters:

### Required Parameters
- `departure_id`: 3-letter airport code (IATA) - e.g., "DEL", "BOM", "JFK"
- `arrival_id`: 3-letter airport code (IATA) - e.g., "LHR", "CDG", "JFK"
- `outbound_date`: Date in YYYY-MM-DD format

### Optional Parameters
- `return_date`: Date in YYYY-MM-DD format (for round trip)
- `adults`: Number of adults (default: 1)
- `children`: Number of children (default: 0)
- `travel_class`: 1=Economy, 2=Premium Economy, 3=Business, 4=First
- `stops`: 0=Any, 1=Nonstop, 2=1 stop or fewer, 3=2 stops or fewer
- `deep_search`: Set to true for more accurate results (slower)

## What's Displayed

The component displays:
- **Price Insights**: Lowest price, price level, typical price range
- **Best Flights**: Top recommended flights
- **More Flights**: Additional flight options
- **Flight Details**: 
  - Airline name and logo
  - Flight numbers
  - Departure and arrival times
  - Airport codes and names
  - Flight duration
  - Layover information
  - Carbon emissions
  - Total price in INR

## Files Created

1. **forms/flights-api.php**: PHP backend that handles API calls to SerpAPI
2. **flights.html**: Frontend page with search form and results display
3. **assets/js/flights.js**: JavaScript for form handling and results display
4. **assets/css/main.css**: Added flight card styles (at the end of the file)

## Customization

### To customize what fields are shown/hidden:

1. **In flights.html**: Modify the form to add/remove input fields
2. **In forms/flights-api.php**: Add/remove parameters in the `$params` array
3. **In assets/js/flights.js**: 
   - Modify `createFlightCard()` function to change displayed fields
   - Modify `displayFlightResults()` to show/hide sections

### Example: Hide Carbon Emissions

In `assets/js/flights.js`, find the `createFlightCard()` function and comment out or remove the `carbonHtml` section.

### Example: Add More Filters

1. Add form fields in `flights.html`
2. Add parameter handling in `forms/flights-api.php`
3. Update the request data in `assets/js/flights.js`

## Troubleshooting

### API Key Not Working
- Verify your API key is correct in `forms/flights-api.php`
- Check your SerpAPI account for API usage limits
- Ensure you have credits/queries available

### No Results Displayed
- Check browser console for JavaScript errors
- Verify airport codes are correct (3-letter IATA codes)
- Ensure dates are in the future
- Check PHP error logs for API errors

### CORS Errors
- Make sure you're accessing the site through a PHP server, not file://
- The PHP file includes CORS headers for development

### Results Not Loading
- Check network tab in browser DevTools
- Verify the API response in `forms/flights-api.php` (you can add `error_log()` statements)
- Ensure PHP cURL extension is enabled

## API Documentation

For full API documentation, visit:
[https://serpapi.com/google-flights-api](https://serpapi.com/google-flights-api)

## Support

If you encounter issues:
1. Check SerpAPI dashboard for API status
2. Review PHP error logs
3. Check browser console for JavaScript errors
4. Verify all files are in the correct locations

