# Outlook Spam Term Highlighter Add-in

A proprietary Outlook add-in that automatically identifies and highlights potential spam terms in emails using AI-powered detection. This tool helps users quickly identify suspicious content in their emails by highlighting common spam phrases and terms.

## Features

- 🔍 Real-time scanning of email content
- ✨ Automatic highlighting of suspicious terms
- 🤖 AI-powered spam term detection
- 🎨 Visual highlighting of identified terms
- 📊 Summary display of found spam terms
- 🔄 Easy-to-use interface integrated into Outlook

## Prerequisites

- Microsoft Outlook (Desktop or Office 365)
- Node.js (v14 or higher)
- npm (comes with Node.js)
- SSL certificates for development (automatically set up during installation)
- Valid license key for production use

## Installation

Please contact your system administrator or sales representative for installation instructions and license key.

## Development Setup

### Local Development Server
The project includes a local development server that:
- Serves the add-in files
- Provides a mock API for spam term detection
- Includes SSL certification for secure development

### Testing
1. Use the test page at https://localhost:3000/test to verify:
   - API functionality
   - Spam term detection
   - Highlighting features

2. The mock API (/api/spam-terms) includes common spam terms like:
   - "urgent"
   - "lottery winner"
   - "wire transfer"
   - And more...

### File Structure
```
outlook-spam-highlighter/
├── src/
│   ├── index.html      # Main add-in interface
│   ├── index.js        # Core functionality
│   ├── styles.css      # Add-in styling
│   └── test.html       # Test interface
├── manifest.xml        # Add-in manifest
├── server.js          # Development server
├── package.json       # Project dependencies
└── README.md          # Documentation
```

## Security Notes

- The add-in uses HTTPS for all communications
- API endpoints must be properly secured in production
- Never expose sensitive API keys in client-side code
- SSL certificates are required for development and production
- License validation is required for production deployment

## Production Deployment

For production deployment:
1. Obtain necessary license keys
2. Replace the mock API with your production AI service
3. Update the API endpoint in `src/index.js`
4. Ensure proper SSL certification
5. Deploy to a secure hosting service

## Support

For support, please contact:
- Technical Support: [Contact Information]
- License Management: [Contact Information]
- Sales Inquiries: [Contact Information]

## Legal Notice

 2024 Robert Van Arsdale. All Rights Reserved.

This software is proprietary and confidential. Unauthorized copying, transferring, or reproduction of the contents of this software, via any medium, is strictly prohibited.

The receipt or possession of this software and associated documentation does not convey or imply any rights to reproduce, disclose, or distribute its contents, or to manufacture, use, or sell anything that it may describe, in whole or in part.
