import mongoose from 'mongoose';
import { UserInteraction } from '../models/UserInteraction.js';

export default class UserInteractionControllers {
    static async readReads(req, res) {
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

    static async updateReads(req, res) {
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

    static async readLikes(req, res) {
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

    static async updateLikes(req, res) {
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

    static async readStats(req, res) {
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
}
