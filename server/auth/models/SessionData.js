const mongoose = require('mongoose');

const SessionDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  loginTime: { type: Date, required: true },
  logoutTime: { type: Date },
  data: [{ type: Object }], // Array of JSON objects (sensor data)
});

module.exports = mongoose.model('SessionData', SessionDataSchema);
