import http from "http";
import { Server } from "socket.io";
import app from "../../server";

const server = http.createServer(app);

// Track online users (userId -> socketId)
const onlineUsers = new Map<string, string>();

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:8080",
      "https://osp-broker.web.app",
      "https://osp-broker.firebaseapp.com"
    ],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Register user with their socket ID
  socket.on("register", (userId: string) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  // Handle private messages
socket.on("private-message", async ({ recipientId, content }) => {
    const senderId = socket.data.userId;
    
    if (!senderId) {
      socket.emit("error", { message: "Unauthorized" });
      return;
    }

    try {
      const recipientSocketId = onlineUsers.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("new-message", content);
      }

      socket.emit("message-sent", content);
    } catch (error) {
      console.error("Failed to send message:", error);
      socket.emit("error", { message: "Message delivery failed" });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});


export { io, onlineUsers };