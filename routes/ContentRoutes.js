import { Router } from 'express';
import fileUpload from 'express-fileupload';
import csv from 'csvtojson';
import dotenv from 'dotenv';
import totp from 'totp-generator';
import fetch from 'node-fetch';
import { Book } from '../models/Content.js';

dotenv.config({ path: 'routes/.env' });

const { TOTP_KEY } = process.env;
const ContentRouter = new Router();
ContentRouter.use(fileUpload());

ContentRouter.put('/content', async (req, res) => {
    try {
        const csvString = req.files.file.data.toString('utf8');
        const books = (await csv().fromString(csvString)).reduce((acc, book) => {
            acc.push({
                userId: book.userId,
                content: {
                    title: book.title,
                    story: book.story,
                },
                publishedDate: book.publishedDate,
            });
            return acc;
        }, []);
        const newBooks = await Book.insertMany(books);
        res.send({
            status: 'success',
            data: newBooks,
        });
    } catch (err) {
        console.log(err);
        res.send({
            status: 'error',
            message: err.message,
        });
    }
});

ContentRouter.get('/content', async (req, res) => {
    // list all contents based on sorting order specified in query parameter
    const { sort } = req.query;
    try {
        if (sort === 'new') {
            const books = await Book.find({}, { content: 1 }).sort({ publishedDate: -1 }).exec();
            res.send({
                status: 'success',
                data: books,
            });
        } else if (sort === 'top') {
            const token = totp(TOTP_KEY);
            const response = await (await fetch('http://localhost:3001/content/stats', {
                headers: {
                    'X-TOTP': token,
                    'X-TOTP-Generation-Timestamp': Date.now(),
                },
            })).json();
            if (response.status === 'fail') {
                res.send(response);
                return;
            }
            const { data: scores } = response;
            const { data: books } = await (await fetch('http://localhost:3000/content?sort=new')).json();
            books.sort((book1, book2) => (scores[book2._id] ?? 0) - (scores[book1._id] ?? 0));
            res.send({
                status: 'success',
                data: books,
            });
        }
    } catch (err) {
        console.log(err);
        res.send({
            status: 'error',
            message: err.message,
        });
    }
});

ContentRouter.post('/content', async (req, res) => {
    // create book entry
    try {
        const { content, publishedDate, userId } = req.body;
        const newBook = await Book.create({
            content,
            publishedDate,
            userId,
        });
        res.send({
            status: 'success',
            data: newBook,
        });
    } catch (err) {
        res.send({
            status: 'error',
            message: err.message,
        });
    }
});

ContentRouter.get('/content/:bookId', async (req, res) => {
    // read book entry
    try {
        const { bookId } = req.params;
        const book = await Book.findById(bookId, { content: 1 });
        res.send({
            status: 'success',
            data: book,
        });
    } catch (err) {
        console.log(err);
        res.send({
            status: 'error',
            message: err.message,
        });
    }
});

ContentRouter.put('/content/:bookId', async (req, res) => {
    // update book entry
    try {
        const { content } = req.body;
        const { bookId } = req.params;
        const updates = Object.entries(content).reduce((acc, [key, val]) => {
            acc[`content.${key}`] = val;
            return acc;
        }, {});
        const newBook = await Book.findByIdAndUpdate(bookId, updates, { new: true });
        res.send({
            status: 'success',
            data: newBook,
        });
    } catch (err) {
        res.send({
            status: 'error',
            message: err.message,
        });
    }
});

ContentRouter.delete('/content/:bookId', async (req, res) => {
    // delete book entry
    try {
        const { bookId } = req.params;
        const newBook = await Book.findByIdAndDelete(bookId);
        res.send({
            status: 'success',
            data: newBook,
        });
    } catch (err) {
        res.send({
            status: 'error',
            message: err.message,
        });
    }
});

export default ContentRouter;
