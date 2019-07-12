import { Entity, PrimaryGeneratedColumn, OneToOne, Column, JoinColumn } from 'typeorm';
import { AccountEntity } from './account.entity';

@Entity('UnverifiedAccount')
export class UnverifiedAccountEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => AccountEntity, { eager: true })
  @JoinColumn()
  account?: AccountEntity;

  @Column()
  verificationToken: string;
}
