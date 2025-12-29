<?php
/**
 * Google Flights API Handler
 * Handles requests to SerpAPI Google Flights endpoint
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
            <title>Flights API Handler</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; background: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                h1 { color: #333; }
                .info { background: #e3f2fd; padding: 15px; border-radius: 4px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Flights API Handler</h1>
                <div class="info">
                    <strong>Status:</strong> PHP handler is working correctly!<br><br>
                    This endpoint only accepts POST requests from the flights search form.
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
$departure_id = isset($data['departure_id']) ? trim($data['departure_id']) : '';
$arrival_id = isset($data['arrival_id']) ? trim($data['arrival_id']) : '';
$outbound_date = isset($data['outbound_date']) ? trim($data['outbound_date']) : '';

if (empty($departure_id) || empty($arrival_id) || empty($outbound_date)) {
    http_response_code(400);
    echo json_encode([
        'error' => true,
        'message' => 'Missing required fields: departure_id, arrival_id, and outbound_date are required.'
    ]);
    exit();
}

// SerpAPI Configuration
$api_key = '31336f28d9db59e04ec41126fec4c38488a67c85215e61a2fd4bd6d5c40cf3f4';

// Build API URL
$base_url = 'https://serpapi.com/search.json';
$params = [
    'engine' => 'google_flights',
    'api_key' => $api_key,
    'departure_id' => $departure_id,
    'arrival_id' => $arrival_id,
    'outbound_date' => $outbound_date,
    'currency' => 'INR', // As specified by user
    'hl' => 'en',
    'gl' => 'in' // India
];

// Optional parameters
if (!empty($data['return_date'])) {
    $params['return_date'] = trim($data['return_date']);
    $params['type'] = '1'; // Round trip
} else {
    $params['type'] = '2'; // One way
}

if (!empty($data['adults'])) {
    $params['adults'] = intval($data['adults']);
}

if (!empty($data['children'])) {
    $params['children'] = intval($data['children']);
}

if (!empty($data['infants_in_seat'])) {
    $params['infants_in_seat'] = intval($data['infants_in_seat']);
}

if (!empty($data['infants_on_lap'])) {
    $params['infants_on_lap'] = intval($data['infants_on_lap']);
}

if (!empty($data['travel_class'])) {
    $params['travel_class'] = intval($data['travel_class']);
}

if (!empty($data['stops'])) {
    $params['stops'] = intval($data['stops']);
}

if (!empty($data['sort_by'])) {
    $params['sort_by'] = intval($data['sort_by']);
}

if (isset($data['deep_search']) && $data['deep_search'] === true) {
    $params['deep_search'] = 'true';
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

