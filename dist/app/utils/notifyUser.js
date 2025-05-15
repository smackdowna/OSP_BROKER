"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyUser = void 0;
const socket_1 = require("./socket");
const notifyUser = (recipientId, data) => {
    const socketId = socket_1.onlineUsers.get(recipientId);
    if (socketId) {
        socket_1.io.to(socketId).emit("notification", data);
    }
    console.log("Notification sent to user:", recipientId, "Data:", data);
};
exports.notifyUser = notifyUser;
