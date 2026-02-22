
const https = require('https');

const endpoint = 'https://cloud.appwrite.io/v1/health';

console.log('Testing connection to Appwrite Health endpoint...');

https.get(endpoint, (res) => {
    console.log('Status Code:', res.statusCode);
    console.log('Headers:', res.headers);

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Response body:', data);
        if (res.statusCode === 200) {
            console.log('SUCCESS: Reachable!');
        } else {
            console.log('FAILED: Reached but returned error status.');
        }
    });
}).on('error', (err) => {
    console.error('ERROR: Could not reach Appwrite:', err.message);
});
