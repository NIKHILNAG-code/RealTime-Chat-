
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIO = require('socket.io');
const Message = require('./models/Message');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/chatdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'));

io.on('connection', socket => {
  console.log('User connected:', socket.id);

  socket.on('sendMessage', async (data) => {
    const message = new Message(data);
    await message.save();
    io.emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.get('/messages', async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

server.listen(3001, () => {
  console.log('Backend server running on port 3001');
});
