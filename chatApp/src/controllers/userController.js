import { AppConversations } from "../models/conversations";
import { AppUserSession } from "../models/userSession";
import { createUserSessionService } from "../services/userService";



export const createUserSession = async (userId, sessionId) => { 
    return createUserSessionService(userId, sessionId)
}

