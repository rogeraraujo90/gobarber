import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import CreateAppointmentService from '../CreateAppointmentService';
import FakeAppointmentsRepository from '../../repositories/fakes/FakeAppointmentsRepository';

describe('Create Appointment', () => {
  it('should be able to create a new Appointment', async () => {
    const fakeRepository = new FakeAppointmentsRepository();
    const service = new CreateAppointmentService(fakeRepository);

    const providerId = '1234';
    const creationDate = new Date('2020-05-24');

    const appointment = await service.execute({
      date: creationDate,
      providerId,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.date).toMatchObject(creationDate);
    expect(appointment.providerId).toBe(providerId);
  });

  it("shouldn't be able to create a new Appointment in a already booked date", async () => {
    const fakeRepository = new FakeAppointmentsRepository();
    const service = new CreateAppointmentService(fakeRepository);

    const providerId = '1234';
    const creationDate = new Date('2020-05-24');

    await service.execute({
      date: creationDate,
      providerId,
    });

    expect(
      service.execute({ date: creationDate, providerId })
    ).rejects.toBeInstanceOf(AppError);
  });
});
