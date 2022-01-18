import helmet from 'helmet';
import express from 'express';
import cors from 'cors';
import xss from 'xss-clean';
import { rateLimit } from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import contentRouter from '../routes/ContentRoutes.js';

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
        app.use(xss());
        app.use(mongoSanitize());
        app.use(rateLimit());

        app.use(contentRouter);

        return app.listen(this.port, process.env.IP, () => {
            console.log(`Content service started: http://localhost:${this.port}`);
        });
    }
}
