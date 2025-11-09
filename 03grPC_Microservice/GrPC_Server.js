const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { User_GRPC_Service }= require('./GrPC_Functions');

// Load proto file
const packageDef = protoLoader.loadSync('./proto/user.proto', {});// load proto file
const grpcObject= grpc.loadPackageDefinition(packageDef);// create grpc object from package definition which is loaded from proto file to access the services
const userPackage= grpcObject.user; // get user package from grpc object

// start server
function GRPC_Server(){
    const server= new grpc.Server();
    server.addService(userPackage.UserService.service, User_GRPC_Service);
    server.bindAsync('localhost:50051', grpc.ServerCredentials.createInsecure(), ()=>{
        server.start();
        console.log("gRPC server running at http://localhost:50051");
    });
}

module.exports= { GRPC_Server };