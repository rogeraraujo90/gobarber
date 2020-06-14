import 'reflect-metadata';
import FakeUsersRepository from '@modules/user/repositories/fakes/FakeUsersRepository';
import FakeResetPasswordTokenRepository from '@modules/user/repositories/fakes/FakeResetPasswordTokenRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@shared/providers/hash/fakes/FakeHashProvider';
import ResetPasswordService from '../ResetPasswordService';

let fakeRepository: FakeUsersRepository;
let fakeResetPasswordTokenRepository: FakeResetPasswordTokenRepository;
let fakeHashProvider: FakeHashProvider;
let service: ResetPasswordService;

describe('Reset password', () => {
  beforeEach(() => {
    fakeRepository = new FakeUsersRepository();
    fakeResetPasswordTokenRepository = new FakeResetPasswordTokenRepository();
    fakeHashProvider = new FakeHashProvider();

    service = new ResetPasswordService(
      fakeRepository,
      fakeResetPasswordTokenRepository,
      fakeHashProvider
    );
  });

  it('should be able to reset a password', async () => {
    const user = await fakeRepository.create({
      email: 'arya@gobarber.com',
      password: '123456',
      name: 'Arya Stark',
    });
    const token = await fakeResetPasswordTokenRepository.create(user.id);
    const newPassword = 'I am a new password';
    const createHashMethod = jest.spyOn(fakeHashProvider, 'createHash');

    await service.execute({
      token: token.id,
      password: newPassword,
    });

    const updatedUser = await fakeRepository.findById(user.id);

    expect(updatedUser?.password).toBe(newPassword);
    expect(createHashMethod).toHaveBeenCalledTimes(1);
  });

  it('should not be able to reset with a token that does not exists', async () => {
    await expect(
      service.execute({
        token: 'I am a invalid token',
        password: 'I am a new password',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset a password for a user that does not exists', async () => {
    const token = await fakeResetPasswordTokenRepository.create('invalid-id');

    await expect(
      service.execute({
        token: token.id,
        password: 'I am a new password',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset a password after two hours of the request', async () => {
    const user = await fakeRepository.create({
      email: 'arya@gobarber.com',
      password: '123456',
      name: 'Arya Stark',
    });
    const token = await fakeResetPasswordTokenRepository.create(user.id);
    const newPassword = 'I am a new password';

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const now = new Date();

      return now.setDate(now.getDate() + 1);
    });

    await expect(
      service.execute({
        token: token.id,
        password: newPassword,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
