import { Messages } from "../models/messages"

export const saveChat = (userId, sessionId, conversationId, chatHistory) => {
    Message

}


export const saveMessage = async ({userId, sessionId, conversationId, message, role}) => {
    await Messages.insertMany({
        UserId: userId,
        SessionId: sessionId, 
        ConversationId: conversationId,
        Type: role,
        Content: message
    })
}
