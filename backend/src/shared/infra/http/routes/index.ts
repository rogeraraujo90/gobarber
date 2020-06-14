import { Router } from 'express';
import usersRouter from '@modules/user/infra/http/routes/users.routes';
import sessionsRouter from '@modules/user/infra/http/routes/sessions.routes';
import appointmentsRouter from '@modules/appointments/infra/http/routes/appointments.routes';
import passwordRouter from '@modules/user/infra/http/routes/password.routes';

const routes = Router();

routes.use('/appointments', appointmentsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/passwords', passwordRouter);

export default routes;
