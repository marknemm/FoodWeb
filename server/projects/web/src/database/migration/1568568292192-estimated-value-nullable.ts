import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class estimatedValueNullable1568568292192 implements MigrationInterface {
  name = 'estimatedValueNullable1568568292192';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Donation" ALTER COLUMN "estimatedValue" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Donation" ALTER COLUMN "estimatedValue" SET NOT NULL`);
  }
}
