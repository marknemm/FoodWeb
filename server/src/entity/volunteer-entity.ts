import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, Index } from 'typeorm';
import { AccountEntity } from './account.entity';
import { Volunteer } from '../../../shared/src/interfaces/account/volunteer';

@Entity('Volunteer')
export class VolunteerEntity implements Volunteer {

  @PrimaryGeneratedColumn()
  id: number;

  @Index()
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
