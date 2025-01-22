import { initSocket } from '../../lib/socket';

const ioHandler = async (req, res) => {
  try {
    // Initialize socket.io if it hasn't been initialized yet
    const io = initSocket(res);
    
    if (io) {
      console.log('Socket.io initialized successfully');
    } else {
      console.log('Socket.io already initialized');
    }
    
    res.end();
  } catch (error) {
    console.error('Error initializing socket:', error);
    res.status(500).end();
  }
};

export const config = {
  api: {
    bodyParser: false
  }
};

export default ioHandler; 