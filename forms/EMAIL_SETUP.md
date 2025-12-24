# Email Setup Instructions

## Contact Form Email Configuration

The contact form (`forms/contact.php`) is configured to send emails to **info@rasmytrip.com** using SMTP.

### Current Configuration:
- **SMTP Server**: mail.rasmytrip.com
- **Port**: 587
- **Username**: support@rasmytrip.com
- **Password**: Rasmytrip@nov15
- **To Email**: info@rasmytrip.com
- **From Email**: support@rasmytrip.com

### How It Works:

1. The form in `contact.html` submits to `forms/contact.php`
2. The PHP script validates the form data
3. It attempts to send email using:
   - **PHPMailer** (if installed - recommended)
   - **Custom SMTP socket** (fallback if PHPMailer not available)

### Optional: Install PHPMailer (Recommended)

For better reliability and features, you can install PHPMailer:

1. Download PHPMailer from: https://github.com/PHPMailer/PHPMailer
2. Extract to: `assets/vendor/phpmailer/phpmailer/`
3. The script will automatically use PHPMailer if found

Or using Composer:
```bash
composer require phpmailer/phpmailer
```

### Testing:

1. Fill out the contact form on your website
2. Click "Send Message"
3. Check info@rasmytrip.com inbox for the email
4. The form will show a success message if email is sent

### Troubleshooting:

- Check PHP error logs if emails are not sending
- Verify SMTP credentials are correct
- Ensure port 587 is not blocked by firewall
- Check that PHP has `openssl` extension enabled (for TLS/SSL)

### Security Note:

The SMTP password is stored in plain text in the PHP file. For production, consider:
- Using environment variables
- Storing credentials in a secure config file outside web root
- Using .htaccess to protect the forms directory

