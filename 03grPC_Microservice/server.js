const express= require('express');
const cors=require('cors');
const {GRPC_Server}= require('./GrPC_Server');

const app=express();
app.use(express.json());

app.use(cors({
    origin:'*'
}));

app.listen(1212, ()=>{
    GRPC_Server();
    console.log("server started at 1212");
})