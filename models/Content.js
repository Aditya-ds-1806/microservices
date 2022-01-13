import mongoose from 'mongoose';
import DBConnection from '../db.js';

const dbUri = 'mongodb://127.0.0.1:27017/ContentService';

const BookSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    content: {
        title: String,
        story: String,
    },
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
