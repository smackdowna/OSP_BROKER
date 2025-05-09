import http from "http";
import { Server } from "socket.io";
import app from "../../server";

const server = http.createServer(app);

const onlineUsers = new Map<string, string>();

const io = new Server(server, {
    cors: {
      origin: ["http://localhost:8080", "https://osp-broker.web.app", "https://osp-broker.firebaseapp.com"], // Replace with your frontend URL in production
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
  
    // Listen for user identification
    socket.on("register", (userId: string) => {
      onlineUsers.set(userId, socket.id);
      console.log("Registered user:", userId);
    });
  
    // Disconnect
    socket.on("disconnect", () => {
      for (let [key, value] of onlineUsers.entries()) {
        if (value === socket.id) {
          onlineUsers.delete(key);
          break;
        }
      }
      console.log("User disconnected:", socket.id);
    });
  });

export {io , onlineUsers};