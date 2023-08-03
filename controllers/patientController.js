const express = require('express');
const patientService = require('../services/patientService')
const router = express.Router();

router.get('/patient', async (req, res) => {
    try {
        const { patientId } = req.query;
        
        // Try to get the patient data
        console.log("my access token is:" + process.env.ACCESS_TOKEN)
        const patientData = await patientService.getPatientData(patientId, process.env.ACCESS_TOKEN);
        res.json(patientData);
    } catch (error) {
        console.error('Failed to fetch patient data with current token, re-authorizing...', error);
        // Redirect to authorization endpoint if fetching patient data failed
        res.redirect(`/authorize?patientId=${req.query.patientId}`);
    }
});

module.exports = router;