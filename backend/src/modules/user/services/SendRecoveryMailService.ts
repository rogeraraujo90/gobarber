import { injectable, inject } from 'tsyringe';
import IMailProvider from '@shared/providers/IMailProvider';
import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';
import IResetPasswordTokenRepository from '../repositories/IResetPasswordTokenRepository';

interface IRequest {
  email: string;
}

@injectable()
export default class CreateUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('ResetPassowrdTokenRepository')
    private resetPassowrdTokenRepository: IResetPasswordTokenRepository
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      await this.resetPassowrdTokenRepository.create(user.id);
      await this.mailProvider.sendMail(
        email,
        'Recover password request received.'
      );
    } else {
      throw new AppError('There is no user with the given email');
    }
  }
}
