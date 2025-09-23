const mongoose= require('mongoose');
const dotenv= require('dotenv')
dotenv.config();


let mongooseSever= mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

async function makeMongooseServerConnection(){
   try {
       await mongooseSever;
       console.log("mongoose connected successfully");
   } catch (err) {
       console.log("mongoose connection failed", err);
   }
}

module.exports = makeMongooseServerConnection;