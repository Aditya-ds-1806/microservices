import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import { rateLimit } from 'express-rate-limit';
import dotenv from 'dotenv';
import UserRouter from '../routes/UserRoutes.js';

dotenv.config();

export default class UserService {
    constructor(port) {
        this.port = port;
    }

    register() {
        const app = express();

        app.use(helmet());
        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(xss());
        app.use(mongoSanitize());
        app.use(rateLimit());

        app.use(UserRouter);

        return app.listen(this.port, process.env.IP, () => {
            const { HOST } = process.env;
            console.log(`User service started: http://${HOST}:${this.port}`);
        });
    }
}
