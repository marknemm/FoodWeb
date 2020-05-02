import { Column, JoinColumn, OneToOne } from 'typeorm';
import { OrmEntity, OrmPrimaryGeneratedColumn } from '../../../projects/web/src/helpers/orm';
import { AccountEntity } from './account.entity';

@OrmEntity('UnverifiedAccount')
export class UnverifiedAccountEntity {

  @OrmPrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => AccountEntity, { eager: true })
  @JoinColumn()
  account?: AccountEntity;

  @Column()
  verificationToken: string;
}
