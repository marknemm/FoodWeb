import {MigrationInterface, QueryRunner} from "typeorm";

export class addVolunteerCarInfo1606073480141 implements MigrationInterface {
    name = 'addVolunteerCarInfo1606073480141'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Volunteer" ADD "licenseId" character varying NOT NULL default ''`);
        await queryRunner.query(`ALTER TABLE "Volunteer" ADD "carType" character varying NOT NULL default ''`);
        await queryRunner.query(`ALTER TABLE "Volunteer" ADD "carMake" character varying NOT NULL default ''`);
        await queryRunner.query(`ALTER TABLE "Volunteer" ADD "carModel" character varying NOT NULL default ''`);
        await queryRunner.query(`ALTER TABLE "Volunteer" ADD "carColor" character varying NOT NULL default ''`);
        await queryRunner.query(`ALTER TABLE "Volunteer" ADD "carYear" character varying NOT NULL default ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Volunteer" DROP COLUMN "carColor"`);
        await queryRunner.query(`ALTER TABLE "Volunteer" DROP COLUMN "carModel"`);
        await queryRunner.query(`ALTER TABLE "Volunteer" DROP COLUMN "carMake"`);
        await queryRunner.query(`ALTER TABLE "Volunteer" DROP COLUMN "carType"`);
        await queryRunner.query(`ALTER TABLE "Volunteer" DROP COLUMN "licenseId"`);
        await queryRunner.query(`ALTER TABLE "Volunteer" DROP COLUMN "carYear"`);
    }

}
