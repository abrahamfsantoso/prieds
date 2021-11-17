const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      unique: true,
    },
    middleName: {
      type: String,
      default: '',
    },
    lastName: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Other'],
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    homeAddress: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      max: 50,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      max: 50,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', CustomerSchema);
