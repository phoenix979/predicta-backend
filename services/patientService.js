const axios = require('axios');
const mondayService = require('./mondayService');

async function getPatientData(patientId, token) {
    try {
        // Retrieve the patient data
        const patientResponse = await axios.get(`${process.env.BASE_URL}/Patient/${patientId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
    
        // Retrieve the patient's observations
        const observationResponse = await axios.get(`${process.env.BASE_URL}/Observation?patient=${patientId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
    
        // Merge both sets of data into one object
        const data = {
          patient: patientResponse.data,
          observations: observationResponse.data,
        };
    
        try {
        await mondayService.sendToMonday(data)
        } catch(e) {
          console.log(e)
        }
    
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
}

module.exports = {
  getPatientData
};