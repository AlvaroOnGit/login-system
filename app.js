import express from 'express';

export const createApp = () => {

    const app = express();

    app.disable('x-powered-by');
    app.use(express.json());

    app.get('/', (req, res) => {
        res.end('<h1>Main Page</h1>');
    })

    return app;
}

