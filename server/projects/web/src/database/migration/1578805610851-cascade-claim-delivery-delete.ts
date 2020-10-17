import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class cascadeClaimDeliveryDelete1578805610851 implements MigrationInterface {
  name = 'cascadeClaimDeliveryDelete1578805610851';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Delivery" DROP CONSTRAINT "FK_938d39366adb780438836faec34"`, undefined);
    await queryRunner.query(`ALTER TABLE "DonationClaim" DROP CONSTRAINT "FK_8550ec0b53280fe4700cabe4636"`, undefined);
    await queryRunner.query(`ALTER TABLE "DonationClaim" ADD CONSTRAINT "FK_8550ec0b53280fe4700cabe4636" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    await queryRunner.query(`ALTER TABLE "Delivery" ADD CONSTRAINT "FK_938d39366adb780438836faec34" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Account" DROP CONSTRAINT "FK_f3f5c02509d4f9b16cdebfd9bff"`, undefined);
    await queryRunner.query(`ALTER TABLE "DonationClaim" DROP CONSTRAINT "FK_8550ec0b53280fe4700cabe4636"`, undefined);
    await queryRunner.query(`ALTER TABLE "DonationClaim" ADD CONSTRAINT "FK_8550ec0b53280fe4700cabe4636" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    await queryRunner.query(`ALTER TABLE "Delivery" ADD CONSTRAINT "FK_938d39366adb780438836faec34" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
  }

}
