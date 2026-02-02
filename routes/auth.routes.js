// Handles routing for authentication (User login/logout/register)
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';

export const createAuthRouter = ({ userModel }) => {

    const authRouter = Router();
    const authController = new AuthController({ userModel });

    //Declare endpoints
    authRouter.post('/login', authController.logUser);
    authRouter.post('/register', authController.createUser);
    authRouter.post('/logout', authController.logout);
    authRouter.get('/session', authController.authSession);

    return authRouter;
}