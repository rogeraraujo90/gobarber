import ResetPasswordToken from '../infra/typeorm/entities/ResetPasswordToken';

export default interface IResetPasswordTokenRepository {
  create(userId: string): Promise<ResetPasswordToken>;
  findById(id: string): Promise<ResetPasswordToken | undefined>;
}
