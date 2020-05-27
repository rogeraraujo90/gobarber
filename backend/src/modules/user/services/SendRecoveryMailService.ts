import { injectable, inject } from 'tsyringe';
import IMailProvider from '@shared/providers/IMailProvider';
import IUserRepository from '../repositories/IUserRepository';

interface IRequest {
  email: string;
}

@injectable()
export default class CreateUserService {
  private userRepository: IUserRepository;

  private mailProvider: IMailProvider;

  constructor(
    @inject('UserRepository') userRepository: IUserRepository,
    @inject('MailProvider') mailProvider: IMailProvider
  ) {
    this.userRepository = userRepository;
    this.mailProvider = mailProvider;
  }

  public async execute({ email }: IRequest): Promise<void> {
    this.mailProvider.sendMail(email, 'Recover password request received.');
  }
}
