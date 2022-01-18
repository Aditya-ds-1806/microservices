import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import UserInteractionMiddleware from '../middleware/UserInteraction.js';
import UserInteractionControllers from '../controllers/UserInteractionControllers.js';
import ApiError from '../middleware/Error.js';

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
UserInteractionRouter.all('*', (req, res, next) => next(new ApiError(404, null, '404 Not Found!')));

UserInteractionRouter.use(errorHandler);

export default UserInteractionRouter;
