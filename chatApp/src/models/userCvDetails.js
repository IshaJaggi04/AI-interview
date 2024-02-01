// models/userSession.js
const mongoose = require('mongoose');

const UserCvDetailsSchema = new mongoose.Schema({
  SessionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'AppSession'
  },
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'AppUser'
  },
  Summary: {
    Name: String,
    Yrs_Experience: String,
    Skills: String
  },
  MetaData: Object
},  
{
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
    collection: "AppUserCvDetails",
});

UserCvDetailsSchema.index(
    {
        ConversationId: 1,
        SessionId: 1,
    },
    { unique: true }
  );

module.exports = mongoose.model('AppUserCvDetailsSchema', UserCvDetailsSchema);

