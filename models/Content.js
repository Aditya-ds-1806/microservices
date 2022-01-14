import mongoose from 'mongoose';
import DBConnection from '../db.js';

const dbUri = 'mongodb://127.0.0.1:27017/ContentService';

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
