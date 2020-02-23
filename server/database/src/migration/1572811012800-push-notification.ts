import { MigrationInterface, QueryRunner } from 'typeorm';

export class pushNotification1572811012800 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Notification" ADD "title" character varying`);
    await queryRunner.query(`ALTER TABLE "Notification" ADD "subtitle" character varying`);
    await queryRunner.query(`ALTER TABLE "Notification" ADD "body" character varying`);
    await queryRunner.query(`ALTER TABLE "Notification" ADD "icon" character varying`);
    await queryRunner.query(`ALTER TABLE "Notification" ADD "image" character varying`);
    await queryRunner.query(`ALTER TABLE "Notification" ADD "priority" character varying`);
    await queryRunner.query(`ALTER TABLE "Notification" ADD "action" character varying`);
    await queryRunner.query(`ALTER TABLE "Notification" ADD "tag" character varying`);
    await queryRunner.query(`ALTER TABLE "Notification" ADD "custom" json`);
    await queryRunner.query(`
      UPDATE "Notification"
      SET "title"="notificationTitle",
          "subtitle"="notificationSubtitle",
          "body"="notificationBody",
          "icon"="notificationIconUrl"
    `);
    await queryRunner.query(`ALTER TABLE "Notification" ALTER COLUMN "title" SET NOT NULL;`)
    await queryRunner.query(`ALTER TABLE "Notification" DROP CONSTRAINT "FK_50d77c6e8a08d79b09300b129d2"`);
    await queryRunner.query(`ALTER TABLE "Notification" DROP COLUMN "notificationDetailId"`);
    await queryRunner.query(`ALTER TABLE "Notification" DROP COLUMN "notificationIconUrl"`);
    await queryRunner.query(`ALTER TABLE "Notification" DROP COLUMN "notificationTitle"`);
    await queryRunner.query(`ALTER TABLE "Notification" DROP COLUMN "notificationSubtitle"`);
    await queryRunner.query(`ALTER TABLE "Notification" DROP COLUMN "notificationBody"`);
    await queryRunner.query(`ALTER TABLE "Notification" DROP COLUMN "auditId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Notification" ADD "notificationBody" character varying`);
    await queryRunner.query(`ALTER TABLE "Notification" ADD "notificationSubtitle" character varying`);
    await queryRunner.query(`ALTER TABLE "Notification" ADD "notificationTitle" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "Notification" ADD "notificationIconUrl" character varying`);
    await queryRunner.query(`ALTER TABLE "Notification" ADD "notificationDetailId" integer`);
    await queryRunner.query(`
      UPDATE "Notification"
      SET "notificationTitle"="title",
          "notificationSubtitle"="subtitle",
          "notificationBody"="body",
          "notificationIconUrl"="icon"
    `)
    await queryRunner.query(`ALTER TABLE "Notification" DROP COLUMN "custom"`);
    await queryRunner.query(`ALTER TABLE "Notification" DROP COLUMN "tag"`);
    await queryRunner.query(`ALTER TABLE "Notification" DROP COLUMN "action"`);
    await queryRunner.query(`ALTER TABLE "Notification" DROP COLUMN "priority"`);
    await queryRunner.query(`ALTER TABLE "Notification" DROP COLUMN "image"`);
    await queryRunner.query(`ALTER TABLE "Notification" DROP COLUMN "icon"`);
    await queryRunner.query(`ALTER TABLE "Notification" DROP COLUMN "body"`);
    await queryRunner.query(`ALTER TABLE "Notification" DROP COLUMN "subtitle"`);
    await queryRunner.query(`ALTER TABLE "Notification" DROP COLUMN "title"`);
  }
}
