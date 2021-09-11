import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class notificationTypeText1639518875681 implements MigrationInterface {
  name = 'notificationTypeText1639518875681';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Notification" ALTER COLUMN "notificationType" TYPE text`);
    await queryRunner.query(`DROP TYPE "public"."Notification_notificationtype_enum"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."Notification_notificationtype_enum" AS ENUM('Signup', 'Donate', 'Update Donation', 'Remove Donation', 'Claim Donation', 'Claim Reassigned', 'Unclaim Donation', 'Schedule Delivery', 'Cancel Delivery', 'Delivery State Advance', 'Delivery State Undo', 'Delivery Reminder', 'Delivery Reassigned', 'Donation Hub Reminder', 'Donation Pledge Reminder')`);
    await queryRunner.query(`ALTER TABLE "Notification" ALTER COLUMN "notificationType" TYPE "Notification_notificationtype_enum"`);
  }

}
