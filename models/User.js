import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DBConnection from '../db.js';

dotenv.config();

const dbUri = process.env.DB_3;
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
