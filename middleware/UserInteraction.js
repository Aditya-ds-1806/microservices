import dotenv from 'dotenv';
import totp from 'totp-generator';
import fetch from 'node-fetch';
import ApiError from './Error.js';

dotenv.config();

const { TOTP_KEY } = process.env;

export default class UserInteractionMiddleware {
    static checkTOTP(req, res, next) {
        const receivedTotp = req.headers['x-totp'];
        const totpTimestamp = req.headers['x-totp-generation-timestamp'];
        const calculatedTotp = totp(TOTP_KEY, { timestamp: totpTimestamp });
        if (calculatedTotp === receivedTotp) {
            next();
        } else {
            next(new ApiError(401, { receivedTotp }, 'Authentication failure! Invalid TOTP received.'));
        }
    }

    static async existsUser(req, res, next) {
        const { userId } = req.query;
        const response = await (await fetch(`http://localhost:3002/users/${userId}`)).json();
        if (response.data) {
            next();
            return;
        }
        next(new ApiError(response.status, response.data, response.message));
    }

    static async existsContent(req, res, next) {
        const { contentId } = req.params;
        const response = await (await fetch(`http://localhost:3000/content/${contentId}`)).json();
        if (response.data) {
            next();
            return;
        }
        next(new ApiError(response.status, response.data, response.message));
    }

    // eslint-disable-next-line no-unused-vars
    static errorHandler(err, req, res, next) {
        console.log(err);
        res.send({
            status: (err.name === 'CastError' || err.name === 'ValidationError') ? 400 : (err.status ?? 500),
            message: err.message ?? 'Internal server error',
            data: err.data ?? null,
        });
    }
}
