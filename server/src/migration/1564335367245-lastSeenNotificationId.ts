import { MigrationInterface, QueryRunner } from 'typeorm';

export class lastSeenNotificationId1564335367245 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Account" ADD "lastSeenNotificationId" integer NOT NULL DEFAULT -1`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Account" DROP COLUMN "lastSeenNotificationId"`);
  }

}
