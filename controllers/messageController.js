const Chat = require('../models/messageModel');
const factory = require('./../controllers/handlerFactory');

exports.getAllChats = factory.getAll(Chat);
exports.getOneChat = factory.getOne(Chat);
exports.deleteChat = factory.deleteOne(Chat);