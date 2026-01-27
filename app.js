import express from 'express';
import { createUserRouter } from "./routes/users.js";
import { userModel } from "./models/usersLocal.js";

export const createApp = () => {

    const app = express();

    app.disable('x-powered-by');
    app.use(express.json());

    app.get('/', (req, res) => {
        res.end('<h1>Main Page</h1>');
    })

    app.use('/users', createUserRouter({ userModel }));
    //Declare endpoints

    return app;
}

