import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DBConnection from '../db.js';

dotenv.config();

const dbUri = process.env.DB_3;
const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    emailId: {
        type: String,
        required: true,
    },
});

const conn = new DBConnection(dbUri).connect();
const User = conn.model('User', UserSchema);

export {
    User,
    UserSchema,
};
