const express = require('express');
const http = require('http');
const socketIO = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const env = require("./config.js")

// Serve static files from the public directory
app.use(express.static(__dirname + '/public'));

// Set up socket.io event listeners
io.on('connection', socket => {
  console.log('a user connected');

  // When a user disconnects, broadcast a message to all other clients
  socket.on('disconnect', () => {
    socket.broadcast.emit('user disconnected', { username: socket.username });
  });

  // When a user logs in, set their username and broadcast a message to all other clients
  socket.on('login', ({ name, code }, callback) => {
    if (code !== env.secretCode) {
      if (typeof callback === 'function') {
        callback('Invalid chat code');
      }
      return;
    }

    if (typeof callback === 'function') {
      callback(null);
    }

    socket.username = name;
    socket.broadcast.emit('user connected', { username: name });
  });

  // When a user sends a message, broadcast it to all other clients
  socket.on('chat message', data => {
    io.emit('chat message', { username: data.username, userId: data.userId, msgText: data.msgText });
  });
});

// Start the server
const port = process.env.PORT || 7100;
server.listen(port, () => {
  console.log(`http://localhost:${port}/index.html`);
});



