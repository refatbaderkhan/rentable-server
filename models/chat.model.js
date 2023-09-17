const mongoose = require('mongoose');
const User = require('./user.model');


const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  sender_name: String,  
  message: String,
  message_time: {
    type: Date,
    default: Date.now(),
  },
});


const chatSchema = new mongoose.Schema({
  chat_users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  messages : [messageSchema],
});


const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;