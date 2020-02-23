import { Column, Index, JoinColumn, OneToOne } from 'typeorm';
import { Volunteer } from '~shared';
import { OrmEntity, OrmPrimaryGeneratedColumn } from '~orm/index';
import { AccountEntity } from './account.entity';

@OrmEntity('Volunteer')
@Index('volunteerNameIdx', { synchronize: false })
export class VolunteerEntity implements Volunteer {

  @OrmPrimaryGeneratedColumn()
  id: number;

  @Column()
  lastName: string;

  @Column()
  firstName: string;

  @Column({ default: false })
  hasEquipment: boolean;

  @OneToOne((type) => AccountEntity, (accountEntity) => accountEntity.organization)
  @JoinColumn()
  account?: AccountEntity;
}
