"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyUser = void 0;
const Socket_1 = require("./Socket");
const notifyUser = (recipientId, data) => {
    const socketId = Socket_1.onlineUsers.get(recipientId);
    if (socketId) {
        Socket_1.io.to(socketId).emit("notification", data);
    }
    console.log("Notification sent to user:", recipientId, "Data:", data);
};
exports.notifyUser = notifyUser;
