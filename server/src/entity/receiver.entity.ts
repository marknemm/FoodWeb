import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Receiver } from '../shared';
import { OrganizationEntity } from './organization.entity';
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
