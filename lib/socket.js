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
  if (!io) {
    console.log('Warning: Socket.io not initialized');
    return null;
  }
  return io;
}

export function emitTeamUpdate(teams) {
  try {
    const currentIO = getIO();
    if (currentIO) {
      console.log('Emitting team update to', currentIO.sockets.sockets.size, 'clients');
      currentIO.emit('teamsUpdate', teams);
    } else {
      console.log('No socket connection available for team update');
    }
  } catch (error) {
    console.error('Error emitting team update:', error);
  }
} 