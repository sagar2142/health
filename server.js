const express = require('express');
const app = express();
app.use(express.json());

let sensorData = {
    temp: null,
    stressLevel: null,
    heartRate: null,
    spo2: null
};

app.post('/api/sensor', (req, res) => {
    // Accept both { temperature } and { temp }
    const temp = typeof req.body.temp === 'number' ? req.body.temp
        : typeof req.body.temperature === 'number' ? req.body.temperature
        : undefined;
    if (temp !== undefined) {
        sensorData.temp = temp;
    }
    if (req.body.stressLevel !== undefined) sensorData.stressLevel = req.body.stressLevel;
    if (req.body.heartRate !== undefined) sensorData.heartRate = req.body.heartRate;
    if (req.body.spo2 !== undefined) sensorData.spo2 = req.body.spo2;
    res.status(200).send({ message: 'Sensor data received' });
});

app.get('/api/sensor', (req, res) => {
    res.json(sensorData);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});