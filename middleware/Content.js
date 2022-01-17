import mongoose from 'mongoose';
import fetch from 'node-fetch';
import { Book } from '../models/Content.js';
import ApiError from './Error.js';

export default class ContentMiddleware {
    static async existsContent(req, res, next) {
        const contentId = mongoose.Types.ObjectId(req.params.contentId);
        if (await Book.exists({ _id: contentId })) {
            next();
            return;
        }
        next(new ApiError('fail', null, `No book with id: ${contentId} exists.`));
    }

    static async existsUser(req, res, next) {
        const { userId } = req.body;
        const response = await (await fetch(`http://localhost:3002/users/${userId}`)).json();
        if (response.data) {
            next();
            return;
        }
        next(new ApiError('fail', response.data, response.message));
    }

    // eslint-disable-next-line no-unused-vars
    static errorHandler(err, req, res, next) {
        console.log(err);
        res.send({
            status: err.statusText ?? 'fail',
            message: err.message ?? 'Internal server error',
            data: err.data ?? null,
        });
    }
}
