import { Server } from 'socket.io';

let io = null;
let isInitialized = false;

export function initSocket(server) {
  if (!isInitialized && server) {
    console.log('Initializing Socket.io server');
    
    io = new Server(server, {
      path: '/api/socketio',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    // Attach io directly to the server for later use if needed
    server.io = io;
    isInitialized = true;

    io.on('connection', socket => {
      console.log('Client connected:', socket.id);
      
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }
  return io;
}

export function getIO() {
  return io;
}