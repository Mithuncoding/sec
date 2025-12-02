const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for demo
    methods: ["GET", "POST"]
  }
});

// Store last 50 messages
let messageHistory = [];
let activeUsers = 0;

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  activeUsers++;
  io.emit('activeUsers', activeUsers);

  // Send history to new user
  socket.emit('history', messageHistory);

  socket.on('join', (role) => {
    console.log(`${role} joined`);
  });

  socket.on('sendMessage', (data) => {
    // Add to history
    messageHistory.push(data);
    if (messageHistory.length > 50) {
      messageHistory.shift();
    }
    
    // Broadcast to all
    io.emit('message', data);
  });

  socket.on('typing', (data) => {
    socket.broadcast.emit('userTyping', { user: socket.id, isTyping: data.isTyping });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    activeUsers--;
    io.emit('activeUsers', activeUsers);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
