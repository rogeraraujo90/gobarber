import { sign } from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import { getRepository } from 'typeorm';
import User from '../models/User';
import config from '../config/auth';

interface Request {
  email: string;
  password: string;
}

export default class CreateSessionService {
  public async execute({ email, password }: Request): Promise<string> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error('Wrong email or password');
    }

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new Error('Wrong email or password');
    }

    const { secret, expiresIn } = config.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return token;
  }
}
