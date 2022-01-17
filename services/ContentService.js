import express from 'express';
import contentRouter from '../routes/ContentRoutes.js';

export default class UserInteractionService {
    constructor(port) {
        this.port = port;
    }

    register() {
        const app = express();

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(contentRouter);

        app.get('*', (req, res) => res.send('404 Not Found!'));

        app.listen(this.port, process.env.IP, () => {
            console.log(`User service started: http://localhost:${this.port}`);
        });
    }
}
