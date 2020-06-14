import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import CreateAppointmentService from '../CreateAppointmentService';
import FakeAppointmentsRepository from '../../repositories/fakes/FakeAppointmentsRepository';

let fakeRepository: FakeAppointmentsRepository;
let service: CreateAppointmentService;
let providerId: string;
let creationDate: Date;

describe('Create Appointment', () => {
  beforeEach(() => {
    fakeRepository = new FakeAppointmentsRepository();
    service = new CreateAppointmentService(fakeRepository);

    providerId = '1234';
    creationDate = new Date('2020-05-24');
  });

  it('should be able to create a new Appointment', async () => {
    const appointment = await service.execute({
      date: creationDate,
      providerId,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.date).toMatchObject(creationDate);
    expect(appointment.providerId).toBe(providerId);
  });

  it("shouldn't be able to create a new Appointment in a already booked date", async () => {
    await service.execute({
      date: creationDate,
      providerId,
    });

    expect(
      service.execute({ date: creationDate, providerId })
    ).rejects.toBeInstanceOf(AppError);
  });
});
