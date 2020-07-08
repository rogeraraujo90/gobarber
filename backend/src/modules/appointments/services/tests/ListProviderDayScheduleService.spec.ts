import 'reflect-metadata';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/providers/cache/fakes/FakeCacheProvider';
import ListProviderDayScheduleService from '../ListProviderDayScheduleService';

let service: ListProviderDayScheduleService;
let appointmentsRepository: FakeAppointmentsRepository;
let cacheProvider: FakeCacheProvider;

describe('List provider day availability', () => {
  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentsRepository();
    cacheProvider = new FakeCacheProvider();
    service = new ListProviderDayScheduleService(
      appointmentsRepository,
      cacheProvider
    );
  });

  it('should be able to list the appointments scheduled to an specific day', async () => {
    const providerId = 'user';
    const customerId = 'customer';

    const appointment1 = await appointmentsRepository.create({
      providerId,
      customerId,
      date: new Date(2020, 5, 14, 10, 0, 0),
    });

    const appointment2 = await appointmentsRepository.create({
      providerId,
      customerId,
      date: new Date(2020, 5, 14, 12, 0, 0),
    });

    const appointments = await service.execute({
      providerId,
      day: 14,
      month: 5,
      year: 2020,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });

  it('should be return data from cache when available', async () => {
    const providerId = 'user';
    const customerId = 'customer';

    const appointment1 = await appointmentsRepository.create({
      providerId,
      customerId,
      date: new Date(2020, 5, 14, 10, 0, 0),
    });

    const appointment2 = await appointmentsRepository.create({
      providerId,
      customerId,
      date: new Date(2020, 5, 14, 12, 0, 0),
    });

    const cacheKey = `appointments-in-day:${providerId}:2020-5-14`;

    cacheProvider.save(cacheKey, [appointment1, appointment2]);

    const findRepositoryMethod = jest.spyOn(
      appointmentsRepository,
      'findAllByProviderAndDay'
    );

    const appointments = await service.execute({
      providerId,
      day: 14,
      month: 5,
      year: 2020,
    });

    const jsonReturn = JSON.stringify([appointment1, appointment2]);
    const parsedReturn = JSON.parse(jsonReturn);

    expect(appointments).toEqual(parsedReturn);
    expect(findRepositoryMethod).toHaveBeenCalledTimes(0);
  });
});
