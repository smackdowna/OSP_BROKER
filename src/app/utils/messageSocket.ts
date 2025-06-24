// socket.ts (fully typed version)
import http from "http";
import { Server } from "socket.io";
import app from "../../server";
import { PrismaClient } from '@prisma/client';
import { 
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData
} from '../types/sockets/messageSocketTypes';

const prisma = new PrismaClient();
const server = http.createServer(app);

interface OnlineUsers {
  [userId: string]: string;
}

const onlineUsers: OnlineUsers = {};

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
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

  socket.on("register", (userId) => {
    onlineUsers[userId] = socket.id;
    socket.data.userId = userId;
    console.log("Registered user:", userId);
  });

  socket.on("private-message", async ({ recipientId, content }) => {
    const senderId = socket.data.userId;
    
    if (!senderId) {
      socket.emit("message-error", { error: "Sender not identified" });
      return;
    }

    try {
      const savedMessage = await prisma.message.create({
        data: {
          senderId: senderId,
          recipientId: recipientId,
          content,
          read: false
        }
      });

      const recipientSocketId = onlineUsers[recipientId];
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("private-message", savedMessage);
        await prisma.message.update({
          where: { id: savedMessage.id },
          data: { read: true }
        });
      }
      
      socket.emit("message-sent", savedMessage);
    } catch (error) {
      console.error("Error saving message:", error);
      socket.emit("message-error", { 
        error: "Failed to send message",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  socket.on("mark-as-read", async ({ messageIds }) => {
    try {
      await prisma.message.updateMany({
        where: { id: { in: messageIds } },
        data: { read: true }
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  });

  socket.on("disconnect", () => {
    if (socket.data.userId) {
      delete onlineUsers[socket.data.userId];
    }
    console.log("User disconnected:", socket.id);
  });
});

export { io, onlineUsers };