import 'reflect-metadata';
import FakeUsersRepository from '@modules/user/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/providers/cache/fakes/FakeCacheProvider';
import ListProvidersService from '../ListProvidersService';

let fakeRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let service: ListProvidersService;

describe('List providers', () => {
  beforeEach(() => {
    fakeRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    service = new ListProvidersService(fakeRepository, fakeCacheProvider);
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

  it('should load providers from cache when available', async () => {
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

    const findMethod = jest.spyOn(fakeRepository, 'find');

    const cacheKey = `list-providers:${loggedUser.id}`;

    fakeCacheProvider.save(cacheKey, [provider1, provider2]);

    const providers = await service.execute([loggedUser.id]);

    const jsonProviders = JSON.stringify([provider1, provider2]);
    const parsedProviders = JSON.parse(jsonProviders);

    expect(providers).toHaveLength(2);
    expect(providers).toEqual(parsedProviders);
    expect(findMethod).toHaveBeenCalledTimes(0);
  });
});
