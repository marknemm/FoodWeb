import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class deliveryStartStatus1575213767857 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TYPE "donation_donationstatus_enum" RENAME TO "donation_donationstatus_enum_old"`);
    await queryRunner.query(`CREATE TYPE "donation_donationstatus_enum" AS ENUM('Unmatched', 'Matched', 'Scheduled', 'Started', 'Picked Up', 'Complete')`);
    await queryRunner.query(`ALTER TABLE "Donation" ALTER COLUMN "donationStatus" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "Donation" ALTER COLUMN "donationStatus" TYPE "donation_donationstatus_enum" USING "donationStatus"::"text"::"donation_donationstatus_enum"`);
    await queryRunner.query(`ALTER TABLE "Donation" ALTER COLUMN "donationStatus" SET DEFAULT 'Unmatched'`);
    await queryRunner.query(`DROP TYPE "donation_donationstatus_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TYPE "donation_donationstatus_enum_old" AS ENUM('Unmatched', 'Matched', 'Scheduled', 'Picked Up', 'Complete')`);
    await queryRunner.query(`ALTER TABLE "Donation" ALTER COLUMN "donationStatus" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "Donation" ALTER COLUMN "donationStatus" TYPE "donation_donationstatus_enum_old" USING "donationStatus"::"text"::"donation_donationstatus_enum_old"`);
    await queryRunner.query(`ALTER TABLE "Donation" ALTER COLUMN "donationStatus" SET DEFAULT 'Unmatched'`);
    await queryRunner.query(`DROP TYPE "donation_donationstatus_enum"`);
    await queryRunner.query(`ALTER TYPE "donation_donationstatus_enum_old" RENAME TO "donation_donationstatus_enum"`);
  }

}
