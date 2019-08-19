import { MigrationInterface, QueryRunner } from 'typeorm';

export class notificationLink1566150698428 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Notification" ADD COLUMN IF NOT EXISTS "notificationLink" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Notification" DROP COLUMN "notificationLink"`);
  }

}
