import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class allowNulllableNotificationFields1564943729291 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Notification" ALTER COLUMN "notificationIconUrl" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "Notification" ALTER COLUMN "notificationSubtitle" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "Notification" ALTER COLUMN "notificationBody" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Notification" ALTER COLUMN "notificationBody" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "Notification" ALTER COLUMN "notificationSubtitle" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "Notification" ALTER COLUMN "notificationIconUrl" SET NOT NULL`);
  }

}
