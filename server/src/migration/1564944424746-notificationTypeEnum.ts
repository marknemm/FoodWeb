import { MigrationInterface, QueryRunner } from 'typeorm';

export class notificationTypeEnum1564944424746 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Notification" DROP COLUMN "notificationType"`);
    await queryRunner.query(`CREATE TYPE "notification_notificationtype_enum" AS ENUM('Donate', 'Update Donation', 'Remove Donation', 'Claim Donation', 'Unclaim Donation', 'Schedule Delivery', 'Delivery State Advance', 'Delivery State Undo')`);
    await queryRunner.query(`ALTER TABLE "Notification" ADD "notificationType" "notification_notificationtype_enum" NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Notification" DROP COLUMN "notificationType"`);
    await queryRunner.query(`DROP TYPE "notification_notificationtype_enum"`);
    await queryRunner.query(`ALTER TABLE "Notification" ADD "notificationType" integer NOT NULL`);
  }

}
