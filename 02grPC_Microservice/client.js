const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = './proto/user.proto';
const packageDef = protoLoader.loadSync(PROTO_PATH, {});
const grpcObj = grpc.loadPackageDefinition(packageDef);
const userPackage = grpcObj.user;

const client = new userPackage.UserService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

client.CreateUser({ name: "Ajay Singh", email: "ajay@example.com" }, (err, response) => {
  if (err) return console.error("Error:", err);
  console.log("Created User:", response);

  client.GetAllUsers({}, (err, response) => {
    if (err) return console.error("Error:", err);
    console.log("All Users:", response.users);
  });
});
