import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class notificationTypeEnum1564944424746 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const alreadyCreated: boolean = (await queryRunner.query(
      `SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_notificationtype_enum')`
    ))[0].exists;
    if (alreadyCreated) { return; }
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
