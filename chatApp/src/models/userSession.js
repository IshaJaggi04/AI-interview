// models/userSession.js
const mongoose = require('mongoose');

const userSessionSchema = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'AppUser'
  },
  Status: String
},
{
  timestamps: true,
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
  collection: "AppUserSession",
});

export const AppUserSession =  mongoose.model('AppUserSession', userSessionSchema);

