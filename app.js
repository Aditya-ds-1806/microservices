import express from 'express';

const app = express();

app.get('/', async (req, res) => {
    res.send('Hello world!');
});

app.listen(process.env.PORT || 3000, process.env.IP, () => {
    console.log(`Server started: http://localhost:${process.env.PORT || 3000}`);
});
