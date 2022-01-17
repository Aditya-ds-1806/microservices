import { User } from '../models/User.js';

export default class UserController {
    static async createUser(req, res) {
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
    }

    static async readUser(req, res) {
        const { userId } = req.params;
        const user = await User.findById(userId);
        res.send({
            status: 'success',
            data: user,
        });
    }

    static async updateUser(req, res) {
        const { userId } = req.params;
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
        res.send({
            status: 'success',
            data: updatedUser,
        });
    }

    static async deleteUser(req, res) {
        const { userId } = req.params;
        const deletedUser = await User.findByIdAndDelete(userId);
        res.send({
            status: 'success',
            data: deletedUser,
        });
    }
}
