const User = require("../models/user.model")
const Chat = require("../models/chat.model");


const chat = async (req, res) => {

  const { _id: user_id } = req.user;
  const { chat_users } = req.params;
  const chat_members = [user_id, chat_users]

  try {
    const chat = await Chat.findOne({ chat_users: { $all: chat_members } });

    if (chat) {
      return res.status(200).send(chat);
    }

    const newChat = new Chat({chat_users: chat_members});

    await newChat.save();

    return res.status(200).send(newChat);
  } catch (error) { 
    console.error(error);
    res.status(500).send("An error occurred while creating the chat.");
  }
}


module.exports = {
  chat
}

