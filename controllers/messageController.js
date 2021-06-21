const Chat = require('../models/messageModel');
const factory = require('./../controllers/handlerFactory');

exports.getAllChats = factory.getAll(Chat);
exports.getOneChat = factory.getOne(Chat);
exports.deleteChat = async (req, res) => {
  const chat = await Chat.findById(req.params.id);
  if (chat.user != req.user._id.toString()) {
    return res.status(403).json({
      status: 'fail',
      data: 'You are not permitted to perform this task.'
    });
  }
  chat.remove();
  res.status(204).json({
    status: 'success',
    data: null
  });
 
};
