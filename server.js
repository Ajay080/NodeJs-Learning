const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const http_server = http.createServer(app);

const io = new Server(http_server, {
    cors: {
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST"]
    }
})

const userRooms = new Map();
const activeRooms= new Map();

io.on("connection", (socket) => {
    console.log("new client connection have been made", socket.id);

    socket.emit("serverWelcome", `welcome to the socket io server ${socket.id}`);

    socket.on("clientMessage", (data) => {
        console.log("client message received:", data);
        socket.emit('serverMessage', `Success Message Received: ${data}`);
    })

    socket.on("clientDisconnect", () => {
        console.log("client disconnected");
        socket.emit("serverDisconnect", "You have been disconnected from the server");
    })

    socket.on("disconnect", () => {
        console.log("client disconnected naturally");
    })


    // add to the room
    socket.on("joinRoom",(data)=>{
        const {roomName, userName} = data;

        //Leave Previous Room
        const previousRoom=userRooms.get(socket.id);
        if(previousRoom){
            socket.leave(previousRoom);
            socket.to(previousRoom).emit("serverExitMessage", `User ${userName} has left the room ${previousRoom}`);
        }

        //Join New Room
        socket.join(roomName);
        userRooms.set(socket.id, roomName);
        if(!activeRooms.has(roomName)){
            activeRooms.set(roomName, new Set());
        }
        activeRooms.get(roomName).add(userName);


        // Notify others in the room
        socket.to(roomName).emit("serverJoinMessage", `User ${userName} has joined the room ${roomName}`);


        // send room info to the user
        const roomUsers= Array.from(activeRooms.get(roomName));
        socket.emit('roomJoinedInfo',{
            roomName: roomName,
            users: roomUsers,
            message: `You have joined the room: ${roomName}`
        })

        // room message event
        socket.on("roomMessage",({room, userName, message})=>{
            console.log("room message event triggered");
            console.log("data received from server: ", message);
            console.log("sending message to room: "+ `[${room}] ${userName}: ${message}`);
            io.to(room).emit("chatMessage", (`[${room}] ${userName}: ${message}`));
    // Use io.to(room) instead of socket.to(room) to include the sender
        } )

        socket.on('leaveRoom', ({room, userName})=>{
            io.to(room).emit("serverExitMessage", `User ${userName} has left the room ${room}`);
            socket.emit("leftRoomInfo", `You have left the room: ${room}`);
            // Remove user from activeRooms
            if(activeRooms.has(room)){
                activeRooms.get(room).delete(userName);
                if(activeRooms.get(room).size===0){
                    activeRooms.delete(room);
                }
            }
            socket.leave(room);
            userRooms.delete(socket.id);
        })

        console.log(`User ${userName} joined room: ${roomName}`);

    })
})

http_server.listen(8080, () => {
    console.log("server is listening on port 8080");
})