import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { OrganizationEntity } from './organization.entity';
import { Receiver } from '../shared';
export { Receiver };

@Entity('Receiver')
export class ReceiverEntity implements Receiver {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  autoReceiver: boolean;

  @OneToOne((type) => OrganizationEntity, (organizationEntity) => organizationEntity.receiver)
  @JoinColumn()
  organization?: OrganizationEntity;
}
