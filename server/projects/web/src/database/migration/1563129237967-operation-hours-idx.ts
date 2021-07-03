import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class operationHoursIdx1563129237967 implements MigrationInterface {
  name = 'operationHoursIdx1563129237967';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_4a67194a67f9217a63275eaeb2" ON "OperationHours" ("weekday", "startTime", "endTime") `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP INDEX "IDX_4a67194a67f9217a63275eaeb2"`);
  }
}
