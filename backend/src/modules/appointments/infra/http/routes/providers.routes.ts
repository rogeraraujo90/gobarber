import { Router } from 'express';
import ensureAuthenticated from '@modules/user/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';
import ProvidersDayAvailabilityController from '../controllers/ProvidersDayAvailabilityController';
import ProvidersMonthAvailabilityController from '../controllers/ProvidersMonthAvailabilityController';
import ProvidersDayScheduleController from '../controllers/ProvidersDayScheduleController';
import getProviderDayAvailabilityValidator from '../middlewares/getProviderDayAvailabilityValidator';
import getProviderMonthAvailabilityValidator from '../middlewares/getProviderMonthAvailabilityValidator';
import showScheduleValidator from '../middlewares/showScheduleValidator';

const providersRouter = Router();
const providersController = new ProvidersController();
const providersDayAvailabilityController = new ProvidersDayAvailabilityController();
const providersMonthAvailabilityController = new ProvidersMonthAvailabilityController();
const providersDayScheduleController = new ProvidersDayScheduleController();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.index);

providersRouter.get(
  '/:provider_id/day-availability',
  getProviderDayAvailabilityValidator(),
  providersDayAvailabilityController.index
);

providersRouter.get(
  '/:provider_id/month-availability',
  getProviderMonthAvailabilityValidator(),
  providersMonthAvailabilityController.index
);

providersRouter.get(
  '/schedule',
  showScheduleValidator(),
  providersDayScheduleController.index
);

export default providersRouter;
