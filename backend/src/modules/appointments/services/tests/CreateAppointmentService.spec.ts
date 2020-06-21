import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import CreateAppointmentService from '../CreateAppointmentService';
import FakeAppointmentsRepository from '../../repositories/fakes/FakeAppointmentsRepository';

let fakeRepository: FakeAppointmentsRepository;
let service: CreateAppointmentService;
let providerId: string;
let customerId: string;

describe('Create Appointment', () => {
  beforeEach(() => {
    fakeRepository = new FakeAppointmentsRepository();
    service = new CreateAppointmentService(fakeRepository);

    providerId = '1234';
    customerId = '5678';
  });

  it('should be able to create a new Appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 19, 11).getTime();
    });

    const creationDate = new Date(2020, 5, 19, 13);
    const appointment = await service.execute({
      date: creationDate,
      providerId,
      customerId,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.date).toMatchObject(creationDate);
    expect(appointment.providerId).toBe(providerId);
  });

  it("shouldn't be able to create a new Appointment in a already booked date", async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 5, 1, 13).getTime();
    });

    const creationDate = new Date(2020, 5, 10, 13);

    await service.execute({
      date: creationDate,
      providerId,
      customerId,
    });

    await expect(
      service.execute({ date: creationDate, customerId, providerId })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("shouldn't be able to create a new Appointment in a past date", async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 19, 13).getTime();
    });

    await expect(
      service.execute({
        date: new Date(2020, 5, 19, 11),
        providerId,
        customerId,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("shouldn't be able to create a new Appointment with yourself", async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 19, 11).getTime();
    });

    await expect(
      service.execute({
        date: new Date(2020, 5, 19, 13),
        providerId,
        customerId: providerId,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("shouldn't be able to create a new Appointment before 8am", async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 19, 11).getTime();
    });

    await expect(
      service.execute({
        date: new Date(2020, 5, 20, 7),
        providerId,
        customerId,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("shouldn't be able to create a new Appointment after 17pm", async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 19, 11).getTime();
    });

    await expect(
      service.execute({
        date: new Date(2020, 5, 20, 18),
        providerId,
        customerId,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
