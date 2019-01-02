import { Entity, PrimaryGeneratedColumn, OneToOne, Column, JoinColumn } from 'typeorm';
import { AccountEntity } from './account.entity';

@Entity('UnverifiedAccount')
export class UnverifiedAccountEntity {

  static readonly VERIFICATION_TOKEN_LEN = 10;

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => AccountEntity)
  @JoinColumn()
  account?: AccountEntity;

  @Column('char', { length: UnverifiedAccountEntity.VERIFICATION_TOKEN_LEN })
  verifiecationToken: string;
}
