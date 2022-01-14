import express from 'express';

import UserInteractionRouter from './routes/UserInteractionRoutes.js';
import ContentRouter from './routes/ContentRoutes.js';
import UserRouter from './routes/UserRoutes.js';

const contentService = express();
const userInteractionService = express();
const userService = express();

contentService.use(express.json());
contentService.use(express.urlencoded({ extended: true }));
contentService.use(ContentRouter);

userInteractionService.use(express.json());
userInteractionService.use(express.urlencoded({ extended: true }));
userInteractionService.use(UserInteractionRouter);

userService.use(express.json());
userService.use(express.urlencoded({ extended: true }));
userService.use(UserRouter);

contentService.listen(3000, process.env.IP, () => {
    console.log('Content service started: http://localhost:3000');
});

userInteractionService.listen(3001, process.env.IP, () => {
    console.log('User interaction service started: http://localhost:3001');
});

userService.listen(3002, process.env.IP, () => {
    console.log('User service started: http://localhost:3002');
});
