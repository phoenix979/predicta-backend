const crypto = require('crypto');

function generateCodeVerifier() {
    return crypto.randomBytes(64).toString('hex');
}

function generateCodeChallenge(codeVerifier) {
    return crypto.createHash('sha256').update(codeVerifier).digest('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

module.exports = {
  generateCodeVerifier,
  generateCodeChallenge
};