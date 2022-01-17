import mongoose from 'mongoose';
import { User } from '../models/User.js';

export default class UserMiddleware {
    static async createUserHandler(req, res) {
        try {
            const {
                firstName, lastName, emailId, phoneNumber,
            } = req.body;
            const newUser = await User.create({
                firstName,
                lastName,
                emailId,
                phoneNumber,
            });
            res.send({
                status: 'success',
                data: newUser,
            });
        } catch (err) {
            console.log(err);
            res.send({
                status: 'error',
                message: err.message,
            });
        }
    }

    static async readUserHandler(req, res) {
        try {
            const { userId } = req.params;
            const user = await User.findById(userId);
            res.send({
                status: 'success',
                data: user,
            });
        } catch (err) {
            console.log(err);
            res.send({
                status: 'error',
                message: err.message,
            });
        }
    }

    static async updateUserHandler(req, res) {
        try {
            const { userId } = req.params;
            const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
            res.send({
                status: 'success',
                data: updatedUser,
            });
        } catch (err) {
            console.log(err);
            res.send({
                status: 'error',
                message: err.message,
            });
        }
    }

    static async deleteUserHandler(req, res) {
        try {
            const { userId } = req.params;
            const deletedUser = await User.findByIdAndDelete(userId);
            res.send({
                status: 'success',
                data: deletedUser,
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
            let userId = req.query.userId ?? req.params.userId ?? req.body.userId;
            userId = mongoose.Types.ObjectId(userId);
            if (await User.exists({ _id: userId })) {
                next();
                return;
            }
            res.send({
                status: 'fail',
                data: null,
                message: `No User with id: ${userId} exists.`,
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
