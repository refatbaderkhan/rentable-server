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

const getChats = async (req, res) => {
  const { _id: user_id } = req.user;

  try {
    const chats = await Chat.find({ chat_users: { $in: [user_id] } }).populate(
      "chat_users"
    );

    res.status(200).send(chats);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while getting the chats.");
  }
}


const getChatMessages = async (req, res) => {
  const { _id: user_id } = req.user;
  const { chat_id } = req.params;

  try {
    const chat = await Chat.findById(chat_id);

    if (!chat) {
      return res.status(404).send("Chat not found.");
    }

    if (!chat.chat_users.includes(user_id)) {
      return res.status(403).send("You are not allowed to see this chat.");
    }

    res.status(200).send(chat.messages);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while getting the messages.");
  }
}


const message = async (req, res) => {
  const { _id: user_id, username } = req.user;
  const {chat_id} = req.params;
  const { message } = req.body;

  try {
    const chat = await Chat.findById(chat_id);

    if (!chat) {
      return res.status(404).send("Chat not found.");
    }

    const newMessage = {
      message,
      sender_name: username,
      sender: user_id,
    };

    chat.messages.push(newMessage);
    await chat.save();
    res.status(200).send({ chat , newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while sending the message.");
  }
}


module.exports = {
  chat,
  getChats,
  getChatMessages,
  message,
}

