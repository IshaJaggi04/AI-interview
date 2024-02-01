import mongoose from "mongoose";
import { getChatSocketId } from "../lib/sockets/audioToTextSocket";
import { AppConversations } from "../models/conversations";
import { AppUser } from "../models/user";
import { AppUserSession } from "../models/userSession";



export const createUserSessionService = async (userId, sessionId) => { 

    if(AppUserSession.find({UserId: userId, _id: sessionId}).Status !== 'Active'){
      let session =  await AppUserSession.insertMany({
            UserId: userId,
            Status: 'Active',
            // ConversationId: conversation._id
        });
        sessionId = session[0]._id;
    }

    let conversationModel = new AppConversations({
        UserId: userId,
        SessionId: sessionId ,
          Status: 'Active',
          ChatSocketId: chatSocketId});
    let conversation = await conversationModel.save();
    console.log(conversation)

    const chatSocketId = getChatSocketId({userId, 
        sessionId: sessionId ,
        conversationId: conversation._id
        });
        console.log({  chatSocketId,
            sessionId ,
            userId,
            conversationId: conversation._id})
    return {
        chatSocketId,
        sessionId ,
        userId,
        conversationId: conversation._id
    }
}

export const getUserRole = async (userId) => {
    return AppUser.findOne({_id: userId}).populate('RoleId').then(({UserName, RoleId}) => ({UserName, Role: RoleId}))
}