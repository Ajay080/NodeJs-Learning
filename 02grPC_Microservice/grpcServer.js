const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const PROTO_PATH = './proto/user.proto';
const packageDef = protoLoader.loadSync(PROTO_PATH, {});
const grpcObj = grpc.loadPackageDefinition(packageDef);
const userPackage = grpcObj.user;

const userDataPath = './userData.json';
let userData = [];

if (fs.existsSync(userDataPath)) {
  try {
    userData = JSON.parse(fs.readFileSync(userDataPath));
  } catch {
    userData = [];
  }
}

// --- Handlers ---
function createUser(call, callback) {
  console.log("Create User Called");

  const newUser = {
    id: uuidv4(),
    name: call.request.name,
    email: call.request.email,
  };

  userData.push(newUser);
  fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));

  callback(null, newUser); // plain object works fine
}

function getAllUsers(call, callback) {
  console.log("Get All Users Called");

  // Must wrap inside object with "users" field (matches proto)
  callback(null, { users: userData });
}

// --- Start Server ---
const server = new grpc.Server();
server.addService(userPackage.UserService.service, {
  CreateUser: createUser,
  GetAllUsers: getAllUsers,
});

server.bindAsync(
  '0.0.0.0:50051',
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("gRPC User Service running on port 50051");
    server.start();
  }
);
