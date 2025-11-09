
const uuid = require('uuid');
const { IO_FileDataRead, IO_AppendDataToFile, IO_GetUserById, IO_DeleteUserById, IO_UpdateUserById, IO_ClearFilebyTruncate, IO_ClearFilebyEmptyString } = require('./FileIO'); 
const User_GRPC_Service = {
  CreateUser: (call, callback)=>{
    const user={
        id:uuid.v4(),
        name:call.request.name,
        age:call.request.age
    }
    const result=IO_AppendDataToFile('user.json', JSON.stringify(user)+'\n');
    callback(null, result);
  },
  GetAllUsers: (call, callback) => {
    const allUserData=IO_FileDataRead('user.json');
    callback(null, {users: allUserData});
  },
  GetUserById: (call, callback)=>{
    const userId= call.request.id;
    const result= IO_GetUserById('user.json',  userId);
    callback(null, result);
  },
  UpdateUserById: (call, callback)=>{
    const User= call.request.user;
    const result=IO_UpdateUserById('user.json', User.id, User);
    callback(null, result);
  },
  DeleteUserById:(call, callback)=>{
    const userId= call.request.id;
    const result=IO_DeleteUserById('user.json', userId);
    callback(null, result);
  },
  DeleteAllUsers:(call, callback)=>{
    const result=IO_ClearFilebyTruncate('user.json');
    callback(null, result);
  }
};
module.exports = { User_GRPC_Service };
