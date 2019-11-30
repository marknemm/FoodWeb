import { MigrationInterface, QueryRunner } from 'typeorm';

export class preferredContact1574615908483 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "ContactInfo" ADD "enableEmail" boolean NOT NULL DEFAULT true`);
    await queryRunner.query(`ALTER TABLE "ContactInfo" ADD "enablePushNotification" boolean NOT NULL DEFAULT true`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "ContactInfo" DROP COLUMN "enablePushNotification"`);
    await queryRunner.query(`ALTER TABLE "ContactInfo" DROP COLUMN "enableEmail"`);
  }

}
