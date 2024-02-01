// models/userSession.js
const mongoose = require('mongoose');

const AppConversationSchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'AppUser'
      },
    SessionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'AppSession'
      },
      Status: String,
      MetaData: Object,
      ChatSocketId: String
},  
{
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
    collection: "AppConversations",
});

AppConversationSchema.index(
    {
        UserId: 1,
        SessionId: 1
    },
    { unique: true }
  );

export const AppConversations = mongoose.model('AppConversations', AppConversationSchema);

