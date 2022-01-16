import mongoose from 'mongoose';
import { Book } from '../models/Content.js';

export default class ContentMiddleware {
    static async exists(req, res, next) {
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
}
