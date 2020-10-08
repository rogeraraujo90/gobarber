import 'reflect-metadata';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from '../ListProviderDayAvailabilityService';

let service: ListProviderDayAvailabilityService;
let appointmentsRepository: FakeAppointmentsRepository;

describe('List provider day availability', () => {
  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentsRepository();
    service = new ListProviderDayAvailabilityService(appointmentsRepository);
  });

  it('should not show past hours as available', async () => {
    const providerId = 'user';
    const customerId = 'customer';

    await appointmentsRepository.create({
      providerId,
      customerId,
      date: new Date(2020, 6, 16, 10, 0, 0),
    });

    await appointmentsRepository.create({
      providerId,
      customerId,
      date: new Date(2020, 6, 16, 12, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 5, 16, 11).getTime();
    });

    const availability = await service.execute({
      providerId,
      day: 16,
      month: 6,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { available: false, hour: 9 },
        { available: false, hour: 10 },
        { available: false, hour: 11 },
        { available: false, hour: 12 },
        { available: true, hour: 13 },
        { available: false, hour: 12 },
      ])
    );
  });
});
