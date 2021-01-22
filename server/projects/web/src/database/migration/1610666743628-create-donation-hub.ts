import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class createDonationHub1610666743628 implements MigrationInterface {
  name = 'createDonationHub1610666743628';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "DonationHub" ("id" SERIAL NOT NULL, "dropOffWindowStart" TIMESTAMP WITH TIME ZONE NOT NULL, "dropOffWindowEnd" TIMESTAMP WITH TIME ZONE NOT NULL, "dropOffInstructions" character varying NOT NULL, "createTimestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateTimestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "contactOverrideId" integer, "receiverAccountId" integer, "volunteerAccountId" integer, CONSTRAINT "REL_216dbc56d5cdd889345d814c74" UNIQUE ("contactOverrideId"), CONSTRAINT "PK_7677ce34d4dafddd4030fee0d69" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "DonationHubPledge" ("id" SERIAL NOT NULL, "foodType" character varying NOT NULL, "foodCount" integer NOT NULL, "createTimestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateTimestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "accountId" integer, "donationHubId" integer, CONSTRAINT "PK_4d52e98c5820060d98ea79c3a26" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "DonationHub" ADD CONSTRAINT "FK_216dbc56d5cdd889345d814c744" FOREIGN KEY ("contactOverrideId") REFERENCES "ContactInfo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "DonationHub" ADD CONSTRAINT "FK_61198a9a35037e2650f1875ba75" FOREIGN KEY ("receiverAccountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "DonationHub" ADD CONSTRAINT "FK_732eb9b26717028082cee1da7a6" FOREIGN KEY ("volunteerAccountId") REFERENCES "Account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "DonationHubPledge" ADD CONSTRAINT "FK_ef20e4a5bdb79fd6f5543f7798b" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "DonationHubPledge" ADD CONSTRAINT "FK_8b9696c43f798890633737131be" FOREIGN KEY ("donationHubId") REFERENCES "DonationHub"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "DonationHubPledge" DROP CONSTRAINT "FK_8b9696c43f798890633737131be"`);
    await queryRunner.query(`ALTER TABLE "DonationHubPledge" DROP CONSTRAINT "FK_ef20e4a5bdb79fd6f5543f7798b"`);
    await queryRunner.query(`ALTER TABLE "DonationHub" DROP CONSTRAINT "FK_732eb9b26717028082cee1da7a6"`);
    await queryRunner.query(`ALTER TABLE "DonationHub" DROP CONSTRAINT "FK_61198a9a35037e2650f1875ba75"`);
    await queryRunner.query(`ALTER TABLE "DonationHub" DROP CONSTRAINT "FK_216dbc56d5cdd889345d814c744"`);
    await queryRunner.query(`DROP TABLE "DonationHubPledge"`);
    await queryRunner.query(`DROP TABLE "DonationHub"`);
  }
}
