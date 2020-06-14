import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/user/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@shared/providers/hash/fakes/FakeHashProvider';
import CreateUserService from '../CreateUserService';

describe('Create Appointment', () => {
  it('should be able to create a new User', async () => {
    const fakeRepository = new FakeUsersRepository();
    const hashProvider = new FakeHashProvider();
    const service = new CreateUserService(fakeRepository, hashProvider);

    const userData = {
      name: 'Arya Stark',
      email: 'arya@gobarber.com',
      password: '123456',
    };

    const user = await service.execute(userData);

    expect(user).toHaveProperty('id');
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
    expect(user.password).toBe(userData.password);
  });

  it("shouldn't be able to create a new User with an existent email", async () => {
    const fakeRepository = new FakeUsersRepository();
    const hashProvider = new FakeHashProvider();
    const service = new CreateUserService(fakeRepository, hashProvider);

    const userData = {
      name: 'Arya Stark',
      email: 'arya@gobarber.com',
      password: '123456',
    };

    await service.execute(userData);

    expect(service.execute(userData)).rejects.toBeInstanceOf(AppError);
  });
});
