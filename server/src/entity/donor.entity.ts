import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Donor } from '../shared';
import { OrganizationEntity } from './organization.entity';
export { Donor };

@Entity('Donor')
export class DonorEntity implements Donor {

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => OrganizationEntity, (organizationEntity) => organizationEntity.donor)
  @JoinColumn()
  organization?: OrganizationEntity;
}
