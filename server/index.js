require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const sessionController = require('./auth/controllers/sessionController');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/healthfit', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Auth routes
const authRoutes = require('./auth/routes/auth');
app.use('/api/auth', authRoutes);

// Session routes
const sessionRoutes = require('./auth/routes/session');
app.use('/api/session', sessionRoutes);

let sensorData = {
  temp: null,
  stressLevel: null,
  heartRate: null,
  spo2: null,
  lastSource: null,
  prediction: null,
  alert: null
};

// Endpoint for ESP32 to POST sensor data
app.post('/api/sensor', async (req, res) => {
  // Accept both { stress } and { stressLevel }
  const temp = typeof req.body.temp === 'number' ? req.body.temp
    : typeof req.body.temperature === 'number' ? req.body.temperature
    : sensorData.temp;
  const stressLevel = typeof req.body.stressLevel === 'number' ? req.body.stressLevel
    : typeof req.body.stress === 'number' ? req.body.stress
    : sensorData.stressLevel;
  const heartRate = typeof req.body.heartRate === 'number' ? req.body.heartRate
    : sensorData.heartRate;
  const spo2 = typeof req.body.spo2 === 'number' ? req.body.spo2
    : sensorData.spo2;
  const prediction = typeof req.body.prediction === 'string' ? req.body.prediction
    : sensorData.prediction;
  const alert = typeof req.body.alert === 'string' ? req.body.alert
    : sensorData.alert;

  // Only update if at least one value is present
  if (
    temp !== null ||
    stressLevel !== null ||
    heartRate !== null ||
    spo2 !== null ||
    prediction !== null ||
    alert !== null
  ) {
    sensorData = {
      temp,
      stressLevel,
      heartRate,
      spo2,
      lastSource: 'esp32',
      prediction,
      alert
    };

    // Store sensor data in DB for authenticated users
    // Expect JWT token in Authorization header and sessionId in body
    const sessionId = req.body.sessionId;
    const authHeader = req.headers.authorization;
    if (sessionId && authHeader) {
      // Compose sensorData object for DB
      const sensorDataForDb = {
        temp,
        stressLevel,
        heartRate,
        spo2,
        prediction,
        alert,
        timestamp: new Date()
      };
      // Call sessionController.storeSensorData
      req.body.sensorData = sensorDataForDb;
      try {
        await sessionController.storeSensorData(req, res);
        return; // Response handled by controller
      } catch (err) {
        return res.status(500).json({ error: 'Failed to store sensor data in DB' });
      }
    }

    return res.json({ success: true });
  }
  res.status(400).json({ error: 'Invalid data' });
});

// Add endpoint for ESP32 to POST temperature only
app.post('/api/temperature', (req, res) => {
  console.log('Received temperature POST:', req.body); // Debug log
  // Accept both { temperature } and { temp }
  const temp = typeof req.body.temp === 'number' ? req.body.temp
    : typeof req.body.temperature === 'number' ? req.body.temperature
    : null;
  if (typeof temp === 'number') {
    sensorData.temp = temp;
    sensorData.lastSource = 'esp32'; // Mark source
    console.log('Temperature updated:', temp); // Add this log
    return res.json({ success: true });
  }
  res.status(400).json({ error: 'Invalid temperature data' });
});

// Accept POST to /api/sensors for ESP32 compatibility
app.post('/api/sensors', (req, res) => {
  const { temp, stressLevel, heartRate, spo2, temperature, prediction, alert } = req.body;
  // Accept both { temp } and { temperature }
  const t = typeof temp === 'number' ? temp
    : typeof temperature === 'number' ? temperature
    : null;
  if (
    typeof t === 'number' &&
    typeof stressLevel === 'number' &&
    typeof heartRate === 'number' &&
    typeof spo2 === 'number'
  ) {
    sensorData = {
      temp: t,
      stressLevel,
      heartRate,
      spo2,
      lastSource: 'esp32',
      prediction: prediction ?? null,
      alert: alert ?? null
    };
    return res.json({ success: true });
  }
  res.status(400).json({ error: 'Invalid data' });
});

// Add GET endpoint for temperature only
app.get('/api/temperature', (req, res) => {
  res.json({ temp: sensorData.temp });
});

// Endpoint for client to GET sensor data
app.get('/api/sensor', (req, res) => {
  // Always return the latest stored sensorData including lastSource
  // Remove destructuring so all fields are sent
  console.log('GET /api/sensor response:', sensorData); // Log response to terminal
  res.json(sensorData);
});

app.get('/', (req, res) => {
  res.send('Hello World from Express server!');
});

// Gemini AI chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  const { message, instructions } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not set' });
  if (!message) return res.status(400).json({ error: 'Message required' });

  try {
    // Use Gemini 2.0 Flash model endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const prompt = instructions ? `${instructions}\n${message}` : message;
    const payload = {
      contents: [
        { parts: [{ text: prompt }] }
      ]
    };
    const response = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
    // Parse Gemini response
    const aiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    res.json({ reply: aiText });
  } catch (err) {
    res.status(500).json({ error: err.message || 'AI request failed' });
  }
});

// ESP32 should POST sensor data to /api/sensor
// Client app GETs sensor data from /api/sensor

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
