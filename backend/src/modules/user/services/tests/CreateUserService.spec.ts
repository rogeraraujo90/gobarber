import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/user/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@shared/providers/hash/fakes/FakeHashProvider';
import CreateUserService from '../CreateUserService';

let fakeRepository: FakeUsersRepository;
let hashProvider: FakeHashProvider;
let service: CreateUserService;
let userData: {
  name: string;
  email: string;
  password: string;
};

describe('Create Appointment', () => {
  beforeEach(() => {
    fakeRepository = new FakeUsersRepository();
    hashProvider = new FakeHashProvider();
    service = new CreateUserService(fakeRepository, hashProvider);
    userData = {
      name: 'Arya Stark',
      email: 'arya@gobarber.com',
      password: '123456',
    };
  });

  it('should be able to create a new User', async () => {
    const user = await service.execute(userData);

    expect(user).toHaveProperty('id');
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
    expect(user.password).toBe(userData.password);
  });

  it("shouldn't be able to create a new User with an existent email", async () => {
    await service.execute(userData);

    expect(service.execute(userData)).rejects.toBeInstanceOf(AppError);
  });
});
