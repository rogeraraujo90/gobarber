import { injectable, inject } from 'tsyringe';
import IAppointmentRepository from '../repositories/IAppointmentRepository';

interface IRequest {
  providerId: string;
  month: number;
  yeah: number;
}

type Response = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
export default class ListProvidersService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentRepository
  ) {}

  public async execute({
    providerId,
    month,
    yeah,
  }: IRequest): Promise<Response> {
    const appointments = this.appointmentsRepository.findByProviderAndYearMonth(
      {
        providerId,
        month,
        yeah,
      }
    );

    console.log(appointments);

    return [];
  }
}
