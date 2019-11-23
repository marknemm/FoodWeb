import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Volunteer } from '../shared';
import { AccountEntity } from './account.entity';

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
