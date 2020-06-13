import { injectable, inject } from 'tsyringe';
import { differenceInHours } from 'date-fns';
import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';
import IResetPasswordTokenRepository from '../repositories/IResetPasswordTokenRepository';
import IHashProvider from '../providers/IHashProvider';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
export default class ResetPasswordService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('ResetPassowrdTokenRepository')
    private resetPasswordTokenRepository: IResetPasswordTokenRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({ password, token }: IRequest): Promise<void> {
    const resetPasswordToken = await this.resetPasswordTokenRepository.findById(
      token
    );

    if (!resetPasswordToken) {
      throw new AppError('Reset token not found.');
    }

    const tokenCreationDate = resetPasswordToken.createdAt;

    if (differenceInHours(Date.now(), tokenCreationDate) > 2) {
      throw new AppError('Token expired.');
    }

    const user = await this.userRepository.findById(resetPasswordToken.userId);

    if (!user) {
      throw new AppError('User not found.');
    }

    user.password = await this.hashProvider.createHash(password);
    this.userRepository.save(user);
  }
}
