import { Router } from 'express';
import PassowrdsController from '../controllers/PasswordsController';
import forgotPasswordValidator from '../middlewares/validators/forgotPasswordValidator';
import resetPasswordValidator from '../middlewares/validators/resetPasswordValidator';

const passwordRouter = Router();
const passwordsController = new PassowrdsController();

passwordRouter.post(
  '/forgot',
  forgotPasswordValidator(),
  passwordsController.forgot
);

passwordRouter.post(
  '/reset',
  resetPasswordValidator(),
  passwordsController.reset
);

export default passwordRouter;
