import { Router } from 'express';
import dotenv from 'dotenv';
import UserInteractionMiddleware from '../middleware/UserInteraction.js';
import UserInteractionControllers from '../controllers/UserInteractionControllers.js';

dotenv.config({ path: 'routes/.env' });

const UserInteractionRouter = new Router();
const { existsContent, existsUser, checkTOTP } = UserInteractionMiddleware;
const {
    readReads, updateReads, readLikes, updateLikes, readStats,
} = UserInteractionControllers;

UserInteractionRouter.get('/content/reads/:contentId', existsContent, readReads);
UserInteractionRouter.put('/content/reads/:contentId', existsUser, existsContent, updateReads);
UserInteractionRouter.get('/content/likes/:contentId', existsContent, readLikes);
UserInteractionRouter.put('/content/likes/:contentId', existsUser, existsContent, updateLikes);
UserInteractionRouter.get('/content/stats', checkTOTP, readStats);

export default UserInteractionRouter;
