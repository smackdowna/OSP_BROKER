"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyUser = void 0;
const mainSocket_1 = require("./mainSocket");
const notifyUser = (recipientId, data) => {
    const socketId = mainSocket_1.onlineUsers.get(recipientId);
    if (socketId) {
        mainSocket_1.io.to(socketId).emit("notification", data);
    }
    console.log("Notification sent to user:", recipientId, "Data:", data);
};
exports.notifyUser = notifyUser;
