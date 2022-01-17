import mongoose from 'mongoose';
import { User } from '../models/User.js';
import ApiError from './Error.js';

export default class UserMiddleware {
    static async existsUser(req, res, next) {
        let userId = req.query.userId ?? req.params.userId ?? req.body.userId;
        userId = mongoose.Types.ObjectId(userId);
        if (await User.exists({ _id: userId })) {
            next();
            return;
        }
        next(new ApiError('fail', null, `No User with id: ${userId} exists.`));
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
