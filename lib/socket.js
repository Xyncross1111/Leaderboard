import { Server } from 'socket.io';

let io = null;
let isInitialized = false;

export function initSocket(server) {
  if (!isInitialized && server?.socket?.server) {
    console.log('Initializing Socket.io server');
    
    io = new Server(server.socket.server, {
      path: '/api/socketio',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    server.socket.server.io = io;
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

export function setIO(socketIO) {
  io = socketIO;
}

export function emitTeamUpdate(teams) {
  try {
    if (io) {
      console.log('Emitting team update');
      io.emit('teamsUpdate', teams);
    }
  } catch (error) {
    console.error('Error emitting team update:', error);
  }
} 