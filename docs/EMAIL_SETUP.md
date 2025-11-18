# Email Service Setup

This document describes how to configure and use the email service in the Eventos application.

## SMTP Configuration

The email service uses the SMTP server configuration from `MAIL_SERVER.md`:

- **Server**: webmail.ac.gov.br
- **Port**: 587
- **Encryption**: STARTTLS (secure: false)
- **Authentication**: Username and password

## Environment Variables

Add the following variables to your `server/.env` file:

```env
# SMTP Configuration
SMTP_HOST=webmail.ac.gov.br
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@ac.gov.br
SMTP_PASS=your-password
SMTP_FROM=your-email@ac.gov.br  # Optional, defaults to SMTP_USER
```

### Variable Descriptions

- `SMTP_HOST`: SMTP server address
- `SMTP_PORT`: SMTP server port (587 for STARTTLS)
- `SMTP_SECURE`: Set to `false` for STARTTLS on port 587, `true` for SSL on port 465
- `SMTP_USER`: Your email username for authentication
- `SMTP_PASS`: Your email password
- `SMTP_FROM`: (Optional) The "from" email address. Defaults to `SMTP_USER` if not provided

## API Endpoint

### Send Email

**POST** `/api/email/send`

#### Request Body

```json
{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "text": "Plain text content",
  "html": "<p>HTML content</p>",
  "cc": ["cc1@example.com", "cc2@example.com"],  // Optional
  "bcc": ["bcc@example.com"],  // Optional
  "attachments": [  // Optional
    {
      "filename": "document.pdf",
      "content": "base64-encoded-content",
      "contentType": "application/pdf"
    }
  ]
}
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

**Error (400/500)**
```json
{
  "error": "Error message"
}
```

#### Example with cURL

```bash
curl -X POST http://localhost:4000/api/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "Test Email",
    "text": "This is a test email",
    "html": "<p>This is a <strong>test</strong> email</p>"
  }'
```

## Architecture

The email service follows Clean Architecture principles:

### Domain Layer
- `Email` entity and `EmailEntity` class
- `IMailClient` interface (repository pattern)
- `ISmtpConfig` interface

### Application Layer
- `SendEmailUseCase` - Business logic for sending emails

### Infrastructure Layer
- `SmtpMailClient` - Nodemailer implementation of `IMailClient`

### Presentation Layer
- `EmailController` - HTTP controller
- `/api/email/send` route

## Features

- ✅ Single or multiple recipients (to, cc, bcc)
- ✅ Plain text and/or HTML content
- ✅ Email attachments support
- ✅ Email validation
- ✅ Error handling
- ✅ STARTTLS encryption support
- ✅ Clean Architecture implementation

## Testing

You can test the email service using:

1. **Thunder Client** (VS Code extension) - Included in dev container
2. **cURL** - Command line tool
3. **Postman** - API testing tool

## Troubleshooting

### Connection Issues

- Verify SMTP credentials are correct
- Check firewall settings for port 587
- Ensure STARTTLS is supported by your network

### Authentication Errors

- Verify `SMTP_USER` and `SMTP_PASS` are correct
- Check if your email account requires app-specific passwords

### Email Not Received

- Check spam/junk folder
- Verify recipient email address is correct
- Check server logs for error messages

## Security Notes

⚠️ **Important**:
- Never commit `.env` files with real credentials
- Use environment variables for all sensitive data
- Consider using app-specific passwords instead of main account passwords
- In production, use secure credential management systems

