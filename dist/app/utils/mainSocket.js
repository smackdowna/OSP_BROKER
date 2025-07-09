"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlineUsers = exports.io = void 0;
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const server_1 = __importDefault(require("../../server"));
const server = http_1.default.createServer(server_1.default);
// Track online users (userId -> socketId)
const onlineUsers = new Map();
exports.onlineUsers = onlineUsers;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: [
            "http://localhost:8080",
            "https://osp-broker.web.app",
            "https://osp-broker.firebaseapp.com",
        ],
        methods: ["GET", "POST"],
    },
});
exports.io = io;
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    // Register user with their socket ID
    socket.on("register", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(`User ${userId} registered with socket ${socket.id}`);
    });
    socket.on("join-group", (groupId) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = socket.data.userId;
        if (!userId) {
            socket.emit("error", { message: "Unauthorized" });
            return;
        }
        try {
            socket.join(groupId);
            console.log(`User ${userId} joined group ${groupId}`);
            socket.emit("group-joined", groupId);
        }
        catch (err) {
            console.error("Error checking group membership:", err);
            socket.emit("error", { message: "Failed to join group" });
        }
    }));
    // Leave a group (business page)
    socket.on("leave-group", (groupId) => {
        const userId = socket.data.userId;
        if (!userId) {
            socket.emit("error", { message: "Unauthorized" });
            return;
        }
        socket.leave(groupId);
        console.log(`User ${userId} left group ${groupId}`);
        socket.emit("group-left", groupId);
    });
    // Handle group messages
    socket.on("group-message", (_a) => __awaiter(void 0, [_a], void 0, function* ({ groupId, content }) {
        const userId = socket.data.userId;
        if (!userId) {
            socket.emit("error", { message: "Unauthorized" });
            return;
        }
        try {
            // Broadcast to all group members
            io.to(groupId).emit("new-group-message", {
                groupId,
                senderId: userId,
                content,
                timestamp: new Date().toISOString(),
            });
            socket.emit("message-sent", content);
        }
        catch (error) {
            console.error("Failed to send group message:", error);
            socket.emit("error", { message: "Message delivery failed" });
        }
    }));
    // Handle private messages
    socket.on("private-message", (_a) => __awaiter(void 0, [_a], void 0, function* ({ recipientId, content }) {
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
        }
        catch (error) {
            console.error("Failed to send message:", error);
            socket.emit("error", { message: "Message delivery failed" });
        }
    }));
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
