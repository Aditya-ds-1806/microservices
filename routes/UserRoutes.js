import { Router } from 'express';
import UserMiddleware from '../middleware/User.js';
import UserController from '../controllers/UserControllers.js';

const { existsUser } = UserMiddleware;
const {
    createUser, readUser, updateUser, deleteUser,
} = UserController;

const UserRouter = new Router();

UserRouter.post('/users', createUser);
UserRouter.get('/users/:userId', existsUser, readUser);
UserRouter.put('/users/:userId', existsUser, updateUser);
UserRouter.delete('/users/:userId', existsUser, deleteUser);

export default UserRouter;
