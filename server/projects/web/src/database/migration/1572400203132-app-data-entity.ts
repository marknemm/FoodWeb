import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class appDataEntity1572400203132 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE "AppData" ("deviceUuid" character varying NOT NULL, "accountId" integer NOT NULL, "devicePlatform" character varying, "deviceModel" character varying, "deviceVersion" character varying, "deviceManufacturer" character varying, "deviceSerial" character varying, "deviceIsVirtual" boolean NOT NULL DEFAULT false, "pushRegistrationId" character varying, "createTimestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_6d319785ed3819f09f9f06e0a44" PRIMARY KEY ("deviceUuid", "accountId"))`);
    await queryRunner.query(`ALTER TYPE "audit_eventtype_enum" RENAME TO "audit_eventtype_enum_old"`);
    await queryRunner.query(`CREATE TYPE "audit_eventtype_enum" AS ENUM('Signup', 'Verify Account', 'Remove Unverified Account', 'Update Account', 'Update Password', 'Reset Password', 'Donate', 'Update Donation', 'Remove Donation', 'Claim Donation', 'Unclaim Donation', 'Schedule Delivery', 'Cancel Delivery', 'Delivery State Advance', 'Delivery State Undo', 'Save App Data', 'Remove App Data')`);
    await queryRunner.query(`ALTER TABLE "Audit" ALTER COLUMN "eventType" TYPE "audit_eventtype_enum" USING "eventType"::"text"::"audit_eventtype_enum"`);
    await queryRunner.query(`DROP TYPE "audit_eventtype_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TYPE "audit_eventtype_enum_old" AS ENUM('Signup', 'Verify Account', 'Remove Unverified Account', 'Update Account', 'Reset Password', 'Donate', 'Update Donation', 'Remove Donation', 'Claim Donation', 'Unclaim Donation', 'Schedule Delivery', 'Cancel Delivery', 'Delivery State Advance', 'Delivery State Undo')`);
    await queryRunner.query(`ALTER TABLE "Audit" ALTER COLUMN "eventType" TYPE "audit_eventtype_enum_old" USING "eventType"::"text"::"audit_eventtype_enum_old"`);
    await queryRunner.query(`DROP TYPE "audit_eventtype_enum"`);
    await queryRunner.query(`ALTER TYPE "audit_eventtype_enum_old" RENAME TO "audit_eventtype_enum"`);
    await queryRunner.query(`DROP TABLE "AppData"`);
  }
}
