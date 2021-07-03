import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class notifyForEachDonation1575136399381 implements MigrationInterface {
  name = 'notifyForEachDonation1575136399381';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "ContactInfo" ADD "notifyForEachDonation" boolean NOT NULL DEFAULT true`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "ContactInfo" DROP COLUMN "notifyForEachDonation"`);
  }

}
