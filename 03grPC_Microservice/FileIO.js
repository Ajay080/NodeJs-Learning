const fs= require('fs');


const IO_FileDataRead = (path) => {
    try {
        const data = fs.readFileSync(path, 'utf8');
        if (!data.trim()) return [];
        return data.split('\n').filter(line => line.trim() !== '').map(line => JSON.parse(line));
    } catch (err) {
        console.log("error in reading file", err);
        return [];
    }
};

const IO_AppendDataToFile = (path, data) => {
    try {
        fs.appendFileSync(path, data);
        return JSON.parse(data);
    } catch (err) {
        console.log("error in appending data to file", err);
        return null;
    }
};

const IO_GetUserById = (path, id) => {
    try {
        const users = IO_FileDataRead(path);
        const user = users.find(user => user.id === id);
        if (!user) {
            console.log("user not found");
            return null;
        }
        return user;
    } catch (err) {
        console.log("error in getting user by id", err);
        return null;
    }
};

const IO_DeleteUserById = (path, id) => {
    try {
        const users = IO_FileDataRead(path);
        const filteredUsers = users.filter(user => user.id !== id);
        const updatedData = filteredUsers.map(user => JSON.stringify(user)).join('\n') + (filteredUsers.length ? '\n' : '');
        fs.writeFileSync(path, updatedData);
        return { message: "user deleted successfully" };
    } catch (err) {
        console.log("error in deleting user by id", err);
        return null;
    }
};

const IO_UpdateUserById = (path, id, newData) => {
    try {
        const users = IO_FileDataRead(path);
        const userIndex = users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            console.log("user not found");
            return null;
        }
        users[userIndex] = { ...users[userIndex], ...newData };
        const updatedData = users.map(user => JSON.stringify(user)).join('\n') + (users.length ? '\n' : '');
        fs.writeFileSync(path, updatedData);
        return users[userIndex];
    } catch (err) {
        console.log("error in updating user by id", err);
        return null;
    }
};

const IO_ClearFilebyTruncate = (path) => {
    try {
        fs.truncateSync(path, 0);
        return { message: "file cleared successfully by truncate" };
    } catch (err) {
        console.log("error in clearing file", err);
        return null;
    }
};

const IO_ClearFilebyEmptyString = (path) => {
    try {
        fs.writeFileSync(path, '');
        return { message: "file cleared successfully by empty string" };
    } catch (err) {
        console.log("error in clearing file", err);
        return null;
    }
};

module.exports= { IO_FileDataRead, IO_AppendDataToFile, IO_GetUserById, IO_DeleteUserById, IO_UpdateUserById, IO_ClearFilebyTruncate, IO_ClearFilebyEmptyString };