// Handles routing for serving views
import { Router } from 'express';
import { ViewController } from "../controllers/view.controller.js";

export const createViewRouter = () => {

    const viewRouter = Router();
    const viewController = new ViewController();

    //declare endpoints
    viewRouter.get('/', viewController.index)
    viewRouter.get('/auth', viewController.login);
    viewRouter.get('/protected', viewController.protected);

    return viewRouter;
}