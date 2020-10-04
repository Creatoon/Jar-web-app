const MessageDB = require('./models/messageModel');
const User = require('./models/userModel');

const sock = socket => {
  socket.on('join room', async data => {
    socket.join(data.roomName);
    const userName = await User.findById(data.userId);

    socket.to(data.roomName).broadcast.emit('broadcast', {
      message: data.message,
      name: userName
    });

    if (data.roomName !== 'default') {
      const chat = new MessageDB({
        message: data.message,
        room: data.roomName,
        user: data.userId,
        userName: userName.name
      });
      chat.save();
    }
  });
};

module.exports = sock;
