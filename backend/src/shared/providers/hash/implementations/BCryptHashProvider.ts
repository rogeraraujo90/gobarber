import { hash, compare } from 'bcryptjs';

import IHashProvider from '@shared/providers/hash/IHashProvider';

class BCryptHashProvider implements IHashProvider {
  public async createHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}

export default BCryptHashProvider;
