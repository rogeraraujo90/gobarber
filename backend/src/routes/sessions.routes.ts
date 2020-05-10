import { Router } from 'express';
import CreateSessionService from '../services/CreateSessionService';

const sessionsRouter = Router();

sessionsRouter.post('/', async ({ body }, response) => {
  const { email, password } = body;
  const createSessionService = new CreateSessionService();

  const sessionData = await createSessionService.execute({ email, password });

  return response.json(sessionData);
});

export default sessionsRouter;
