import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class delivery1558564796570 implements MigrationInterface {
  name = 'delivery1558564796570';

  public async up(queryRunner: QueryRunner): Promise<any> {
    const alreadyCreated: boolean = (await queryRunner.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Delivery')`
    ))[0].exists;
    if (alreadyCreated) { return; }
    await queryRunner.query(`ALTER TABLE "Volunteer" DROP CONSTRAINT "FK_9edcd1322b945110e96f229a769"`);
    await queryRunner.query(`DROP INDEX "IDX_19463c968c86f66ba9bf515d34"`);
    await queryRunner.query(`CREATE TABLE "Delivery" ("id" SERIAL NOT NULL, "pickupTime" TIMESTAMP WITH TIME ZONE, "dropOffTime" TIMESTAMP WITH TIME ZONE, "donationId" integer, "volunteerAccountId" integer, CONSTRAINT "REL_938d39366adb780438836faec3" UNIQUE ("donationId"), CONSTRAINT "PK_90b858c3595a15f0e9bc9b972be" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE INDEX "IDX_e4d91b066fcc5a2738f56d0e0c" ON "Volunteer" ("lastName") `);
    await queryRunner.query(`ALTER TABLE "Volunteer" ADD CONSTRAINT "FK_207855141cd8ce90c33182f9c70" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "Delivery" ADD CONSTRAINT "FK_938d39366adb780438836faec34" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "Delivery" ADD CONSTRAINT "FK_f0f54b9a6f79d79bcfdf98138ba" FOREIGN KEY ("volunteerAccountId") REFERENCES "Account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

    await queryRunner.query(`ALTER TYPE "donation_donationstatus_enum" RENAME TO "donation_donationstatus_enum_old"`);
    await queryRunner.query(`CREATE TYPE "donation_donationstatus_enum" AS ENUM('Unmatched', 'Matched', 'Scheduled', 'Picked Up', 'Complete')`);
    await queryRunner.query(`ALTER TABLE "Donation" ALTER COLUMN "donationStatus" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "Donation" ALTER COLUMN "donationStatus" TYPE "donation_donationstatus_enum" USING "donationStatus"::"text"::"donation_donationstatus_enum"`);
    await queryRunner.query(`ALTER TABLE "Donation" ALTER COLUMN "donationStatus" SET DEFAULT 'Unmatched'`);
    await queryRunner.query(`DROP TYPE "donation_donationstatus_enum_old"`);
    await queryRunner.query(`ALTER TABLE "Donation" ALTER COLUMN "donationStatus" SET DEFAULT 'Unmatched'`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Delivery" DROP CONSTRAINT "FK_f0f54b9a6f79d79bcfdf98138ba"`);
    await queryRunner.query(`ALTER TABLE "Delivery" DROP CONSTRAINT "FK_938d39366adb780438836faec34"`);
    await queryRunner.query(`ALTER TABLE "Volunteer" DROP CONSTRAINT "FK_207855141cd8ce90c33182f9c70"`);
    await queryRunner.query(`DROP INDEX "IDX_e4d91b066fcc5a2738f56d0e0c"`);
    await queryRunner.query(`DROP TABLE "Delivery"`);
    await queryRunner.query(`CREATE INDEX "IDX_19463c968c86f66ba9bf515d34" ON "Volunteer" ("lastName") `);
    await queryRunner.query(`ALTER TABLE "Volunteer" ADD CONSTRAINT "FK_9edcd1322b945110e96f229a769" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

    await queryRunner.query(`ALTER TABLE "Donation" ALTER COLUMN "donationStatus" SET DEFAULT 'Matched'`);
    await queryRunner.query(`CREATE TYPE "donation_donationstatus_enum_old" AS ENUM('Unmatched', 'Matched', 'Complete')`);
    await queryRunner.query(`ALTER TABLE "Donation" ALTER COLUMN "donationStatus" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "Donation" ALTER COLUMN "donationStatus" TYPE "donation_donationstatus_enum_old" USING "donationStatus"::"text"::"donation_donationstatus_enum_old"`);
    await queryRunner.query(`ALTER TABLE "Donation" ALTER COLUMN "donationStatus" SET DEFAULT 'Unmatched'`);
    await queryRunner.query(`DROP TYPE "donation_donationstatus_enum"`);
    await queryRunner.query(`ALTER TYPE "donation_donationstatus_enum_old" RENAME TO "donation_donationstatus_enum"`);
  }

}
