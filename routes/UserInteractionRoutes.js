import { Router } from 'express';
import dotenv from 'dotenv';
import UserInteractionMiddleware from '../middleware/UserInteraction.js';

dotenv.config({ path: 'routes/.env' });

const UserInteractionRouter = new Router();
const {
    existsContent, existsUser, checkTOTP,
    readReadsHandler, updateReadsHandler, readLikesHandler, updateLikesHandler, readStatsHandler,
} = UserInteractionMiddleware;

UserInteractionRouter.get('/content/reads/:contentId', existsContent, readReadsHandler);
UserInteractionRouter.put('/content/reads/:contentId', existsUser, existsContent, updateReadsHandler);
UserInteractionRouter.get('/content/likes/:contentId', existsContent, readLikesHandler);
UserInteractionRouter.put('/content/likes/:contentId', existsUser, existsContent, updateLikesHandler);
UserInteractionRouter.get('/content/stats', checkTOTP, readStatsHandler);

export default UserInteractionRouter;
