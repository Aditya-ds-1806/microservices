import express from 'express';

import UserInteractionRouter from './routes/UserInteractionRoutes.js';
import ContentRouter from './routes/ContentRoutes.js';
import UserRouter from './routes/UserRoutes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(UserInteractionRouter);
app.use(ContentRouter);
app.use(UserRouter);

app.get('/', async (req, res) => {
    res.send('Hello world!');
});

app.listen(process.env.PORT || 3000, process.env.IP, () => {
    console.log(`Server started: http://localhost:${process.env.PORT || 3000}`);
});
