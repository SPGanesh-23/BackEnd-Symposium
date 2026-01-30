// registrationSchema.js
const mongoose = require('mongoose');

// registrationSchema.js
const registrationSchema = new mongoose.Schema({
  id: {                   
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  eventName: { type: String, required: true },
  participantsName: { 
    type: [String], 
    required: true,
    minlength: 1,
    maxlength: 6 
  },
  participantsEmail: { 
    type: [String], 
    required: true,
    minlength: 1,
    maxlength: 6 
  },
  mobile: { type: String, required: true },
  college: { type: String, required: true },
  course: { type: String, required: true },
  city: { type: String, required: true },
  veg: { type: String, required: true },
  nonveg: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);