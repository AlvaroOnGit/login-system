import express from 'express';
import { createViewRouter } from "./routes/view.routes.js";
import { createAuthRouter } from "./routes/auth.routes.js";
import { userModel } from "./models/user.model.js";

export const createApp = () => {

    const app = express();

    app.disable('x-powered-by');
    app.use(express.json());

    app.use('/', createViewRouter());
    app.use('/api/auth', createAuthRouter({ userModel }));

    return app;
}

