const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const port = 3000;

// Enable CORS for Office Add-in
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Serve static files from the src directory
app.use(express.static('src'));
app.use(express.json());

// Cloudmersive API configuration
const CLOUDMERSIVE_API_KEY = process.env.CLOUDMERSIVE_API_KEY || 'YOUR_API_KEY';
const cloudmersiveClient = axios.create({
    baseURL: 'https://api.cloudmersive.com/virus/scan/text',
    headers: {
        'Apikey': CLOUDMERSIVE_API_KEY,
        'Content-Type': 'application/json'
    }
});

// API endpoint for spam detection
app.post('/api/analyze-text', async (req, res) => {
    try {
        const { text } = req.body;
        
        const response = await cloudmersiveClient.post('/spam/check/text', {
            TextToScan: text
        });

        // Extract spam terms and confidence scores
        const spamAnalysis = response.data;
        const isSpam = spamAnalysis.IsSpam;
        const spamConfidenceScore = spamAnalysis.SpamConfidenceScore;
        
        // Return analysis results
        res.json({
            isSpam,
            spamConfidenceScore,
            analysis: spamAnalysis
        });
    } catch (error) {
        console.error('Error analyzing text:', error);
        res.status(500).json({ 
            error: 'Error analyzing text',
            details: error.message 
        });
    }
});

// Serve the manifest file
app.get('/manifest.xml', (req, res) => {
    res.sendFile(path.join(__dirname, 'manifest.xml'));
});

// Test page route
app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'test.html'));
});

const options = {
    key: fs.readFileSync(path.join(process.env.USERPROFILE, '.office-addin-dev-certs', 'localhost.key')),
    cert: fs.readFileSync(path.join(process.env.USERPROFILE, '.office-addin-dev-certs', 'localhost.crt'))
};

https.createServer(options, app).listen(port, () => {
    console.log(`Server running at https://localhost:${port}`);
    console.log(`Test page available at https://localhost:${port}/test`);
});
