const SessionData = require('../models/SessionData');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret'; // Use env var in production

// Middleware to get userId from JWT
function getUserId(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
  } catch {
    return null;
  }
}

// Start a session (on login)
exports.startSession = async (req, res) => {
  console.log('startSession called:', req.body); // Log request body
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    // Create a new session document
    const session = new SessionData({ userId, loginTime: new Date(), data: [] });
    await session.save();
    console.log('SessionData saved:', session); // Log saved session
    req.sessionId = session._id;
    res.json({ success: true, sessionId: session._id });
  } catch (err) {
    console.error('Error saving SessionData:', err); // Log error
    res.status(500).json({ error: 'Failed to start session' });
  }
};

// Store sensor data for the session
exports.storeSensorData = async (req, res) => {
  console.log('storeSensorData called:', req.body); // Log request body
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { sessionId, sensorData } = req.body;
  if (!sessionId || !sensorData) return res.status(400).json({ error: 'sessionId and sensorData required' });
  try {
    const session = await SessionData.findOne({ _id: sessionId, userId });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    // Add timestamp if not present
    if (!sensorData.timestamp) sensorData.timestamp = new Date();
    session.data.push(sensorData);
    await session.save();
    console.log('Sensor data stored:', sensorData); // Log stored data
    res.json({ success: true });
  } catch (err) {
    console.error('Error storing sensor data:', err); // Log error
    res.status(500).json({ error: 'Failed to store sensor data' });
  }
};

// End session (on logout)
exports.endSession = async (req, res) => {
  console.log('endSession called:', req.body); // Log request body
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
  try {
    const session = await SessionData.findOne({ _id: sessionId, userId });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    session.logoutTime = new Date();
    await session.save();
    console.log('Session ended:', session); // Log ended session
    res.json({ success: true });
  } catch (err) {
    console.error('Error ending session:', err); // Log error
    res.status(500).json({ error: 'Failed to end session' });
  }
};
