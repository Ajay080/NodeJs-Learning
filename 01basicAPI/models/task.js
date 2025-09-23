const mongoose= require('mongoose');

const taskShema= new mongoose.Schema({
    taskId: mongoose.Schema.Types.ObjectId,
    taskName: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Task= mongoose.model("Task", taskShema)
module.exports= Task;