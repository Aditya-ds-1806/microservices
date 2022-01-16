import mongoose from 'mongoose';
import { User } from '../models/User.js';

export default class UserMiddleware {
    static async exists(req, res, next) {
        try {
            let userId = req.query.userId ?? req.params.userId ?? req.body.userId;
            userId = mongoose.Types.ObjectId(userId);
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
