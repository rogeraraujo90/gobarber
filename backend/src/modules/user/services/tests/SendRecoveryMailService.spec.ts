import 'reflect-metadata';
import FakeUsersRepository from '@modules/user/repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/providers/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import FakeResetPassowrdTokenRepository from '@modules/user/repositories/fakes/FakeResetPasswordTokenRepository';
import SendRecoveryMailService from '../SendRecoveryMailService';

let fakeRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeResetPasswordTokenRepository: FakeResetPassowrdTokenRepository;
let service: SendRecoveryMailService;

describe('Send Recovery Mail', () => {
  beforeEach(() => {
    fakeRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeResetPasswordTokenRepository = new FakeResetPassowrdTokenRepository();
    service = new SendRecoveryMailService(
      fakeRepository,
      fakeMailProvider,
      fakeResetPasswordTokenRepository
    );
  });

  it('should be able to send a recovery password mail', async () => {
    const mailData = { email: 'arya@gobarber.com' };

    await fakeRepository.create({
      email: mailData.email,
      password: '123456',
      name: 'Arya Stark',
    });

    const sendMailMethod = jest.spyOn(fakeMailProvider, 'sendMail');
    const findByMailMethod = jest.spyOn(fakeRepository, 'findByEmail');

    await service.execute(mailData);

    expect(sendMailMethod).toHaveBeenCalledTimes(1);
    expect(sendMailMethod).toHaveBeenCalledWith(
      mailData.email,
      'Recover password request received.'
    );
    expect(findByMailMethod).toHaveBeenCalledTimes(1);
    expect(findByMailMethod).toHaveBeenCalledWith(mailData.email);
  });

  it('should not be able to recovery password for an user that does not exists', async () => {
    const mailData = { email: 'notregistered@gobarber.com' };

    await expect(service.execute(mailData)).rejects.toBeInstanceOf(AppError);
  });

  it('should create a recovery password token', async () => {
    const createMethod = jest.spyOn(fakeResetPasswordTokenRepository, 'create');
    const mailData = { email: 'notregistered@gobarber.com' };
    const user = await fakeRepository.create({
      email: mailData.email,
      password: '123456',
      name: 'Arya Stark',
    });

    await service.execute(mailData);

    expect(createMethod).toHaveBeenCalledWith(user.id);
  });
});
