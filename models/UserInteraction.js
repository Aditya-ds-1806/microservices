import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DBConnection from '../db.js';

dotenv.config();

const dbUri = process.env.DB_2;
const UserInteractionSchema = new mongoose.Schema({
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    likes: [mongoose.Schema.Types.ObjectId],
    reads: [mongoose.Schema.Types.ObjectId],
});

const conn = new DBConnection(dbUri).connect();
const UserInteraction = conn.model('UserInteraction', UserInteractionSchema);

export {
    UserInteraction,
    UserInteractionSchema,
};
