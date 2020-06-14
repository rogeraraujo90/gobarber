import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/user/repositories/fakes/FakeUsersRepository';
import FakeDiskStorageProvider from '@shared/providers/storage/fakes/FakeDiskStorageProvider';
import UpdateUserAvatarService from '../UpdateUserAvatarService';

let fakeRepository: FakeUsersRepository;
let fakeDiskStorageProvider: FakeDiskStorageProvider;
let service: UpdateUserAvatarService;

describe('Update user avatar', () => {
  beforeEach(() => {
    fakeRepository = new FakeUsersRepository();
    fakeDiskStorageProvider = new FakeDiskStorageProvider();
    service = new UpdateUserAvatarService(
      fakeRepository,
      fakeDiskStorageProvider
    );
  });

  it('should be able to add an avatar to an user', async () => {
    const userData = {
      name: 'Arya Stark',
      email: 'arya@gobarber.com',
      password: '123456',
    };

    const createdUser = await fakeRepository.create(userData);
    const updatedUser = await service.execute({
      userId: createdUser.id,
      avatarFileName: 'avatar.png',
    });

    expect(updatedUser.avatar).toBe('avatar.png');
  });

  it('should not be able to add an avatar to a not existing user', async () => {
    expect(
      service.execute({
        userId: '1',
        avatarFileName: 'avatar.png',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to replace an avatar to an user', async () => {
    const deleteFileMethod = jest.spyOn(fakeDiskStorageProvider, 'deleteFile');

    const userData = {
      name: 'Arya Stark',
      email: 'arya@gobarber.com',
      password: '123456',
    };

    const createdUser = await fakeRepository.create(userData);

    await service.execute({
      userId: createdUser.id,
      avatarFileName: 'avatar.png',
    });

    const updatedUser = await service.execute({
      userId: createdUser.id,
      avatarFileName: 'avatar2.png',
    });

    expect(updatedUser.avatar).toBe('avatar2.png');
    expect(deleteFileMethod).toHaveBeenCalledWith('avatar.png');
  });
});
