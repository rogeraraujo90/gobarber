import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/user/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@shared/providers/hash/fakes/FakeHashProvider';
import CreateSessionService from '../CreateSessionService';

let fakeRepository: FakeUsersRepository;
let hashProvider: FakeHashProvider;
let service: CreateSessionService;

describe('Create Session', () => {
  beforeEach(() => {
    fakeRepository = new FakeUsersRepository();
    hashProvider = new FakeHashProvider();
    service = new CreateSessionService(fakeRepository, hashProvider);
  });

  it('should be able to authenticate an user', async () => {
    const userData = {
      name: 'Arya Stark',
      email: 'arya@gobarber.com',
      password: '123456',
    };
    const createdUser = await fakeRepository.create(userData);
    const session = await service.execute({
      email: 'arya@gobarber.com',
      password: '123456',
    });

    expect(session).toHaveProperty('token');
    expect(session).toHaveProperty('user');
    expect(session.user).toEqual(createdUser);
  });

  it("shouldn't be able to authenticate an user not registered", async () => {
    const userData = {
      email: 'arya@gobarber.com',
      password: '123456',
    };

    expect(service.execute(userData)).rejects.toBeInstanceOf(AppError);
  });

  it("shouldn't be able to authenticate an user with wrong password", async () => {
    const userData = {
      name: 'Arya Stark',
      email: 'arya@gobarber.com',
      password: '123456',
    };

    await fakeRepository.create(userData);

    await expect(
      service.execute({
        email: 'arya@gobarber.com',
        password: '1234',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
