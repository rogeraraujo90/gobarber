import 'reflect-metadata';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayScheduleService from '../ListProviderDayScheduleService';

let service: ListProviderDayScheduleService;
let appointmentsRepository: FakeAppointmentsRepository;

describe('List provider day availability', () => {
  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentsRepository();
    service = new ListProviderDayScheduleService(appointmentsRepository);
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
});
