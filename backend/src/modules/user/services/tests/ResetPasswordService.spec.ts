import 'reflect-metadata';
import FakeUsersRepository from '@modules/user/repositories/fakes/FakeUsersRepository';
import FakeResetPassowrdTokenRepository from '@modules/user/repositories/fakes/FakeResetPasswordTokenRepository';
import AppError from '@shared/errors/AppError';
import ResetPasswordService from '../ResetPasswordService';

let fakeRepository: FakeUsersRepository;
let fakeResetPasswordTokenRepository: FakeResetPassowrdTokenRepository;
let service: ResetPasswordService;

describe('Reset password', () => {
  beforeEach(() => {
    fakeRepository = new FakeUsersRepository();
    fakeResetPasswordTokenRepository = new FakeResetPassowrdTokenRepository();
    service = new ResetPasswordService(
      fakeRepository,
      fakeResetPasswordTokenRepository
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

    await service.execute({
      token: token.id,
      password: newPassword,
    });

    const updatedUser = await fakeRepository.findById(user.id);

    expect(updatedUser?.password).toBe(newPassword);
  });

  it('should not be able to reset with a token that does not exists', async () => {
    const newPassword = 'I am a new password';

    await expect(
      service.execute({
        token: 'I am a invalid token',
        password: newPassword,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset a password for a user that does not exists', async () => {
    const token = await fakeResetPasswordTokenRepository.create('invalid-id');
    const newPassword = 'I am a new password';

    await expect(
      service.execute({
        token: token.id,
        password: newPassword,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
