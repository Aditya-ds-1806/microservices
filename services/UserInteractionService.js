import express from 'express';
import UserInteractionRouter from '../routes/UserInteractionRoutes.js';

export default class UserInteractionService {
    constructor(port) {
        this.port = port;
    }

    register() {
        const app = express();

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(UserInteractionRouter);

        app.get('*', (req, res) => res.send('404 Not Found!'));

        return app.listen(this.port, process.env.IP, () => {
            console.log(`User service started: http://localhost:${this.port}`);
        });
    }
}
