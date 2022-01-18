import helmet from 'helmet';
import express from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import UserInteractionRouter from '../routes/UserInteractionRoutes.js';

export default class UserInteractionService {
    constructor(port) {
        this.port = port;
    }

    register() {
        const app = express();

        app.use(helmet());
        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(mongoSanitize());
        app.use(rateLimit());

        app.use(UserInteractionRouter);

        app.get('*', (req, res) => res.send('404 Not Found!'));

        return app.listen(this.port, process.env.IP, () => {
            console.log(`User service started: http://localhost:${this.port}`);
        });
    }
}
