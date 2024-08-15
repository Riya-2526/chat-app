const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const socket = require("socket.io");

const app = express();
const port = process.env.PORT || 5000;

require("dotenv").config();

app.use(cors());
app.use(express.json());

// Set up API routes
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`DB connection successful with ${process.env.MONGO_URL}`);
  })
  .catch((err) => {
    console.error("DB connection error:", err.message);
  });

// Start the server
const server = app.listen(port, () => {
  console.log(`Server started on Port ${port}`);
});

// Set up Socket.io
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust this to match your frontend URL if different
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} added with socket ID ${socket.id}`);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.message);
      console.log(`Message from ${data.from} to ${data.to}: ${data.message}`);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    // Optionally, remove the user from onlineUsers when they disconnect
    for (let [userId, socketId] of onlineUsers) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});
