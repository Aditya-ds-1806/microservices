import mongoose from 'mongoose';
import DBConnection from '../db.js';

const dbUri = 'mongodb://127.0.0.1:27017/userInteractionService';
const UserInteractionSchema = new mongoose.Schema({
    contentId: mongoose.Schema.Types.ObjectId,
    likes: [mongoose.Schema.Types.ObjectId],
    read: [mongoose.Schema.Types.ObjectId],
});

const conn = new DBConnection(dbUri).connect();
const UserInteraction = conn.model('UserInteraction', UserInteractionSchema);

export {
    UserInteraction,
    UserInteractionSchema,
};
