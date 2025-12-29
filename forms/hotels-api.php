<?php
/**
 * Google Hotels API Handler
 * Handles requests to SerpAPI Google Hotels endpoint
 */

// Allow CORS if needed (for local development)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests for API calls
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        header('Content-Type: text/html; charset=UTF-8');
        die('
        <!DOCTYPE html>
        <html>
        <head>
            <title>Hotels API Handler</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; background: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                h1 { color: #333; }
                .info { background: #e3f2fd; padding: 15px; border-radius: 4px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Hotels API Handler</h1>
                <div class="info">
                    <strong>Status:</strong> PHP handler is working correctly!<br><br>
                    This endpoint only accepts POST requests from the hotels search form.
                </div>
            </div>
        </body>
        </html>
        ');
    }
    http_response_code(405);
    die('Method not allowed. Only POST requests are accepted.');
}

// Get JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// If JSON decode failed, try POST data
if (!$data) {
    $data = $_POST;
}

// Validate required fields
$q = isset($data['q']) ? trim($data['q']) : '';
$check_in_date = isset($data['check_in_date']) ? trim($data['check_in_date']) : '';
$check_out_date = isset($data['check_out_date']) ? trim($data['check_out_date']) : '';

if (empty($q) || empty($check_in_date) || empty($check_out_date)) {
    http_response_code(400);
    echo json_encode([
        'error' => true,
        'message' => 'Missing required fields: q (location/hotel name), check_in_date, and check_out_date are required.'
    ]);
    exit();
}

// SerpAPI Configuration
$api_key = '31336f28d9db59e04ec41126fec4c38488a67c85215e61a2fd4bd6d5c40cf3f4';

// Build API URL
$base_url = 'https://serpapi.com/search.json';
$params = [
    'engine' => 'google_hotels',
    'api_key' => $api_key,
    'q' => $q,
    'check_in_date' => $check_in_date,
    'check_out_date' => $check_out_date,
    'currency' => 'INR', // As specified by user
    'hl' => 'en',
    'gl' => 'in' // India
];

// Optional parameters
if (!empty($data['adults'])) {
    $params['adults'] = intval($data['adults']);
} else {
    $params['adults'] = 2; // Default
}

if (!empty($data['children'])) {
    $params['children'] = intval($data['children']);
}

if (!empty($data['children_ages'])) {
    $params['children_ages'] = trim($data['children_ages']);
}

if (!empty($data['sort_by'])) {
    $params['sort_by'] = intval($data['sort_by']);
}

if (!empty($data['min_price'])) {
    $params['min_price'] = intval($data['min_price']);
}

if (!empty($data['max_price'])) {
    $params['max_price'] = intval($data['max_price']);
}

if (!empty($data['property_types'])) {
    $params['property_types'] = trim($data['property_types']);
}

if (!empty($data['amenities'])) {
    $params['amenities'] = trim($data['amenities']);
}

if (!empty($data['rating'])) {
    $params['rating'] = intval($data['rating']);
}

if (!empty($data['hotel_class'])) {
    $params['hotel_class'] = trim($data['hotel_class']);
}

if (isset($data['free_cancellation']) && $data['free_cancellation'] === true) {
    $params['free_cancellation'] = 'true';
}

if (isset($data['special_offers']) && $data['special_offers'] === true) {
    $params['special_offers'] = 'true';
}

if (isset($data['eco_certified']) && $data['eco_certified'] === true) {
    $params['eco_certified'] = 'true';
}

if (isset($data['vacation_rentals']) && $data['vacation_rentals'] === true) {
    $params['vacation_rentals'] = 'true';
}

if (!empty($data['bedrooms'])) {
    $params['bedrooms'] = intval($data['bedrooms']);
}

if (!empty($data['bathrooms'])) {
    $params['bathrooms'] = intval($data['bathrooms']);
}

// Build query string
$query_string = http_build_query($params);
$api_url = $base_url . '?' . $query_string;

// Initialize cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $api_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

// Execute request
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);
curl_close($ch);

// Handle cURL errors
if ($curl_error) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'API request failed: ' . $curl_error
    ]);
    exit();
}

// Handle HTTP errors
if ($http_code !== 200) {
    http_response_code($http_code);
    $error_data = json_decode($response, true);
    echo json_encode([
        'error' => true,
        'message' => isset($error_data['error']) ? $error_data['error'] : 'API request failed with HTTP code ' . $http_code,
        'http_code' => $http_code
    ]);
    exit();
}

// Parse response
$result = json_decode($response, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Invalid JSON response from API'
    ]);
    exit();
}

// Check for API errors in response
if (isset($result['error'])) {
    http_response_code(400);
    echo json_encode([
        'error' => true,
        'message' => $result['error']
    ]);
    exit();
}

// Return successful response
header('Content-Type: application/json');
echo json_encode([
    'error' => false,
    'data' => $result
]);
?>

