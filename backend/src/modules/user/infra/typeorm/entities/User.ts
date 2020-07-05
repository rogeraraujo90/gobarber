import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import storageConfig from '@config/storage';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  avatar: string;

  @Expose({ name: 'avatar_url' })
  get avatarUrl(): string | null {
    if (!this.avatar) {
      return null;
    }

    if (storageConfig.driver === 'disk') {
      return `${process.env.API_HOST}/files/${this.avatar}`;
    }

    return `https://${process.env.AVATARS_BUCKET}.s3-sa-east-1.amazonaws.com/${this.avatar}`;
  }

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default User;
