import { MigrationInterface, QueryRunner } from 'typeorm';
import geoTz = require('geo-tz');

// tslint:disable-next-line: class-name
export class timezone1560985604098 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const alreadyCreated: boolean = (await queryRunner.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ContactInfo' AND column_name = 'timezone')`
    ))[0].exists;
    if (alreadyCreated) { return; }
    const defaultTimezone: string = geoTz(43, -78)[0];
    await queryRunner.query(`ALTER TABLE "ContactInfo" ADD "timezone" character varying`);
    await queryRunner.query(`UPDATE "ContactInfo" SET "timezone" = $1`, [defaultTimezone]);
    await queryRunner.query(`ALTER TABLE "ContactInfo" ALTER COLUMN "timezone" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "ContactInfo" DROP COLUMN "timezone"`);
  }
}
