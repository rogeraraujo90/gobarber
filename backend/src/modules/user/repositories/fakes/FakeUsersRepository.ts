import { uuid } from 'uuidv4';

import IUserRepository from '@modules/user/repositories/IUserRepository';
import ICreateUserDTO from '@modules/user/dtos/ICreateUserDTO';
import User from '@modules/user/infra/typeorm/entities/User';

class UserRepository implements IUserRepository {
  private users: User[] = [];

  public async create(data: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid(), ...data });
    this.users.push(user);

    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  public async save(user: User): Promise<User> {
    const userIndex = this.users.findIndex(
      savedUser => savedUser.id === user.id
    );

    this.users[userIndex] = user;

    return user;
  }
}

export default UserRepository;
