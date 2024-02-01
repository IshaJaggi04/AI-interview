// sockets/chatSocket.js



import { createUserSession } from '../../controllers/userController';
import  connectToAudioSocket from './audioToTextSocket';

export const initializeChatSocket = (io) => {
  



  io.on('connection', (socket) => {
    // @shubham bring from mongo
    
  
    connectToAudioSocket(io,socket)

    // @shubham move to api 
    socket.on('login', (data) => {
      const { userId, username } = data;
      // const userSession = new UserSession({
      //   userId,
      //   username,
      //   socketId: socket.id,
      // });
    });

    socket.on('create', async ({userId, sessionId}) => {

      let session= await createUserSession(userId, sessionId)
      socket.join(session.chatSocketId);
      io.to(session.chatSocketId).emit('sessionInitialised', session)
      // You can implement chatbot logic here and send a response back
      // Example: socket.emit('message', 'Chatbot response: ...');
    });

    socket.on('message', (data) => {
      console.log(`Message from ${socket.id}: ${data}`);
      // You can implement chatbot logic here and send a response back
      // Example: socket.emit('message', 'Chatbot response: ...');
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);

      // UserSession.findOneAndRemove({ socketId: socket.id }, (err, userSession) => {
      //   if (err) {
      //     console.error('Error removing user session:', err);
      //   } else if (userSession) {
      //     console.log(`User ${userSession.username} disconnected`);
      //   }
      // });
    });

  });
}


