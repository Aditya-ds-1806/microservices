import { Router } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UserInteraction } from '../models/UserInteraction.js';
import UserInteractionMiddleware from '../middleware/UserInteraction.js';

dotenv.config({ path: 'routes/.env' });

const UserInteractionRouter = new Router();

UserInteractionRouter.get('/content/reads/:contentId', UserInteractionMiddleware.existsContent, async (req, res) => {
    // retrieve read count
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
});

UserInteractionRouter.put('/content/reads/:contentId', UserInteractionMiddleware.existsUser, UserInteractionMiddleware.existsContent, async (req, res) => {
    // update read count
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
});

UserInteractionRouter.get('/content/likes/:contentId', UserInteractionMiddleware.existsContent, async (req, res) => {
    // retrieve like count
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
});

UserInteractionRouter.put('/content/likes/:contentId', UserInteractionMiddleware.existsUser, UserInteractionMiddleware.existsContent, async (req, res) => {
    // update like count
    try {
        const { contentId } = req.params;
        const { likeState } = req.query;
        const userId = mongoose.Types.ObjectId(req.query.userId);
        const updates = {
            1: { $addToSet: { likes: userId } },
            0: { $pull: { likes: userId } },
        };
        const likes = await UserInteraction.findOneAndUpdate({ contentId }, updates[likeState], {
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
});

UserInteractionRouter.get('/content/stats', UserInteractionMiddleware.checkTOTP, async (req, res) => {
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
});

export default UserInteractionRouter;
