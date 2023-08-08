const express = require('express');
const axios = require('axios');
const qs = require('querystring');
const router = express.Router();
const authService = require('../services/authService')

router.get('/authorize', async (req, res) => {
    try {
        const { patientId } = req.query;
    
        // generate a PKCE code challenge and verifier
        const codeVerifier = authService.generateCodeVerifier();
        const codeChallenge = authService.generateCodeChallenge(codeVerifier);
    
        req.session.codeVerifier = codeVerifier; // Save the code verifier in session
    
        // retrieve the smart-configuration
        const config = await axios.get(`${process.env.BASE_URL}/.well-known/smart-configuration`);
    
        // then redirect to the authorization endpoint with the necessary parameters
        const authorizationUrl = `${config.data.authorization_endpoint}?` +
          `response_type=code&` +
          `client_id=${process.env.CLIENT_ID}&` +
          `redirect_uri=${process.env.REDIRECT_URI}&` +
          `scope=patient/Patient.read%20patient/Observation.read&` +
          `aud=${process.env.BASE_URL}&` +
          `state=${patientId}&` + // Save patientId in the state parameter
          `code_challenge=${codeChallenge}&` +
          `code_challenge_method=S256`;
    
        res.redirect(authorizationUrl);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
});

router.get('/callback', async (req, res) => {
    try {
        const { code, state } = req.query;
    
        const config = await axios.get(`${process.env.BASE_URL}/.well-known/smart-configuration`);
    
        const tokenData = {
          grant_type: 'authorization_code',
          code,
          redirect_uri: process.env.REDIRECT_URI,
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code_verifier: req.session.codeVerifier, // Retrieve the code verifier from session
        };
    
        const response = await axios.post(config.data.token_endpoint, qs.stringify(tokenData), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
    
        // store access token
        req.session.access_token = response.data.access_token;
    
        // Redirect back to the patient endpoint with the patientId
        res.redirect(`/patient?patientId=${state}`);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
});

module.exports = router;