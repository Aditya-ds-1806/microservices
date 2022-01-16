import dotenv from 'dotenv';
import totp from 'totp-generator';

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
}
