import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/user/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/user/providers/fakes/FakeHashProvider';
import CreateSessionService from '../CreateSessionService';
import CreateUserService from '../CreateUserService';

describe('Create Session', () => {
  it('should be able to authenticate an user', async () => {
    const fakeRepository = new FakeUsersRepository();
    const hashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeRepository,
      hashProvider
    );
    const service = new CreateSessionService(fakeRepository, hashProvider);

    const userData = {
      name: 'Arya Stark',
      email: 'arya@gobarber.com',
      password: '123456',
    };

    const createdUser = await createUserService.execute(userData);

    const session = await service.execute({
      email: 'arya@gobarber.com',
      password: '123456',
    });

    expect(session).toHaveProperty('token');
    expect(session).toHaveProperty('user');
    expect(session.user).toEqual(createdUser);
  });

  it("shouldn't be able to authenticate an user not registered", async () => {
    const fakeRepository = new FakeUsersRepository();
    const hashProvider = new FakeHashProvider();
    const service = new CreateSessionService(fakeRepository, hashProvider);

    const userData = {
      email: 'arya@gobarber.com',
      password: '123456',
    };

    expect(service.execute(userData)).rejects.toBeInstanceOf(AppError);
  });

  it("shouldn't be able to authenticate an user with wrong password", async () => {
    const fakeRepository = new FakeUsersRepository();
    const hashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeRepository,
      hashProvider
    );
    const service = new CreateSessionService(fakeRepository, hashProvider);

    const userData = {
      name: 'Arya Stark',
      email: 'arya@gobarber.com',
      password: '123456',
    };

    await createUserService.execute(userData);

    expect(
      service.execute({
        email: 'arya@gobarber.com',
        password: '1234',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
