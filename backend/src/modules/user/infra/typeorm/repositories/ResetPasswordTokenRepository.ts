import { Repository, getRepository } from 'typeorm';
import IResetPasswordTokenRepository from '@modules/user/repositories/IResetPasswordTokenRepository';
import ResetPasswordToken from '../entities/ResetPasswordToken';

class ResetPasswordTokenRepository implements IResetPasswordTokenRepository {
  private ormRepository: Repository<ResetPasswordToken>;

  constructor() {
    this.ormRepository = getRepository(ResetPasswordToken);
  }

  public async create(userId: string): Promise<ResetPasswordToken> {
    const resetPasswordToken = this.ormRepository.create({ userId });

    await this.ormRepository.save(resetPasswordToken);

    return resetPasswordToken;
  }

  public async findById(id: string): Promise<ResetPasswordToken | undefined> {
    return this.ormRepository.findOne(id);
  }
}

export default ResetPasswordTokenRepository;
