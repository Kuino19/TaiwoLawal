const https = require('https');

const endpoints = [
    'https://fra.cloud.appwrite.io/v1/health/time',
    'https://cloud.appwrite.io/v1/health/time',
    'https://google.com'
];

endpoints.forEach(url => {
    const req = https.get(url, (res) => {
        console.log(`${url}: Status ${res.statusCode}`);
        res.resume();
    }).on('error', (e) => {
        console.error(`${url}: Error - ${e.message}`);
    });
});
