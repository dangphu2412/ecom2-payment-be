import express from 'express';

const app = express()

app.get('/', (req, res) => {
    return res.status(200).send('Hello World 3!');
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
