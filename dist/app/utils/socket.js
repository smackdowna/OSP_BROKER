"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlineUsers = exports.io = void 0;
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const server_1 = __importDefault(require("../../server"));
const server = http_1.default.createServer(server_1.default);
const onlineUsers = new Map();
exports.onlineUsers = onlineUsers;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:8080", "https://osp-broker.web.app", "https://osp-broker.firebaseapp.com"], // Replace with your frontend URL in production
        methods: ["GET", "POST"],
    },
});
exports.io = io;
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    // Listen for user identification
    socket.on("register", (userId) => {
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
