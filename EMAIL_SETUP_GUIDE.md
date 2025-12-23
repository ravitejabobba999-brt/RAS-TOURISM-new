# Email Setup Guide for Contact Form

This guide explains how to set up email delivery for the contact form using PHP with SMTP.

## PHP with SMTP Setup

### Prerequisites
- PHP server (Apache/Nginx with PHP)
- Gmail account with App Password enabled

### Setup Steps

1. **Create PHP Backend File**
   - Create a PHP file (e.g., `forms/contact.php`) to handle email sending
   - Configure SMTP settings in the PHP file

2. **Configure SMTP (Gmail)**
   - In your PHP file, configure the SMTP settings:
   ```php
   $smtp_host = 'smtp.gmail.com';
   $smtp_port = 587;
   $smtp_username = 'rasgroupofcompany17@gmail.com';
   $smtp_password = 'your-app-password'; // Gmail App Password
   ```

3. **Gmail App Password Setup**
   - Go to your Google Account settings
   - Enable 2-Step Verification
   - Go to "App Passwords"
   - Generate a new app password for "Mail"
   - Use this app password in the PHP file (not your regular Gmail password)

4. **Update Contact Form**
   - Update the form in `contact.html` to use PHP:
   ```html
   <form action="forms/contact.php" method="post" class="php-email-form">
   ```

5. **Alternative: Use PHPMailer**
   - For better reliability, consider using PHPMailer library
   - Install via Composer: `composer require phpmailer/phpmailer`

### SMTP Settings for Common Providers

**Gmail:**
- Host: `smtp.gmail.com`
- Port: `587` (TLS) or `465` (SSL)
- Username: Your Gmail address
- Password: App Password (not regular password)

**Outlook/Hotmail:**
- Host: `smtp-mail.outlook.com`
- Port: `587`
- Username: Your Outlook email
- Password: Your Outlook password

**Custom SMTP:**
- Contact your hosting provider for SMTP settings

---

## Troubleshooting

### PHP Issues:
- **405 Method Not Allowed**: Check server PHP configuration
- **Emails not sending**: Check SMTP credentials, enable error reporting
- **SMTP errors**: Verify app password for Gmail, check firewall settings
- **Connection refused**: Check if server allows outbound SMTP connections

---

## Security Notes

- **PHP**: Never commit SMTP passwords to version control
- **Gmail App Passwords**: More secure than regular passwords
- **Environment Variables**: Consider using environment variables for credentials
- **HTTPS**: Use HTTPS for secure form submission

---

## Support

For PHP email issues: Check server error logs and PHP configuration
For PHPMailer: https://github.com/PHPMailer/PHPMailer
