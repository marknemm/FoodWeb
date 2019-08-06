import { MigrationInterface, QueryRunner } from 'typeorm';

export class operationHoursIdx1563129237967 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_4a67194a67f9217a63275eaeb2" ON "OperationHours" ("weekday", "startTime", "endTime") `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP INDEX "IDX_4a67194a67f9217a63275eaeb2"`);
  }
}