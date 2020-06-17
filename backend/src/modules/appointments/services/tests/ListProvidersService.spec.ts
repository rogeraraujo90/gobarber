import 'reflect-metadata';
import FakeUsersRepository from '@modules/user/repositories/fakes/FakeUsersRepository';
import ListProvidersService from '../ListProvidersService';

let fakeRepository: FakeUsersRepository;
let service: ListProvidersService;

describe('List providers', () => {
  beforeEach(() => {
    fakeRepository = new FakeUsersRepository();
    service = new ListProvidersService(fakeRepository);
  });

  it('should be able to list all providers', async () => {
    const provider1 = await fakeRepository.create({
      name: 'Arya Stark',
      email: 'arya@gobarber.com',
      password: '123456',
    });

    const provider2 = await fakeRepository.create({
      name: 'Brandon Stark',
      email: 'bran@gobarber.com',
      password: '123456',
    });

    const loggedUser = await fakeRepository.create({
      name: 'Sansa Stark',
      email: 'sansa@gobarber.com',
      password: '123456',
    });

    const providers = await service.execute([loggedUser.id]);

    expect(providers).toHaveLength(2);
    expect(providers).toEqual([provider1, provider2]);
  });
});
