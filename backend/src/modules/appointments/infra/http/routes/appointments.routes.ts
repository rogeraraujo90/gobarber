import { Router } from 'express';
import ensureAuthenticated from '@modules/user/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';
import createAppointmentValidator from '../middlewares/createAppointmentValidator';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentsRouter.use(ensureAuthenticated);
appointmentsRouter.get('/', appointmentsController.index);
appointmentsRouter.post(
  '/',
  createAppointmentValidator(),
  appointmentsController.create
);

export default appointmentsRouter;
