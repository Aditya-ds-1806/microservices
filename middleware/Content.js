import mongoose from 'mongoose';
import fetch from 'node-fetch';
import { Book } from '../models/Content.js';

export default class ContentMiddleware {
    static async existsContent(req, res, next) {
        try {
            const contentId = mongoose.Types.ObjectId(req.params.contentId);
            if (await Book.exists({ _id: contentId })) {
                next();
                return;
            }
            res.send({
                status: 'fail',
                data: {
                    message: `No book with id: ${contentId} exists.`,
                },
            });
        } catch (err) {
            console.log(err);
            res.send({
                status: 'error',
                message: err.message,
            });
        }
    }

    static async existsUser(req, res, next) {
        try {
            const { userId } = req.body;
            const response = await (await fetch(`http://localhost:3002/users/${userId}`)).json();
            if (response.data) {
                next();
                return;
            }
            res.send(response);
        } catch (err) {
            console.log(err);
            res.send({
                status: 'error',
                message: err.message,
            });
        }
    }
}
