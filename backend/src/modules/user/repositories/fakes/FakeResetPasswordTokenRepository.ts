import { uuid } from 'uuidv4';

import ResetPasswordToken from '@modules/user/infra/typeorm/entities/ResetPasswordToken';
import IResetPasswordTokenRepository from '../IResetPasswordTokenRepository';

class FakeResetPassowrdTokenRepository
  implements IResetPasswordTokenRepository {
  private tokens: ResetPasswordToken[] = [];

  public async create(userId: string): Promise<ResetPasswordToken> {
    const token = new ResetPasswordToken();

    Object.assign(token, { id: uuid(), userId });
    this.tokens.push(token);

    return token;
  }

  public async findById(id: string): Promise<ResetPasswordToken | undefined> {
    return this.tokens.find(token => token.id === id);
  }
}

export default FakeResetPassowrdTokenRepository;
