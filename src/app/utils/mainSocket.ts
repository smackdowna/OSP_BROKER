import http from "http";
import { Server } from "socket.io";
import app from "../../server";

const server = http.createServer(app);

// Track online users (userId -> socketId)
const onlineUsers = new Map<string, string>();

const groupMembers = new Map<string, Set<string>>();

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

   socket.on("join-group", (groupId: string) => {
    const userId = socket.data.userId;
    if (!userId) {
      socket.emit("error", { message: "Unauthorized" });
      return;
    }

    if (!groupMembers.has(groupId)) {
      groupMembers.set(groupId, new Set());
    }
    
    groupMembers.get(groupId)?.add(userId);
    socket.join(groupId); // Join the Socket.IO room
    
    console.log(`User ${userId} joined group ${groupId}`);
    socket.emit("group-joined", groupId);
  });

  // Leave a group (business page)
  socket.on("leave-group", (groupId: string) => {
    const userId = socket.data.userId;
    if (!userId) {
      socket.emit("error", { message: "Unauthorized" });
      return;
    }

    groupMembers.get(groupId)?.delete(userId);
    socket.leave(groupId); // Leave the Socket.IO room
    
    console.log(`User ${userId} left group ${groupId}`);
    socket.emit("group-left", groupId);
  });

  // Handle group messages
  socket.on("group-message", async ({ groupId, content }) => {
    const userId = socket.data.userId;
    
    if (!userId) {
      socket.emit("error", { message: "Unauthorized" });
      return;
    }

    // Check if user is a member of the group
    if (!groupMembers.get(groupId)?.has(userId)) {
      socket.emit("error", { message: "Not a member of this group" });
      return;
    }

    try {
      // Broadcast to all group members
      io.to(groupId).emit("new-group-message", {
        groupId,
        senderId: userId,
        content,
        timestamp: new Date().toISOString()
      });

      socket.emit("message-sent", content);
    } catch (error) {
      console.error("Failed to send group message:", error);
      socket.emit("error", { message: "Message delivery failed" });
    }
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