import { MigrationInterface, QueryRunner } from 'typeorm';

export class notifyForEachDonation1575136399381 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "ContactInfo" ADD "notifyForEachDonation" boolean NOT NULL DEFAULT true`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "ContactInfo" DROP COLUMN "notifyForEachDonation"`);
  }

}
