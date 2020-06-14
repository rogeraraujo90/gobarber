import { Router } from 'express';
import PassowrdsController from '../controllers/PasswordsController';

const passwordRouter = Router();
const passwordsController = new PassowrdsController();

passwordRouter.post('/forgot', passwordsController.forgot);
passwordRouter.post('/reset', passwordsController.reset);

export default passwordRouter;
