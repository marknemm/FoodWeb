import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
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
