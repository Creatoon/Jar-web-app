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
    const date = new Date();
    const minute = date.getMinutes();
    if (minute <= 9) {
      minute = '0' + minute;
    }
    const newTime = `${date.getHours()}:${minute}`;
    // eslint-disable-next-line no-console
    console.log(newTime);
    if (data.roomName !== 'default') {
      const chat = new MessageDB({
        message: data.message,
        room: data.roomName,
        user: data.userId,
        userName: userName.name,
        timestamp: newTime
      });
      chat.save();
    }
  });
};

module.exports = sock;
