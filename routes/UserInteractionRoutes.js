import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import UserInteractionMiddleware from '../middleware/UserInteraction.js';
import UserInteractionControllers from '../controllers/UserInteractionControllers.js';

dotenv.config({ path: 'routes/.env' });

const UserInteractionRouter = new Router();
const {
    existsContent, existsUser, checkTOTP, errorHandler,
} = UserInteractionMiddleware;
const {
    readReads, updateReads, readLikes, updateLikes, readStats,
} = UserInteractionControllers;

UserInteractionRouter.get('/content/reads/:contentId', asyncHandler(existsContent), asyncHandler(readReads));
UserInteractionRouter.put('/content/reads/:contentId', asyncHandler(existsUser), asyncHandler(existsContent), asyncHandler(updateReads));
UserInteractionRouter.get('/content/likes/:contentId', asyncHandler(existsContent), asyncHandler(readLikes));
UserInteractionRouter.put('/content/likes/:contentId', asyncHandler(existsUser), asyncHandler(existsContent), asyncHandler(updateLikes));
UserInteractionRouter.get('/content/stats', checkTOTP, asyncHandler(readStats));

UserInteractionRouter.use(errorHandler);

export default UserInteractionRouter;
