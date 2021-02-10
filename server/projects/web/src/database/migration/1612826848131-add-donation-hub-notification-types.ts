import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class addDonationHubNotificationTypes1612826848131 implements MigrationInterface {
  name = 'addDonationHubNotificationTypes1612826848132'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE "public"."Notification_notificationtype_enum" RENAME TO "Notification_notificationtype_enum_old"`);
    await queryRunner.query(`CREATE TYPE "Notification_notificationtype_enum" AS ENUM('Signup', 'Donate', 'Update Donation', 'Remove Donation', 'Claim Donation', 'Claim Reassigned', 'Unclaim Donation', 'Schedule Delivery', 'Cancel Delivery', 'Delivery State Advance', 'Delivery State Undo', 'Delivery Reminder', 'Delivery Reassigned', 'Donation Hub Reminder', 'Donation Pledge Reminder')`);
    await queryRunner.query(`ALTER TABLE "Notification" ALTER COLUMN "notificationType" TYPE "Notification_notificationtype_enum" USING "notificationType"::"text"::"Notification_notificationtype_enum"`);
    await queryRunner.query(`DROP TYPE "Notification_notificationtype_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE "public"."Notification_notificationtype_enum" RENAME TO "Notification_notificationtype_enum_old"`);
    await queryRunner.query(`CREATE TYPE "Notification_notificationtype_enum" AS ENUM('Signup', 'Donate', 'Update Donation', 'Remove Donation', 'Claim Donation', 'Claim Reassigned', 'Unclaim Donation', 'Schedule Delivery', 'Cancel Delivery', 'Delivery State Advance', 'Delivery State Undo', 'Delivery Reminder', 'Delivery Reassigned')`);
    await queryRunner.query(`ALTER TABLE "Notification" ALTER COLUMN "notificationType" TYPE "Notification_notificationtype_enum" USING "notificationType"::"text"::"Notification_notificationtype_enum"`);
    await queryRunner.query(`DROP TYPE "Notification_notificationtype_enum_old"`);
  }

}
