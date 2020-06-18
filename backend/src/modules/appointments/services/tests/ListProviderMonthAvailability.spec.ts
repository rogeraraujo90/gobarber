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

    let hour = 8;
    const createAppointmentsPromises = [];

    while (hour < 18) {
      createAppointmentsPromises.push(
        appointmentsRepository.create({
          providerId,
          date: new Date(2020, 5, 14, hour, 0, 0),
        })
      );

      hour += 1;
    }

    await Promise.all(createAppointmentsPromises);
    await appointmentsRepository.create({
      providerId,
      date: new Date(2020, 5, 15, 6, 0, 0),
    });

    const availability = await service.execute({
      providerId,
      month: 5,
      yeah: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { available: true, day: 13 },
        { available: false, day: 14 },
        { available: true, day: 15 },
        { available: true, day: 16 },
      ])
    );
  });
});
