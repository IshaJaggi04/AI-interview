// models/userSession.js
const mongoose = require('mongoose');

const AppUserSchema = new mongoose.Schema({
  UserName: String,
  Password: String,
  RoleId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'AppInterviewRole'
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
    collection: "AppUser",
});

AppUserSchema.index(
    {
        UserName: 1,
        Password: 1,
        RoleId: 1
    },
    { unique: true }
  );

export const AppUser = mongoose.model('AppUser', AppUserSchema);

