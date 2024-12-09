const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { logger, apiLogger } = require('./src/utils/logger');

const app = express();
const port = 3000;

// Enable CORS for Office Add-in
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Add API logging middleware
app.use(apiLogger);

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
    const startTime = Date.now();
    try {
        const { text } = req.body;
        
        logger.info('Analyzing text for spam', {
            textLength: text.length,
            timestamp: new Date().toISOString()
        });

        const response = await cloudmersiveClient.post('/spam/check/text', {
            TextToScan: text
        });

        // Extract spam terms and confidence scores
        const spamAnalysis = response.data;
        const isSpam = spamAnalysis.IsSpam;
        const spamConfidenceScore = spamAnalysis.SpamConfidenceScore;
        
        const duration = Date.now() - startTime;
        
        logger.info('Spam analysis complete', {
            isSpam,
            spamConfidenceScore,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString()
        });

        // Return analysis results
        res.json({
            isSpam,
            spamConfidenceScore,
            analysis: spamAnalysis
        });
    } catch (error) {
        const duration = Date.now() - startTime;
        
        logger.error('Error analyzing text', {
            error: error.message,
            stack: error.stack,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString()
        });

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
    logger.info(`Server started`, {
        port,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
    console.log(`Server running at https://localhost:${port}`);
    console.log(`Test page available at https://localhost:${port}/test`);
});
