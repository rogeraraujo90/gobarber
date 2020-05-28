import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';
import IResetPasswordTokenRepository from '../repositories/IResetPasswordTokenRepository';

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
    private resetPasswordTokenRepository: IResetPasswordTokenRepository
  ) {}

  public async execute({ password, token }: IRequest): Promise<void> {
    const resetPasswordToken = await this.resetPasswordTokenRepository.findById(
      token
    );

    if (!resetPasswordToken) {
      throw new AppError('Reset token not found.');
    }

    const user = await this.userRepository.findById(resetPasswordToken.userId);

    if (!user) {
      throw new AppError('User not found.');
    }

    user.password = password;
    this.userRepository.save(user);
  }
}
