import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DBConnection from '../db.js';

dotenv.config();

const dbUri = process.env.DB_1;

const BookSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    content: new mongoose.Schema({
        title: {
            type: String,
            required: true,
        },
        story: {
            type: String,
            required: true,
        },
    }, { _id: false }),
    publishedDate: {
        type: Date,
        default: new Date(),
    },
});

const conn = new DBConnection(dbUri).connect();
const Book = conn.model('Book', BookSchema);

export {
    Book,
    BookSchema,
};
