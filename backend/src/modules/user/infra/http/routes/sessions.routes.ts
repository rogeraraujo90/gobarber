import { Router } from 'express';
import SessionsController from '../controllers/SessonsController';
import createSessionValidator from '../middlewares/validators/createSessionValidator';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post('/', createSessionValidator(), sessionsController.create);

export default sessionsRouter;
