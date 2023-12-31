const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require('path');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const SocketPort = 4000;
server.listen(SocketPort, () => {
  console.log(`Server is running on port: ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});


let chatRoom = '';

io.on('connection', (socket) => {
  console.log(`user connected to socket: ${socket.id}`);

  socket.on('join_chat', (data) => {
     const { user_id, room_id } = data;
     socket.join(room_id);
     chatRoom = room_id;
    });

  socket.on('send_message', (data) => {
    const { message, user_id } = data;
    let message_time = Date.now();
    io.to(chatRoom).emit('receive_message', {
      message,
      user_id,
      message_time,
    });
  });

  socket.on('disconnect', () => {
    console.log(`user disconnected: ${socket.id}`);
  });

});


const mongooseConnect = require("./configs/mongoDB.connect");
require("dotenv").config();


const authMiddleware = require("./middlewares/auth.middleware");
const adminMiddleware = require("./middlewares/admin.middleware");


const authRouter = require("./routes/auth.routes")
app.use("/auth", authRouter)

const usersRouter = require("./routes/users.routes");
app.use("/user", authMiddleware, usersRouter)

const generalRouter = require("./routes/general.routes");
app.use("/", generalRouter)

const adminRouter = require("./routes/admin.routes");
app.use("/admin", adminMiddleware, adminRouter)


const PORT = 8000;
app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`Server is running on port: ${PORT}`);
  mongooseConnect();
});
