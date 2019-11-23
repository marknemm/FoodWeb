import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { AccountEntity } from './account.entity';

@Entity('Password')
export class PasswordEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  passwordHash: string;

  @OneToOne((type) => AccountEntity)
  @JoinColumn()
  account?: AccountEntity;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updateTimestamp: Date;
}
