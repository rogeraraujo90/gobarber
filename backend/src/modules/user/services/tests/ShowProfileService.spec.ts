import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/user/repositories/fakes/FakeUsersRepository';
import ShowProfileService from '../ShowProfileService';

let fakeRepository: FakeUsersRepository;
let service: ShowProfileService;

describe('Show profile', () => {
  beforeEach(() => {
    fakeRepository = new FakeUsersRepository();
    service = new ShowProfileService(fakeRepository);
  });

  it('should be able to show the a profile', async () => {
    const userData = {
      name: 'Arya Stark',
      email: 'arya@gobarber.com',
      password: '123456',
    };

    const createdUser = await fakeRepository.create(userData);
    const profile = await service.execute(createdUser.id);

    expect(profile.name).toBe(userData.name);
    expect(profile.email).toBe(userData.email);
  });

  it('should not be able to show the a profile of a non-existing user', async () => {
    await expect(service.execute('non existing id')).rejects.toBeInstanceOf(
      AppError
    );
  });
});
