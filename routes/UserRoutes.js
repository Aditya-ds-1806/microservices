import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import UserMiddleware from '../middleware/User.js';
import UserController from '../controllers/UserControllers.js';

const { existsUser, errorHandler } = UserMiddleware;
const {
    createUser, readUser, updateUser, deleteUser,
} = UserController;

const UserRouter = new Router();

UserRouter.post('/users', asyncHandler(createUser));
UserRouter.get('/users/:userId', asyncHandler(existsUser), asyncHandler(readUser));
UserRouter.put('/users/:userId', asyncHandler(existsUser), asyncHandler(updateUser));
UserRouter.delete('/users/:userId', asyncHandler(existsUser), asyncHandler(deleteUser));

UserRouter.use(errorHandler);

export default UserRouter;
