import { sign } from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import { getRepository } from 'typeorm';
import User from '../models/User';
import config from '../config/auth';
import AppError from '../errors/AppError';

interface Request {
  email: string;
  password: string;
}

interface Response {
  token: string;
  user: User;
}

export default class CreateSessionService {
  public async execute({ email, password }: Request): Promise<Response> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError('Wrong email or password', 401);
    }

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new AppError('Wrong email or password', 401);
    }

    const { secret, expiresIn } = config.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return { token, user };
  }
}
