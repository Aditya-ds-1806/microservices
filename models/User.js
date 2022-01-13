import mongoose from 'mongoose';
import DBConnection from '../db.js';

const dbUri = 'mongodb://127.0.0.1:27017/userService';
const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    phoneNumber: String,
    emailId: String,
});

const conn = new DBConnection(dbUri).connect();
const User = conn.model('User', UserSchema);

export {
    User,
    UserSchema,
};
