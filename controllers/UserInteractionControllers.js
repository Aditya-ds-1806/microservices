import mongoose from 'mongoose';
import { UserInteraction } from '../models/UserInteraction.js';

export default class UserInteractionControllers {
    static async readReads(req, res) {
        const { contentId } = req.params;
        const result = await UserInteraction
            .aggregate()
            .match({ contentId: mongoose.Types.ObjectId(contentId) })
            .project({ reads: { $size: '$reads' } })
            .exec();
        res.send({
            status: 200,
            data: {
                contentId,
                reads: result?.[0]?.reads ?? 0,
            },
        });
    }

    static async updateReads(req, res) {
        const { contentId } = req.params;
        const userId = mongoose.Types.ObjectId(req.query.userId);
        const reads = await UserInteraction.findOneAndUpdate({ contentId }, {
            $addToSet: { reads: userId },
        }, { new: true, upsert: true });
        res.send({
            status: 200,
            data: reads,
        });
    }

    static async readLikes(req, res) {
        const { contentId } = req.params;
        const result = await UserInteraction
            .aggregate()
            .match({ contentId: mongoose.Types.ObjectId(contentId) })
            .project({ likes: { $size: '$likes' } })
            .exec();
        res.send({
            status: 200,
            data: {
                contentId,
                likes: result?.[0]?.likes ?? 0,
            },
        });
    }

    static async updateLikes(req, res) {
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
            status: 200,
            data: likes,
        });
    }

    static async readStats(req, res) {
        const stats = await UserInteraction.aggregate().match({}).project({ likes: { $size: '$likes' }, reads: { $size: '$reads' }, contentId: 1 }).exec();
        const topMetric = stats.reduce((acc, { likes, reads, contentId }) => {
            acc[contentId] = likes + reads;
            return acc;
        }, {});
        res.send({
            status: 200,
            data: topMetric,
        });
    }
}
