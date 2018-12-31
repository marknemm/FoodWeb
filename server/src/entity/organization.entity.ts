import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { AccountEntity } from './account.entity';
import { Organization } from "../../../shared/src/interfaces/organization";

@Entity('Organization')
export class OrganizationEntity implements Organization {

  @PrimaryGeneratedColumn()
  organizationId: number;

  @Column()
  organizationName: string;  

  @OneToOne(type => AccountEntity, accountEntity => accountEntity.organization)
  @JoinColumn()
  account: AccountEntity;
}
