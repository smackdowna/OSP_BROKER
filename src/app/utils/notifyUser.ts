import { io , onlineUsers } from "./socket";


export const notifyUser = (recipientId: string, data: any) => {
    const socketId = onlineUsers.get(recipientId);
    if (socketId) {
      io.to(socketId).emit("notification", data);
    }
    console.log("Notification sent to user:", recipientId, "Data:", data);
  };
  