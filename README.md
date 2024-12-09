# Outlook Spam Term Highlighter Add-in

This Outlook add-in automatically highlights potential spam terms in emails using AI-powered detection.

## Features

- Scans email content for potential spam terms
- Highlights identified spam terms directly in the email
- Retrieves spam terms from an AI-powered API
- Real-time scanning and highlighting
- User-friendly interface

## Setup Instructions

1. Configure your development environment:
   ```bash
   npm install -g yo generator-office
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

3. Update the AI API endpoint in `src/index.js` to point to your spam detection service.

4. Start the development server:
   ```bash
   npm start
   ```

5. Sideload the add-in in Outlook:
   - Open Outlook
   - Go to Get Add-ins
   - Choose My Add-ins
   - Select Add Custom Add-in
   - Browse to the manifest.xml file

## Development

The add-in is built using:
- Office.js API for Outlook integration
- HTML/CSS/JavaScript for the frontend
- Your AI service API for spam term detection

## Configuration

Update the following files for customization:
- `manifest.xml`: Add-in metadata and permissions
- `src/index.js`: API endpoint and highlighting logic
- `src/styles.css`: Visual styling

## Security Note

Ensure your AI API endpoint is properly secured and uses HTTPS. Never expose sensitive API keys in the client-side code.
