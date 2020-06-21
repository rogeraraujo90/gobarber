import { Router } from 'express';
import ensureAuthenticated from '@modules/user/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';
import ProvidersDayAvailabilityController from '../controllers/ProvidersDayAvailabilityController';
import ProvidersMonthAvailabilityController from '../controllers/ProvidersMonthAvailabilityController';
import ProvidersDayScheduleController from '../controllers/ProvidersDayScheduleController';

const providersRouter = Router();
const providersController = new ProvidersController();
const providersDayAvailabilityController = new ProvidersDayAvailabilityController();
const providersMonthAvailabilityController = new ProvidersMonthAvailabilityController();
const providersDayScheduleController = new ProvidersDayScheduleController();

providersRouter.use(ensureAuthenticated);
providersRouter.get('/', providersController.index);
providersRouter.get(
  '/:provider_id/day-availability',
  providersDayAvailabilityController.index
);
providersRouter.get(
  '/:provider_id/month-availability',
  providersMonthAvailabilityController.index
);
providersRouter.get('/schedule', providersDayScheduleController.index);

export default providersRouter;
