import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('reset_password_tokens')
class ResetPasswordToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default ResetPasswordToken;
