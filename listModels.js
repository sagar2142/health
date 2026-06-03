const axios = require('axios');

async function listModels() {
  try {
    const response = await axios.get('GET https://generativelanguage.googleapis.com/v1/models?key=GEMINI_API_KEY');
    console.log('Available models:', response.data);
  } catch (error) {
    console.error('Error listing models:', error.response?.data || error.message);
  }
}

listModels();
