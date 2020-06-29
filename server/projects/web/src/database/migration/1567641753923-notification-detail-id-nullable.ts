import { MigrationInterface, QueryRunner } from 'typeorm';

export class notificationDetailIdNullable1567641753923 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Notification" ALTER COLUMN "notificationDetailId" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Notification" ALTER COLUMN "notificationDetailId" SET NOT NULL`);
  }
}
