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
            status: 200,
            data: newUser,
        });
    }

    static async readUser(req, res) {
        const { userId } = req.params;
        const user = await User.findById(userId);
        res.send({
            status: 200,
            data: user,
        });
    }

    static async updateUser(req, res) {
        const { userId } = req.params;
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
        res.send({
            status: 200,
            data: updatedUser,
        });
    }

    static async deleteUser(req, res) {
        const { userId } = req.params;
        const deletedUser = await User.findByIdAndDelete(userId);
        res.send({
            status: 200,
            data: deletedUser,
        });
    }
}
