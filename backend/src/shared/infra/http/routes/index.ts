import { Router } from 'express';
import usersRouter from '@modules/user/infra/http/routes/users.routes';
import sessionsRouter from '@modules/user/infra/http/routes/sessions.routes';
import appointmentsRouter from '@modules/appointments/infra/http/routes/appointments.routes';

const routes = Router();

routes.use('/appointments', appointmentsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);

export default routes;
