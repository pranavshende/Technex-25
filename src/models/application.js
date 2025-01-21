// models/application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  farmerContact: { type: String, required: true },
  fieldSize: { type: Number, required: true },
  cropType: { type: String, required: true },
  additionalInfo: { type: String },
  farmeraddress : { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  farmerId : { type: Number, required: true },
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
