const express= require('express');
const cors=require('cors');
const {middlewareFunction, secondMiddlewareFunction} = require('./middlewareFuction');
const makeMongooseServerConnection= require('./mongooseServer');
const Task= require('./models/task');
const TaskRoute= require('./apiBundle/task');

const app=express();

app.use(cors(
    {
        origin:'*'
    }
));

app.use(express.json());

makeMongooseServerConnection();

app.use('/task', TaskRoute);

app.get('/getTasks', async (req, res)=>{
    try {
        let tasks= await Task.find();
        return res.json({tasks});
    } catch (err) {
        return res.status(500).json({message:"Internal server error"});
    }
})

app.get('/api/data', (req, res)=>{
    return res.json({message:"hello user"});
})

app.get('/checkingQueryParam', (req, res)=>{
    const {name, age}=req.query;
    return res.json({message:`hello ${name} of age ${age}`});
})

app.post('/checkingPost', (req, res)=>{
    let body= req.body
    console.log(body);
    return res.json({message:"post request received"}); 
})

app.get('/checkMiddleware', middlewareFunction, (req, res)=>{
    return res.json({message:"middleware passed successfully"});
});

app.get('/checkTwoMiddleware', middlewareFunction, secondMiddlewareFunction, (req, res)=>{
    console.log(req.customData);
    return res.json({message:"both middleware passed successfully and id received is "+ req.customData});
});

app.listen(1212, ()=>{
    console.log("server started at 1212")
}) 