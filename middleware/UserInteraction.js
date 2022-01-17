import dotenv from 'dotenv';
import totp from 'totp-generator';
import fetch from 'node-fetch';

dotenv.config({ path: 'routes/.env' });

const { TOTP_KEY } = process.env;

export default class UserInteractionMiddleware {
    static checkTOTP(req, res, next) {
        const receivedTotp = req.headers['x-totp'];
        const totpTimestamp = req.headers['x-totp-generation-timestamp'];
        const calculatedTotp = totp(TOTP_KEY, { timestamp: totpTimestamp });
        if (calculatedTotp === receivedTotp) {
            next();
        } else {
            res.send({
                status: 'fail',
                data: {
                    receivedTotp,
                },
                message: 'Authentication failure! Invalid TOTP received.',
            });
        }
    }

    static async existsUser(req, res, next) {
        try {
            const { userId } = req.query;
            const response = await (await fetch(`http://localhost:3002/users/${userId}`)).json();
            if (response.data) {
                next();
                return;
            }
            res.send(response);
        } catch (err) {
            console.log(err);
            res.send({
                status: 'error',
                message: err.message,
            });
        }
    }

    static async existsContent(req, res, next) {
        try {
            const { contentId } = req.params;
            const response = await (await fetch(`http://localhost:3000/content/${contentId}`)).json();
            if (response.data) {
                next();
                return;
            }
            res.send(response);
        } catch (err) {
            console.log(err);
            res.send({
                status: 'error',
                message: err.message,
            });
        }
    }
}
