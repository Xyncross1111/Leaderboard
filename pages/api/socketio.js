import { Server } from 'socket.io';

const ioHandler = async (req, res) => {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.io');
    const io = new Server(res.socket.server, {
      path: '/api/socketio',
      addTrailingSlash: false,
      transports: ['polling'],
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      },
      pingTimeout: 10000,
      pingInterval: 5000
    });

    io.on('connection', socket => {
      console.log('Client connected:', socket.id);
      
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
};

export const config = {
  api: {
    bodyParser: false
  }
};

export default ioHandler; 