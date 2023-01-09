const io = require("socket.io")(8000, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let users = [];

const addUser = (userID, socketID, userInfo) => {
  const checkUser = users.some((user) => user.userID === userID);
  if (!checkUser) {
    users.push({ userID, socketID, userInfo });
  }
};
const findFriend = (id) => {
  return users.find((u) => u.userID === id);
};
const userRemove = (socketID) => {
  users = users.filter((user) => user.socketID !== socketID);
};
io.on("connection", (socket) => {
  console.log("User is connected!");
  socket.on("addUser", (userID, userInfo) => {
    addUser(userID, socket.id, userInfo);
    io.emit("getUser", users);
  });
  socket.on("sendMessage", (data) => {
    const user = findFriend(data.recieverId);
    if (user !== undefined) {
      socket.to(user.socketID).emit("getMessage", data);
    }
  });
  socket.on("messageSeen", (msg) => {
    const user = findFriend(msg.senderId);
    if (user !== undefined) {
      socket.to(user.socketID).emit("messageSeenRes", msg);
    }
  });
  socket.on("deliveredMessage", (msg) => {
    const user = findFriend(msg.senderId);
    if (user !== undefined) {
      socket.to(user.socketID).emit("deliveredMessageRes", msg);
    }
  });

  socket.on("typingMessage", (data) => {
    const user = findFriend(data.recieverId);
    if (user !== undefined) {
      socket.to(user.socketID).emit("getTypingMessage", {
        senderId: data.senderId,
        recieverId: data.recieverId,
        message: data.message,
      });
    }
  });
  socket.on("disconnect", () => {
    console.log("User is disconnected!");
    userRemove(socket.id);
    io.emit("getUser", users);
  });
});
