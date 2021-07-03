import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class lastSeenNotificationId1564335367245 implements MigrationInterface {
  name = 'lastSeenNotificationId1564335367245';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Account" ADD COLUMN IF NOT EXISTS "lastSeenNotificationId" integer NOT NULL DEFAULT -1`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Account" DROP COLUMN "lastSeenNotificationId"`);
  }

}
