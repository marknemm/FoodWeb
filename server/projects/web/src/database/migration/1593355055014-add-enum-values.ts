import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class addEnumValues1593355055014 implements MigrationInterface {
  name = 'test1593355055014';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE "public"."account_accounttype_enum" RENAME TO "Account_accounttype_enum_old"`);
    await queryRunner.query(`CREATE TYPE "Account_accounttype_enum" AS ENUM('Donor', 'Receiver', 'Volunteer')`);
    await queryRunner.query(`ALTER TABLE "Account" ALTER COLUMN "accountType" TYPE "Account_accounttype_enum" USING "accountType"::"text"::"Account_accounttype_enum"`);
    await queryRunner.query(`DROP TYPE "Account_accounttype_enum_old"`);
    await queryRunner.query(`ALTER TYPE "public"."notification_notificationtype_enum" RENAME TO "Notification_notificationtype_enum_old"`);
    await queryRunner.query(`CREATE TYPE "Notification_notificationtype_enum" AS ENUM('Signup', 'Donate', 'Update Donation', 'Remove Donation', 'Claim Donation', 'Claim Reassigned', 'Unclaim Donation', 'Schedule Delivery', 'Cancel Delivery', 'Delivery State Advance', 'Delivery State Undo', 'Delivery Reminder', 'Delivery Reassigned')`);
    await queryRunner.query(`ALTER TABLE "Notification" ALTER COLUMN "notificationType" TYPE "Notification_notificationtype_enum" USING "notificationType"::"text"::"Notification_notificationtype_enum"`);
    await queryRunner.query(`DROP TYPE "Notification_notificationtype_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "Notification_notificationtype_enum_old" AS ENUM()`);
    await queryRunner.query(`ALTER TABLE "Notification" ALTER COLUMN "notificationType" TYPE "Notification_notificationtype_enum_old" USING "notificationType"::"text"::"Notification_notificationtype_enum_old"`);
    await queryRunner.query(`DROP TYPE "Notification_notificationtype_enum"`);
    await queryRunner.query(`ALTER TYPE "Notification_notificationtype_enum_old" RENAME TO  "notification_notificationtype_enum"`);
    await queryRunner.query(`CREATE TYPE "Account_accounttype_enum_old" AS ENUM()`);
    await queryRunner.query(`ALTER TABLE "Account" ALTER COLUMN "accountType" TYPE "Account_accounttype_enum_old" USING "accountType"::"text"::"Account_accounttype_enum_old"`);
    await queryRunner.query(`DROP TYPE "Account_accounttype_enum"`);
    await queryRunner.query(`ALTER TYPE "Account_accounttype_enum_old" RENAME TO  "account_accounttype_enum"`);
  }

}
