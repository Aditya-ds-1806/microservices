import mongoose from 'mongoose';
import fetch from 'node-fetch';
import { Book } from '../models/Content.js';
import ApiError from './Error.js';

export default class ContentMiddleware {
    static async existsContent(req, res, next) {
        let { contentId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            next(new ApiError(400, null, `Received invalid Content ID: ${contentId}`));
        }
        contentId = mongoose.Types.ObjectId(contentId);
        if (await Book.exists({ _id: contentId })) {
            next();
            return;
        }
        next(new ApiError(404, null, `No book with id: ${contentId} exists.`));
    }

    static async existsUser(req, res, next) {
        const { userId } = req.body;
        const response = await (await fetch(`http://localhost:3002/users/${userId}`)).json();
        if (response.data) {
            next();
            return;
        }
        next(new ApiError(response.status, response.data, response.message));
    }

    // eslint-disable-next-line no-unused-vars
    static errorHandler(err, req, res, next) {
        console.log(err);
        res.send({
            status: (err.name === 'CastError' || err.name === 'ValidationError') ? 400 : (err.status ?? 500),
            message: err.message ?? 'Internal server error',
            data: err.data ?? null,
        });
    }
}
