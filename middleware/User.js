import mongoose from 'mongoose';
import { User } from '../models/User.js';

export default class UserMiddleware {
    static async exists(req, res, next) {
        try {
            const userId = mongoose.Types.ObjectId(req.query.userId ?? req.params.userId);
            if (await User.exists({ _id: userId })) {
                next();
                return;
            }
            res.send({
                status: 'fail',
                data: {
                    message: `No User with id: ${userId} exists.`,
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
