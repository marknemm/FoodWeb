import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { AccountEntity } from './account.entity';

@Entity('PasswordReset')
export class PasswordResetEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => AccountEntity, { nullable: false })
  @JoinColumn()
  account?: AccountEntity;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createTimestamp: Date;

  @Column()
  resetToken: string;
}
