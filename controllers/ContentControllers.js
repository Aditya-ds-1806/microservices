import csv from 'csvtojson';
import fetch from 'node-fetch';
import totp from 'totp-generator';
import { Book } from '../models/Content.js';

const { TOTP_KEY } = process.env;

export default class ContentControllers {
    static async bulkInsert(req, res) {
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
    }

    static async listAllContent(req, res) {
        const { sort } = req.query;
        try {
            if (sort === 'new') {
                const books = await Book
                    .find({}, { content: 1 })
                    .sort({ publishedDate: -1 })
                    .exec();
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
    }

    static async createContent(req, res) {
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
    }

    static async readContent(req, res) {
        try {
            const { contentId } = req.params;
            const book = await Book.findById(contentId, { content: 1 });
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
    }

    static async updateContent(req, res) {
        try {
            const { content } = req.body;
            const { contentId } = req.params;
            const updates = Object.entries(content).reduce((acc, [key, val]) => {
                acc[`content.${key}`] = val;
                return acc;
            }, {});
            const newBook = await Book.findByIdAndUpdate(contentId, updates, { new: true });
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
    }

    static async deleteContent(req, res) {
        try {
            const { contentId } = req.params;
            const newBook = await Book.findByIdAndDelete(contentId);
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
    }
}
