// generateSecretKey.js
const fs = require('fs');
const crypto = require('crypto');

// Generate a random string of 32 bytes (256 bits)
const secretKey = crypto.randomBytes(32).toString('hex');

// Write the secret key to a .env file
fs.writeFileSync('./.env', `JWT_SECRET_KEY=${secretKey}`);

console.log('Secret key generated and saved to .env file.');
