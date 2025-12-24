# Local Testing Guide

## The Issue

If you're seeing a **405 Method Not Allowed** error when testing on `http://127.0.0.1:5500`, it's because:

**Live Server (port 5500) is a static file server** - it only serves HTML, CSS, and JavaScript files. It **cannot execute PHP files**.

## Solutions

### Option 1: Use PHP Built-in Server (Recommended for Quick Testing)

1. Open your terminal/command prompt
2. Navigate to your project folder:
   ```bash
   cd C:\Users\jaideep\OneDrive\Desktop\Projects\RAS-TOURISM-new
   ```
3. Start PHP server:
   ```bash
   php -S localhost:8000
   ```
4. Open your browser and go to:
   ```
   http://localhost:8000/contact.html
   ```

### Option 2: Use XAMPP / WAMP / MAMP

1. **Download and install XAMPP** (or WAMP for Windows, MAMP for Mac)
   - Download: https://www.apachefriends.org/
2. **Start Apache** from XAMPP Control Panel
3. **Copy your project** to `C:\xampp\htdocs\RAS-TOURISM-new\` (or your XAMPP htdocs folder)
4. **Access your site** at:
   ```
   http://localhost/RAS-TOURISM-new/contact.html
   ```

### Option 3: Use VS Code PHP Server Extension

1. Install **PHP Server** extension in VS Code
2. Right-click on `contact.html`
3. Select **"PHP Server: serve project"**
4. It will open in your browser automatically

## Testing the Contact Form

Once you have PHP running:

1. Open `contact.html` in your browser (via PHP server)
2. Fill out the form:
   - Name
   - Email
   - Subject
   - Message
3. Click "Send Message"
4. You should see a success message
5. Check `info@rasmytrip.com` inbox for the email

## Troubleshooting

### Still Getting 405 Error?

- Make sure you're accessing the site through a PHP server (not Live Server)
- Check browser console for JavaScript errors
- Verify the form has `action="forms/contact.php"` and `method="post"`

### Email Not Sending?

- Check PHP error logs
- Verify SMTP credentials in `forms/contact.php`
- Ensure your server allows outbound SMTP connections on port 587
- Check if firewall is blocking the connection

### Need Help?

Check `forms/EMAIL_SETUP.md` for email configuration details.

