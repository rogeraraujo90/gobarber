import { Router } from 'express';
import CreateSessionService from '../services/CreateSessionService';

const sessionsRouter = Router();

sessionsRouter.post('/', async ({ body }, response) => {
  try {
    const { email, password } = body;
    const createSessionService = new CreateSessionService();

    const token = await createSessionService.execute({ email, password });

    return response.json({ token });
  } catch (error) {
    return response.status(400).json({ message: error.message });
  }
});

export default sessionsRouter;
