import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);// Create an HTTP server


export function getReceicerSocketId(userId) {
    return userSocketMap[userId];//get the socket id of the user from the userSocketMap
}

//used to store online users
const userSocketMap = {};//{userId: socketId}

// Create a Socket.IO server
const io = new Server(server, {
    cors: {
        origin: ['https://giggle-talk-codebase.vercel.app/']
    }
});

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;//from client side
    if (userId) userSocketMap[userId] = socket.id;//store the socket id of the user

    // io.emit(event name,object) is used to send a message to all connected clients(broadcast)
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId];//remove the socket id of the user
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, server, app }; 
