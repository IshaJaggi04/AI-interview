// models/userSession.js
const mongoose = require('mongoose');

const MessagesSchema = new mongoose.Schema({
  ConversationId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'AppConversations'
      },
  Content: String,
  Type: String, // User, Assistant, System
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
    collection: "AppMessages",
});

MessagesSchema.index(
    {
        ConversationId: 1,
        SessionId: 1,
        UserId: 1
    }
   
  );

export const Messages = mongoose.model('AppMessages', MessagesSchema);

