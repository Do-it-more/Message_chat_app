const express = require('express');
const app = express();
const PORT = 5002;

const http = require('http').Server(app);
const cors = require('cors');
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000", 
    },
});

app.use(cors());

let users = {};

socketIO.on('connection', (socket) => {
    console.log(`${socket.id} connected!`);

    // Register user with socket ID
    socket.on('register', (userId) => {
        users[userId] = socket.id; 
        console.log(`User ${userId} registered with socket ID ${socket.id}`);
    });

    // New user connection
    socket.on('newUser', (userData) => {
        users[userData.userId] = socket.id; 
        console.log('Connected users:', users);
    });

    // Private message handling
    socket.on('privateMessage', (data) => {
        console.log('Private message received:', data);

        const recipientSocketId = users[data.to]; 
        if (recipientSocketId) {
            // Emit message to the recipient
            socket.to(recipientSocketId).emit('messageResponse', {
                from: data.from,
                to: data.to,
                message: data.message,
            });

            // Emit back to sender for confirmation
            socket.emit('messageResponse', {
                from: data.from,
                to: data.to,
                message: data.message,
            });
        } else {
            console.log('Recipient not connected');
        }
    });



    socket.on('typing', (data) => {
      console.log(`${data.from} is typing...`);

      // Emit typing status to the recipient
      const recipientSocketId = users[data.to];
      if (recipientSocketId) {
          socket.to(recipientSocketId).emit('typing', {
              from: data.from,
              to: data.to,
          });
      }
  });

  // Handle stop typing event
  socket.on('stopTyping', (data) => {
      console.log(`${data.from} stopped typing`);

      // Emit stop typing status to the recipient
      const recipientSocketId = users[data.to];
      if (recipientSocketId) {
          socket.to(recipientSocketId).emit('stopTyping', {
              from: data.from,
              to: data.to,
          });
      }
  });

    // user disconnect
    socket.on('disconnect', () => {
        for (let userId in users) {
            if (users[userId] === socket.id) {
                delete users[userId]; 
                console.log(`User ${userId} disconnected`);
                break;
            }
        }
    });
});


app.get('/api', (req, res) => {
    res.json({ message: 'Hello World' });
});

http.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
