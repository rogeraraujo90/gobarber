import 'reflect-metadata';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from '../ListProviderMonthAvailabilityService';

let service: ListProviderMonthAvailabilityService;
let appointmentsRepository: FakeAppointmentsRepository;

describe('List provider month availability', () => {
  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentsRepository();
    service = new ListProviderMonthAvailabilityService(appointmentsRepository);
  });

  it('should be able to list the month availability from a provider', async () => {
    const providerId = 'user';

    await appointmentsRepository.create({
      providerId,
      date: new Date(2020, 4, 13, 6, 0, 0),
    });

    await appointmentsRepository.create({
      providerId,
      date: new Date(2020, 5, 14, 5, 0, 0),
    });

    await appointmentsRepository.create({
      providerId,
      date: new Date(2020, 5, 14, 6, 0, 0),
    });

    await appointmentsRepository.create({
      providerId,
      date: new Date(2020, 5, 15, 6, 0, 0),
    });

    const availability = await service.execute({
      providerId,
      month: 5,
      yeah: 2020,
    });

    expect(availability).toBe(
      expect.arrayContaining([
        { day: 13, availability: true },
        { day: 14, availability: false },
        { day: 15, availability: false },
        { day: 16, availability: true },
      ])
    );
  });
});
