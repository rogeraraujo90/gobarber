import { sign } from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import { injectable, inject } from 'tsyringe';
import User from '@modules/user/infra/typeorm/entities/User';
import config from '@config/auth';
import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  token: string;
  user: User;
}

@injectable()
export default class CreateSessionService {
  private userRepository: IUserRepository;

  constructor(@inject('UserRepository') userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.userRepository.findByEmail(email);

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
