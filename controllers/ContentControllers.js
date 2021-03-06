import csv from 'csvtojson';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import totp from 'totp-generator';
import ApiError from '../middleware/Error.js';
import { Book } from '../models/Content.js';

dotenv.config();

const { TOTP_KEY, HOST, PORT_2 } = process.env;

export default class ContentControllers {
    static async bulkInsert(req, res, next) {
        if (!req.files) next(new ApiError(400, null, 'csv file not found'));
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
            status: 200,
            data: newBooks,
        });
    }

    static #sortContentByNew() {
        return Book
            .find({}, { content: 1 })
            .sort({ publishedDate: -1 })
            .exec();
    }

    static async listAllContent(req, res, next) {
        const { sort } = req.query;
        if (sort === 'new') {
            const books = await ContentControllers.#sortContentByNew();
            res.send({
                status: 200,
                data: books,
            });
        } else if (sort === 'top') {
            const token = totp(TOTP_KEY);
            const response = await (await fetch(`http://${HOST}:${PORT_2}/content/stats`, {
                headers: {
                    'X-TOTP': token,
                    'X-TOTP-Generation-Timestamp': Date.now(),
                },
            })).json();
            if (response.status === 401) {
                next(new ApiError(response.status, response.data, response.message));
                return;
            }
            const { data: scores } = response;
            const books = await ContentControllers.#sortContentByNew();
            books.sort((book1, book2) => (scores[book2._id] ?? 0) - (scores[book1._id] ?? 0));
            res.send({
                status: 200,
                data: books,
            });
        } else {
            next(new ApiError(400, null, `Unknown sort option ${sort}`));
        }
    }

    static async createContent(req, res) {
        const { content, publishedDate, userId } = req.body;
        const newBook = await Book.create({
            content,
            publishedDate,
            userId,
        });
        res.send({
            status: 200,
            data: newBook,
        });
    }

    static async readContent(req, res) {
        const { contentId } = req.params;
        const book = await Book.findById(contentId, { content: 1 });
        res.send({
            status: 200,
            data: book,
        });
    }

    static async updateContent(req, res) {
        const { content } = req.body;
        const { contentId } = req.params;
        const updates = Object.entries(content).reduce((acc, [key, val]) => {
            acc[`content.${key}`] = val;
            return acc;
        }, {});
        const newBook = await Book.findByIdAndUpdate(contentId, updates, { new: true });
        res.send({
            status: 200,
            data: newBook,
        });
    }

    static async deleteContent(req, res) {
        const { contentId } = req.params;
        const newBook = await Book.findByIdAndDelete(contentId);
        res.send({
            status: 200,
            data: newBook,
        });
    }
}
