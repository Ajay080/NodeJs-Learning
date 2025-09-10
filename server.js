const express= require("express");
const http= require("http");
const {Server}= require("socket.io");


const app= express();
const http_server= http.createServer(app);

const io= new Server(http_server, {
    cors:{
        origin:"*",
        methods:["GET", "POST"]
    }
})


//listen for new client connections
io.on('connection', (socket)=>{
    console.log("new client connection have been made", socket.id);

    socket.on("joinRoom", (data)=>{
        socket.join(data);
        socket.emit("joinedRoom", `you have joined the room: ${data}`);
    })

    socket.on("roomMessage",({room, message})=>{
        socket.to(room).emit("roomMessage", ("the room is  "+room +" " +message));
    } )

    socket.on("leaveRoom", (data)=>{
        socket.leave(data);
        socket.emit("leaveRoom", `you have left the room: ${data}`);
    })

    socket.on("message", (data)=>{
        console.log("message received", data);
        //send reply back to the client
        io.emit("message", `server has received your message: ${data}`);
    })

    socket.on("disconnect", ()=>{
        console.log("client disconnected");
    })
})


http_server.listen(8080, ()=>{
    console.log("server is listening on port 8080");
});