import { Router } from 'express';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import updateProfileValidator from '../middlewares/validators/updateProfileValidator';
import ProfileController from '../controllers/ProfileController';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAuthenticated);

profileRouter.get('/', profileController.show);
profileRouter.patch('/', updateProfileValidator(), profileController.update);

export default profileRouter;
