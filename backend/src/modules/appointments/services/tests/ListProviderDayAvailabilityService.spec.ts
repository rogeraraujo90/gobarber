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

    await appointmentsRepository.create({
      providerId,
      date: new Date(2020, 5, 14, 10, 0, 0),
    });

    await appointmentsRepository.create({
      providerId,
      date: new Date(2020, 5, 14, 12, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 14, 11).getTime();
    });

    const availability = await service.execute({
      providerId,
      day: 14,
      month: 5,
      yeah: 2020,
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
