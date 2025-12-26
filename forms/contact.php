<?php

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { 
    // Allow GET requests only for testing - show info message
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        header('Content-Type: text/html; charset=UTF-8');
        die('
        <!DOCTYPE html>
        <html>
        <head>
            <title>Contact Form Handler</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; background: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                h1 { color: #333; }
                .info { background: #e3f2fd; padding: 15px; border-radius: 4px; margin: 20px 0; }
                .error { background: #ffebee; padding: 15px; border-radius: 4px; margin: 20px 0; color: #c62828; }
                code { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Contact Form Handler</h1>
                <div class="info">
                    <strong>Status:</strong> PHP handler is working correctly!<br><br>
                    This endpoint only accepts POST requests from the contact form.<br>
                    To test, please use the contact form on your website.
                </div>
                <div class="error">
                    <strong>Note:</strong> If you\'re seeing this on a static server (like Live Server on port 5500), 
                    PHP files won\'t execute. You need to use a PHP server like:
                    <ul>
                        <li>XAMPP / WAMP / MAMP</li>
                        <li>PHP built-in server: <code>php -S localhost:8000</code></li>
                        <li>Or deploy to a web server with PHP support</li>
                    </ul>
                </div>
            </div>
        </body>
        </html>
        ');
    }
    http_response_code(405);
    die('Method not allowed. Only POST requests are accepted.');
}

// Get form data
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validate required fields
if (empty($name) || empty($email) || empty($subject) || empty($phone) || empty($message)) {
    http_response_code(400);
    die('All fields are required');
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    die('Invalid email address');
}

// SMTP Configuration
$smtp_host = 'mail.rasmytrip.com';
$smtp_port = 587;
$smtp_username = 'support@rasmytrip.com';
$smtp_password = 'Rasmytrip@nov15';
$smtp_from_email = 'support@rasmytrip.com';
$smtp_from_name = 'RAS My Trip Contact Form';
$to_email = 'info@rasmytrip.com';

// Email subject
$email_subject = 'New Contact Form Submission: ' . $subject;

// Email body (plain text)
$email_body = "You have received a new message from the contact form on your website.\n\n";
$email_body .= "Name: " . $name . "\n";
$email_body .= "Email: " . $email . "\n";
$email_body .= "Phone: " . $phone . "\n";
$email_body .= "Subject: " . $subject . "\n\n";
$email_body .= "Message:\n" . $message . "\n";

// Send email using SMTP socket connection
$mail_sent = sendSMTPEmail($smtp_host, $smtp_port, $smtp_username, $smtp_password, 
                            $smtp_from_email, $smtp_from_name, $to_email, $email, $name, 
                            $email_subject, $email_body);

// Return response
if ($mail_sent) {
    echo 'OK';
} else {
    http_response_code(500);
    die('Failed to send email. Please try again later.');
}

/**
 * Send email using SMTP socket connection
 */
function sendSMTPEmail($host, $port, $username, $password, $from_email, $from_name, 
                      $to_email, $reply_email, $reply_name, $subject, $body) {
    
    // Create socket connection
    $socket = @fsockopen($host, $port, $errno, $errstr, 30);
    
    if (!$socket) {
        error_log("SMTP Connection failed: $errstr ($errno)");
        return false;
    }
    
    // Read server greeting
    $response = fgets($socket, 515);
    if (substr($response, 0, 3) != '220') {
        fclose($socket);
        return false;
    }
    
    // Send EHLO
    fputs($socket, "EHLO $host\r\n");
    $response = '';
    while ($line = fgets($socket, 515)) {
        $response .= $line;
        if (substr($line, 3, 1) == ' ') break;
    }
    
    // Start TLS if port is 587
    if ($port == 587) {
        fputs($socket, "STARTTLS\r\n");
        $response = fgets($socket, 515);
        if (substr($response, 0, 3) != '220') {
            fclose($socket);
            return false;
        }
        stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
        
        // Send EHLO again after TLS
        fputs($socket, "EHLO $host\r\n");
        $response = '';
        while ($line = fgets($socket, 515)) {
            $response .= $line;
            if (substr($line, 3, 1) == ' ') break;
        }
    }
    
    // Authenticate
    fputs($socket, "AUTH LOGIN\r\n");
    $response = fgets($socket, 515);
    if (substr($response, 0, 3) != '334') {
        fclose($socket);
        return false;
    }
    
    fputs($socket, base64_encode($username) . "\r\n");
    $response = fgets($socket, 515);
    if (substr($response, 0, 3) != '334') {
        fclose($socket);
        return false;
    }
    
    fputs($socket, base64_encode($password) . "\r\n");
    $response = fgets($socket, 515);
    if (substr($response, 0, 3) != '235') {
        fclose($socket);
        return false;
    }
    
    // Set sender
    fputs($socket, "MAIL FROM: <$from_email>\r\n");
    $response = fgets($socket, 515);
    if (substr($response, 0, 3) != '250') {
        fclose($socket);
        return false;
    }
    
    // Set recipient
    fputs($socket, "RCPT TO: <$to_email>\r\n");
    $response = fgets($socket, 515);
    if (substr($response, 0, 3) != '250') {
        fclose($socket);
        return false;
    }
    
    // Send data
    fputs($socket, "DATA\r\n");
    $response = fgets($socket, 515);
    if (substr($response, 0, 3) != '354') {
        fclose($socket);
        return false;
    }
    
    // Email headers and body
    $email_data = "From: $from_name <$from_email>\r\n";
    $email_data .= "To: <$to_email>\r\n";
    $email_data .= "Reply-To: $reply_name <$reply_email>\r\n";
    $email_data .= "Subject: $subject\r\n";
    $email_data .= "MIME-Version: 1.0\r\n";
    $email_data .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $email_data .= "\r\n";
    $email_data .= $body;
    $email_data .= "\r\n.\r\n";
    
    fputs($socket, $email_data);
    $response = fgets($socket, 515);
    if (substr($response, 0, 3) != '250') {
        fclose($socket);
        return false;
    }
    
    // Quit
    fputs($socket, "QUIT\r\n");
    fgets($socket, 515);
    fclose($socket);
    
    return true;
}
?> 