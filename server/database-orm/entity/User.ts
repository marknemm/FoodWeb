import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { AppUserType } from "../../../shared/src/app-user/app-user-info";


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    userKey: number;

    @Column("varchar", { length: 128, unique: true, nullable: false })
    email: string;

    @Column("varchar", { length: 60, nullable: false })
    firstName: string;

    @Column("varchar", { length: 60, nullable: false })
    lastName: string;

    @Column("timestamp", { nullable: false, default: () => "CURRENT_TIMESTAMP" })
    createDate: Date;
}
