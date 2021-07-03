import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class deliveryReminderNotificationType1569543950322 implements MigrationInterface {
  name = 'deliveryReminderNotificationType1569543950322';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TYPE "notification_notificationtype_enum" RENAME TO "notification_notificationtype_enum_old"`);
    await queryRunner.query(`CREATE TYPE "notification_notificationtype_enum" AS ENUM('Signup', 'Donate', 'Update Donation', 'Remove Donation', 'Claim Donation', 'Unclaim Donation', 'Schedule Delivery', 'Cancel Delivery', 'Delivery State Advance', 'Delivery State Undo', 'Delivery Reminder')`);
    await queryRunner.query(`ALTER TABLE "Notification" ALTER COLUMN "notificationType" TYPE "notification_notificationtype_enum" USING "notificationType"::"text"::"notification_notificationtype_enum"`);
    await queryRunner.query(`DROP TYPE "notification_notificationtype_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TYPE "notification_notificationtype_enum_old" AS ENUM('Signup', 'Donate', 'Update Donation', 'Remove Donation', 'Claim Donation', 'Unclaim Donation', 'Schedule Delivery', 'Cancel Delivery', 'Delivery State Advance', 'Delivery State Undo')`);
    await queryRunner.query(`ALTER TABLE "Notification" ALTER COLUMN "notificationType" TYPE "notification_notificationtype_enum_old" USING "notificationType"::"text"::"notification_notificationtype_enum_old"`);
    await queryRunner.query(`DROP TYPE "notification_notificationtype_enum"`);
    await queryRunner.query(`ALTER TYPE "notification_notificationtype_enum_old" RENAME TO "notification_notificationtype_enum"`);
  }
}
