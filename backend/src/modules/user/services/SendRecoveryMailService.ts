import { injectable, inject } from 'tsyringe';
import path from 'path';
import IMailProvider from '@shared/providers/mail/IMailProvider';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/providers/storage/IStorageProvider';
import IUserRepository from '../repositories/IUserRepository';
import IResetPasswordTokenRepository from '../repositories/IResetPasswordTokenRepository';

interface IRequest {
  email: string;
}

@injectable()
export default class SendRecoveryMailService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('ResetPasswordTokenRepository')
    private resetPasswordTokenRepository: IResetPasswordTokenRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      const { id } = await this.resetPasswordTokenRepository.create(user.id);
      const forgotMailTemplatePath = path.resolve(
        __dirname,
        '..',
        'views',
        'forgot_password_mail.hbs'
      );

      await this.mailProvider.sendMail({
        to: {
          name: user.name,
          email: user.email,
        },
        subject: '[GoBarber] Recuperação de senha',
        templateData: {
          template: await this.storageProvider.readFile(forgotMailTemplatePath),
          variables: {
            name: user.name,
            link: `http://localhost:3000/reset_password?token=${id}`,
          },
        },
      });
    } else {
      throw new AppError('There is no user with the given email');
    }
  }
}
