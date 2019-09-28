import { MigrationInterface, QueryRunner } from 'typeorm';

export class estimatedValueNullable1568568292192 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Donation" ALTER COLUMN "estimatedValue" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Donation" ALTER COLUMN "estimatedValue" SET NOT NULL`);
  }
}
