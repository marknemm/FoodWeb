import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class nullableDonationContactInfoOverride1577745814363 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Donation" ALTER COLUMN "donorContactOverrideId" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Donation" ALTER COLUMN "donorContactOverrideId" ADD NOT NULL`);
  }

}
