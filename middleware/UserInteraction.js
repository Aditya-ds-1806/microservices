import dotenv from 'dotenv';
import totp from 'totp-generator';
import fetch from 'node-fetch';
import mongoose from 'mongoose';
import { UserInteraction } from '../models/UserInteraction.js';

dotenv.config({ path: 'routes/.env' });

const { TOTP_KEY } = process.env;

export default class UserInteractionMiddleware {
    static async readReadsHandler(req, res) {
        try {
            const { contentId } = req.params;
            const reads = await UserInteraction.findOne({ contentId }, { reads: 1 });
            res.send({
                status: 'success',
                data: {
                    contentId,
                    reads: reads ?? 0,
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

    static async updateReadsHandler(req, res) {
        try {
            const { contentId } = req.params;
            const userId = mongoose.Types.ObjectId(req.query.userId);
            const reads = await UserInteraction.findOneAndUpdate({ contentId }, {
                $addToSet: { reads: userId },
            }, { new: true, upsert: true });
            res.send({
                status: 'success',
                data: reads,
            });
        } catch (err) {
            console.log(err);
            res.send({
                status: 'error',
                message: err.message,
            });
        }
    }

    static async readLikesHandler(req, res) {
        try {
            const { contentId } = req.params;
            const likes = await UserInteraction.findOne({ contentId }, { likes: 1 });
            res.send({
                status: 'success',
                data: {
                    contentId,
                    likes: likes ?? 0,
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

    static async updateLikesHandler(req, res) {
        try {
            const { contentId } = req.params;
            const { likeState } = req.query;
            const userId = mongoose.Types.ObjectId(req.query.userId);
            const updates = {
                1: { $addToSet: { likes: userId } },
                0: { $pull: { likes: userId } },
            };
            const likes = await UserInteraction.findOneAndUpdate({
                contentId,
            }, updates[likeState], {
                new: true,
                upsert: true,
            });
            res.send({
                status: 'success',
                data: likes,
            });
        } catch (err) {
            console.log(err);
            res.send({
                status: 'error',
                message: err.message,
            });
        }
    }

    static async readStatsHandler(req, res) {
        try {
            const stats = await UserInteraction.aggregate().match({}).project({ likes: { $size: '$likes' }, reads: { $size: '$reads' }, contentId: 1 }).exec();
            const topMetric = stats.reduce((acc, { likes, reads, contentId }) => {
                acc[contentId] = likes + reads;
                return acc;
            }, {});
            res.send({
                status: 'success',
                data: topMetric,
            });
        } catch (err) {
            console.log(err);
            res.send({
                status: 'error',
                message: err.message,
            });
        }
    }

    static checkTOTP(req, res, next) {
        const receivedTotp = req.headers['x-totp'];
        const totpTimestamp = req.headers['x-totp-generation-timestamp'];
        const calculatedTotp = totp(TOTP_KEY, { timestamp: totpTimestamp });
        if (calculatedTotp === receivedTotp) {
            next();
        } else {
            res.send({
                status: 'fail',
                data: {
                    receivedTotp,
                },
                message: 'Authentication failure! Invalid TOTP received.',
            });
        }
    }

    static async existsUser(req, res, next) {
        try {
            const { userId } = req.query;
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

    static async existsContent(req, res, next) {
        try {
            const { contentId } = req.params;
            const response = await (await fetch(`http://localhost:3000/content/${contentId}`)).json();
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
