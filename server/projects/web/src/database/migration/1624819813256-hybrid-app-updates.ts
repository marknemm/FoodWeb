import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class hybridAppUpdates1624819813258 implements MigrationInterface {
  name = 'hybridAppUpdates1624819813258';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "AppData"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "AppSession"`);
    await queryRunner.query(`CREATE TABLE "MobileDevice" ("uuid" character varying NOT NULL, "accountId" integer NOT NULL, "isVirtual" boolean NOT NULL DEFAULT false, "manufacturer" character varying, "model" character varying, "name" character varying, "operatingSystem" character varying, "osVersion" character varying, "platform" character varying, "pushRegistrationId" character varying, "createTimestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_7bc384804d51cc650244017fdd9" PRIMARY KEY ("uuid", "accountId"))`);
    await queryRunner.query(`CREATE TABLE "PerpetualSession" ("id" SERIAL NOT NULL, "sessionToken" character varying NOT NULL, "createTimestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateTimestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "accountId" integer NOT NULL, CONSTRAINT "REL_079f435b9cd6b18869bf820495" UNIQUE ("accountId"), CONSTRAINT "PK_b9aa00513c40845663de3f60873" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c7e95afc90ccf97601af40ea9f" ON "PerpetualSession" ("sessionToken") `);
    await queryRunner.query(`ALTER TYPE "audit_eventtype_enum" RENAME TO "audit_eventtype_enum_old"`);
    await queryRunner.query(`CREATE TYPE "Audit_eventtype_enum" AS ENUM('Signup', 'Verify Account', 'Remove Unverified Account', 'Update Account', 'Update Password', 'Reset Password', 'Donate', 'Update Donation', 'Remove Donation', 'Claim Donation', 'Unclaim Donation', 'Schedule Delivery', 'Cancel Delivery', 'Delivery State Advance', 'Delivery State Undo', 'Save Mobile Device')`);
    await queryRunner.query(`ALTER TABLE "Audit" ALTER COLUMN "eventType" TYPE "Audit_eventtype_enum" USING "eventType"::"text"::"Audit_eventtype_enum"`);
    await queryRunner.query(`DROP TYPE "audit_eventtype_enum_old"`);
    await queryRunner.query(`ALTER TABLE "PerpetualSession" ADD CONSTRAINT "FK_079f435b9cd6b18869bf8204954" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "PerpetualSession" DROP CONSTRAINT "FK_079f435b9cd6b18869bf8204954"`);
    await queryRunner.query(`CREATE TYPE "audit_eventtype_enum_old" AS ENUM('Signup', 'Verify Account', 'Remove Unverified Account', 'Update Account', 'Update Password', 'Reset Password', 'Donate', 'Update Donation', 'Remove Donation', 'Claim Donation', 'Unclaim Donation', 'Schedule Delivery', 'Cancel Delivery', 'Delivery State Advance', 'Delivery State Undo', 'Save App Data', 'Remove App Data')`);
    await queryRunner.query(`ALTER TABLE "Audit" ALTER COLUMN "eventType" TYPE "audit_eventtype_enum_old" USING "eventType"::"text"::"audit_eventtype_enum_old"`);
    await queryRunner.query(`DROP TYPE "Audit_eventtype_enum"`);
    await queryRunner.query(`ALTER TYPE "audit_eventtype_enum_old" RENAME TO "audit_eventtype_enum"`);
    await queryRunner.query(`DROP INDEX "IDX_c7e95afc90ccf97601af40ea9f"`);
    await queryRunner.query(`DROP TABLE "PerpetualSession"`);
    await queryRunner.query(`DROP TABLE "MobileDevice"`);
    await queryRunner.query(`CREATE TABLE "AppData" ("deviceUuid" character varying NOT NULL, "accountId" integer NOT NULL, "devicePlatform" character varying, "deviceModel" character varying, "deviceVersion" character varying, "deviceManufacturer" character varying, "deviceSerial" character varying, "deviceIsVirtual" boolean NOT NULL DEFAULT false, "pushRegistrationId" character varying, "createTimestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_6d319785ed3819f09f9f06e0a44" PRIMARY KEY ("deviceUuid", "accountId"))`);
    await queryRunner.query(`CREATE TABLE "AppSession" ("id" SERIAL NOT NULL, "appSessionToken" character varying NOT NULL, "createTimestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateTimestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "accountId" integer NOT NULL, CONSTRAINT "REL_a5bf92aa3c976715684a272226" UNIQUE ("accountId"), CONSTRAINT "PK_06e3d692ecd443d27ceea01a755" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "AppSession" ADD CONSTRAINT "FK_a5bf92aa3c976715684a2722262" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

}
