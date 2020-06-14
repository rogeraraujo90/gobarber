import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/user/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@shared/providers/hash/fakes/FakeHashProvider';
import UpdateProfileService from '../UpdateProfileService';

let fakeRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let service: UpdateProfileService;

describe('Update user profile', () => {
  beforeEach(() => {
    fakeRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    service = new UpdateProfileService(fakeRepository, fakeHashProvider);
  });

  it('should be able to update the user name', async () => {
    const userData = {
      name: 'Arya Stark',
      email: 'arya@gobarber.com',
      password: '123456',
    };

    const createdUser = await fakeRepository.create(userData);
    const updatedUser = await service.execute({
      userId: createdUser.id,
      name: 'No one',
      email: 'arya@gobarber.com',
    });

    expect(updatedUser.name).toBe('No one');
  });

  it('should be able to update the user email', async () => {
    const userData = {
      name: 'Arya Stark',
      email: 'arya@gobarber.com',
      password: '123456',
    };

    const createdUser = await fakeRepository.create(userData);
    const updatedUser = await service.execute({
      userId: createdUser.id,
      name: 'Arya Stark',
      email: 'noone@gobarber.com',
    });

    expect(updatedUser.email).toBe('noone@gobarber.com');
  });

  it('should be able to update the user password', async () => {
    const userData = {
      name: 'Arya Stark',
      email: 'arya@gobarber.com',
      password: '123456',
    };

    const createdUser = await fakeRepository.create(userData);
    const updatedUser = await service.execute({
      userId: createdUser.id,
      name: 'Arya Stark',
      email: 'arya@gobarber.com',
      oldPassword: '123456',
      password: 'new password',
    });

    expect(updatedUser.password).toBe('new password');
  });

  it('should not be able to update the user password to an already used', async () => {
    await fakeRepository.create({
      name: 'Arya Stark',
      email: 'arya@gobarber.com',
      password: '123456',
    });

    const userData = {
      name: 'Jon Snow',
      email: 'jon@gobarber.com',
      password: '123456',
    };

    const createdUser = await fakeRepository.create(userData);

    await expect(
      service.execute({
        userId: createdUser.id,
        name: 'Jon Snow',
        email: 'arya@gobarber.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the user password without inform the old password', async () => {
    const userData = {
      name: 'Arya Stark',
      email: 'arya@gobarber.com',
      password: '123456',
    };

    const createdUser = await fakeRepository.create(userData);
    await expect(
      service.execute({
        userId: createdUser.id,
        name: 'Arya Stark',
        email: 'arya@gobarber.com',
        password: 'new password',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the user password without inform the correct old password', async () => {
    const userData = {
      name: 'Arya Stark',
      email: 'arya@gobarber.com',
      password: '123456',
    };

    const createdUser = await fakeRepository.create(userData);
    await expect(
      service.execute({
        userId: createdUser.id,
        name: 'Arya Stark',
        email: 'arya@gobarber.com',
        oldPassword: 'wrong old password',
        password: 'new password',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update data of an user that does not exists', async () => {
    const userData = {
      name: 'Arya Stark',
      email: 'arya@gobarber.com',
      password: '123456',
    };

    await fakeRepository.create(userData);
    await expect(
      service.execute({
        userId: 'wrong user id',
        name: 'Jon Snow',
        email: 'jon@gobarber.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
