import { Router } from 'express';
import { UserController } from '../controllers/users.js';

export const createUserRouter = ({ userModel }) => {

    const userRouter = Router();

    const userController = new UserController({ userModel });

    //Declare endpoints
    userRouter.post('/login', (req, res) => {});
    userRouter.post('/register', userController.createUser);
    userRouter.post('/logout', (req, res) => {})
    userRouter.get('/protected', (req, res) => {})

    return userRouter;
}