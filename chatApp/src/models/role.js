// models/userSession.js
const mongoose = require('mongoose');

const AppInterviewRoleSchema = new mongoose.Schema({
  RoleName: String,
  Prompt: Object,
  IntroMessage: String,
  TuningParams: Object,
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
    collection: "AppInterviewRole",
});

AppInterviewRoleSchema.index(
    {
        RoleName: 1,
        // SessionId: 1,
    },
    { unique: true }
  );

module.exports = mongoose.model('AppInterviewRole', AppInterviewRoleSchema);

