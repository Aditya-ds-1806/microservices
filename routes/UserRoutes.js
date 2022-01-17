import { Router } from 'express';
import UserMiddleware from '../middleware/User.js';

const {
    createUserHandler, readUserHandler, existsUser, updateUserHandler, deleteUserHandler,
} = UserMiddleware;

const UserRouter = new Router();

UserRouter.post('/users', createUserHandler);
UserRouter.get('/users/:userId', existsUser, readUserHandler);
UserRouter.put('/users/:userId', existsUser, updateUserHandler);
UserRouter.delete('/users/:userId', existsUser, deleteUserHandler);

export default UserRouter;
