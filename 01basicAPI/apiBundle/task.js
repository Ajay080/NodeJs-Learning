const express= require('express');
const task= require("../models/task");

const TaskRouter=express.Router();

TaskRouter.get('/getTasks', async (req, res)=>{
    try {
        let tasks= await task.find();
        return res.json({tasks});
    } catch (err) {
        return res.status(500).json({message:"Internal server error"});
    }
})


module.exports= TaskRouter;