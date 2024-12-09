const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

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

// Mock API endpoint for spam terms
app.get('/api/spam-terms', (req, res) => {
    const mockSpamTerms = [
        "urgent",
        "lottery winner",
        "wire transfer",
        "bank details",
        "prize money",
        "inheritance",
        "Nigerian prince"
    ];
    res.json({ spamTerms: mockSpamTerms });
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
