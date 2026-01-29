import express from 'express';
import path from "node:path";
import { createViewRouter } from "./routes/view.routes.js";
import { createAuthRouter } from "./routes/auth.routes.js";
import { userModel } from "./models/user.model.js";

export const createApp = () => {

    const app = express();

    app.disable('x-powered-by');
    // Express middleware to use JSON files natively
    app.use(express.json());
    // Express middleware to serve files from a folder
    app.use(express.static(path.join(path.resolve(), 'public')));

    app.use('/', createViewRouter());
    app.use('/api/auth', createAuthRouter({ userModel }));

    return app;
}

