const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const messages = require('./generated/user_pb');

const userDataPath = './userData.json';

let userData;
try {
  const raw = fs.readFileSync(userDataPath, 'utf8');
  const parsed = JSON.parse(raw);
  userData = Array.isArray(parsed) ? parsed : [];   // ✅ guarantees array
} catch (err) {
  userData = [];
}


console.log("Initial User Data:", userData);

// --- Create User ---
function createUser(call, callback) {
  console.log("Create User Function Called");
  const req = call.request;

  // Create protobuf UserResponse
  const newUser = new messages.UserResponse();
  newUser.setId(uuidv4());
  newUser.setName(req.getName());
  newUser.setEmail(req.getEmail());

  // Save raw object for persistence
  const plainUser = {
    id: newUser.getId(),
    name: newUser.getName(),
    email: newUser.getEmail(),
  };
  userData.push(plainUser);   // ✅ guaranteed array now

  fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));

  callback(null, newUser);
}

// --- Get All Users ---
function getAllUsers(call, callback) {
  console.log("Get All Users Function Called");

  const protoUsers = userData.map(u => {
    const usr = new messages.UserResponse();
    usr.setId(u.id);
    usr.setName(u.name);
    usr.setEmail(u.email);
    return usr;
  });

  const userList = new messages.UserList();
  userList.setUsersList(protoUsers);

  callback(null, userList);
}

module.exports = { createUser, getAllUsers };
