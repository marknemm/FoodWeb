import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class addNotificationTypes1566160381277 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const alreadyCreated: boolean = (await queryRunner.query(
      `SELECT 'Cancel Delivery' = ANY(SELECT unnest(enum_range(NULL::"notification_notificationtype_enum"))::text AS notificationTypes);`
    ))[0].exists;
    if (alreadyCreated) { return; }
    await queryRunner.query(`ALTER TABLE "Notification" ALTER COLUMN "notificationType" TYPE VARCHAR(255)`);
    await queryRunner.query(`DROP TYPE IF EXISTS "notification_notificationtype_enum"`);
    await queryRunner.query(`CREATE TYPE "notification_notificationtype_enum" AS ENUM('Signup', 'Donate', 'Update Donation', 'Remove Donation', 'Claim Donation', 'Unclaim Donation', 'Schedule Delivery', 'Cancel Delivery', 'Delivery State Advance', 'Delivery State Undo')`);
    await queryRunner.query(`ALTER TABLE "Notification" ALTER COLUMN "notificationType" TYPE "notification_notificationtype_enum" USING "notificationType"::"notification_notificationtype_enum"`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Notification" ALTER COLUMN "notificationType" TYPE VARCHAR(255)`);
    await queryRunner.query(`DROP TYPE IF EXISTS "notification_notificationtype_enum"`);
    await queryRunner.query(`CREATE TYPE "notification_notificationtype_enum" AS ENUM('Donate', 'Update Donation', 'Remove Donation', 'Claim Donation', 'Unclaim Donation', 'Schedule Delivery', 'Delivery State Advance', 'Delivery State Undo')`);
    await queryRunner.query(`ALTER TABLE "Notification" ALTER COLUMN "notificationType" TYPE "notification_notificationtype_enum" USING "notificationType"::"notification_notificationtype_enum"`);
  }

}
