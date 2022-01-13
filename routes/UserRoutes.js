import { Router } from 'express';
import { User } from '../models/User.js';

const UserRouter = new Router();

UserRouter.post('/users', async (req, res) => {
    try {
        const {
            firstName, lastName, emailId, phoneNumber,
        } = req.body;
        const newUser = await User.create({
            firstName,
            lastName,
            emailId,
            phoneNumber,
        });
        res.send({
            status: 'success',
            data: newUser,
        });
    } catch (err) {
        console.log(err);
        res.send({
            status: 'error',
            message: err.message,
        });
    }
});

UserRouter.get('/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        res.send({
            status: 'success',
            data: user,
        });
    } catch (err) {
        console.log(err);
        res.send({
            status: 'error',
            message: err.message,
        });
    }
});

UserRouter.put('/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
        res.send({
            status: 'success',
            data: updatedUser,
        });
    } catch (err) {
        console.log(err);
        res.send({
            status: 'error',
            message: err.message,
        });
    }
});

UserRouter.delete('/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const deletedUser = await User.findByIdAndDelete(userId);
        res.send({
            status: 'success',
            data: deletedUser,
        });
    } catch (err) {
        console.log(err);
        res.send({
            status: 'error',
            message: err.message,
        });
    }
});

export default UserRouter;
