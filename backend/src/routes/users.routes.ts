import { hash } from 'bcryptjs';
import { Router } from 'express';
import multer from 'multer';
import CreateUserService from '../services/CreateUserService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import uploadConfig from '../config/upload';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async ({ body }, response) => {
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
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const avatarFileName = request.file.filename;
    const updateUserAvatarService = new UpdateUserAvatarService();

    const user = await updateUserAvatarService.execute({
      userId: request.user.id,
      avatarFileName,
    });

    delete user.password;

    return response.json(user);
  }
);

export default usersRouter;
