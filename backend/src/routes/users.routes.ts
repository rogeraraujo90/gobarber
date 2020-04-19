import { hash } from 'bcryptjs';
import { Router } from 'express';
import multer from 'multer';
import CreateUserService from '../services/CreateUserService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import uploadConfig from '../config/upload';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async ({ body }, response) => {
  try {
    const { name, email, password } = body;
    const createUserService = new CreateUserService();

    const cryptedPassword = await hash(password, 8);

    const user = await createUserService.execute({
      name,
      email,
      password: cryptedPassword,
    });

    delete user.password;

    return response.json(user);
  } catch (error) {
    return response.status(400).json({ message: error.message });
  }
});

usersRouter.patch(
  '/avatar',
  upload.single('avatar'),
  ensureAuthenticated,
  (request, response) => {
    console.log(request.file);
    response.json({ message: 'Avatar not saved yet.' });
  }
);

export default usersRouter;
