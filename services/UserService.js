import express from 'express';
import UserRouter from '../routes/UserRoutes.js';

export default class UserService {
    constructor(port) {
        this.port = port;
    }

    register() {
        const app = express();

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(UserRouter);

        app.get('*', (req, res) => res.send('404 Not Found!'));

        return app.listen(this.port, process.env.IP, () => {
            console.log(`User service started: http://localhost:${this.port}`);
        });
    }
}
