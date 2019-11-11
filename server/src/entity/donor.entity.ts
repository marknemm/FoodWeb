import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { OrganizationEntity } from './organization.entity';
import { Donor } from '../shared';
export { Donor };

@Entity('Donor')
export class DonorEntity implements Donor {

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => OrganizationEntity, (organizationEntity) => organizationEntity.donor)
  @JoinColumn()
  organization?: OrganizationEntity;
}
