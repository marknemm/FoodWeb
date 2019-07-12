import { MigrationInterface, QueryRunner } from 'typeorm';

export class auditNotification1560210683131 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const alreadyCreated: boolean = (await queryRunner.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Notification')`
    ))[0].exists;
    if (alreadyCreated) { return; }
    await queryRunner.query(`CREATE TYPE "audit_eventtype_enum" AS ENUM('Signup', 'Verify Account', 'Remove Unverified Account', 'Update Account', 'Reset Password', 'Donate', 'Update Donation', 'Remove Donation', 'Claim Donation', 'Unclaim Donation', 'Schedule Delivery', 'Delivery State Advance', 'Delivery State Undo')`);
    await queryRunner.query(`CREATE TABLE "Audit" ("id" SERIAL NOT NULL, "eventType" "audit_eventtype_enum" NOT NULL, "data" json NOT NULL, "recaptchaScore" float, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_fc6e886590a36b630dd98096fc3" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "Notification" ("id" SERIAL NOT NULL, "notificationType" character varying NOT NULL, "notificationDetailId" integer NOT NULL, "notificationIconUrl" character varying NOT NULL, "notificationTitle" character varying NOT NULL, "notificationSubtitle" character varying NOT NULL, "notificationBody" character varying NOT NULL, "read" boolean NOT NULL DEFAULT false, "flagged" boolean NOT NULL DEFAULT false, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "accountId" integer, "auditId" integer, CONSTRAINT "PK_da18f6446b6fea585f01d03f56c" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "AuditAccountMap" ("auditId" integer NOT NULL, "accountId" integer NOT NULL, CONSTRAINT "PK_eb739c0ce736fae4908e48cdab1" PRIMARY KEY ("auditId", "accountId"))`);
    await queryRunner.query(`CREATE INDEX "IDX_ccf38c9ed2d680dd7886ab84f9" ON "AuditAccountMap" ("auditId") `);
    await queryRunner.query(`CREATE INDEX "IDX_1aa6210f1bca9d9e4305f24806" ON "AuditAccountMap" ("accountId") `);
    await queryRunner.query(`ALTER TABLE "Notification" ADD CONSTRAINT "FK_65ba2a3f0c8e78599857d10758d" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "Notification" ADD CONSTRAINT "FK_50d77c6e8a08d79b09300b129d2" FOREIGN KEY ("auditId") REFERENCES "Audit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "AuditAccountMap" ADD CONSTRAINT "FK_ccf38c9ed2d680dd7886ab84f9a" FOREIGN KEY ("auditId") REFERENCES "Audit"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "AuditAccountMap" ADD CONSTRAINT "FK_1aa6210f1bca9d9e4305f248064" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "AuditAccountMap" DROP CONSTRAINT "FK_1aa6210f1bca9d9e4305f248064"`);
    await queryRunner.query(`ALTER TABLE "AuditAccountMap" DROP CONSTRAINT "FK_ccf38c9ed2d680dd7886ab84f9a"`);
    await queryRunner.query(`ALTER TABLE "Notification" DROP CONSTRAINT "FK_50d77c6e8a08d79b09300b129d2"`);
    await queryRunner.query(`ALTER TABLE "Notification" DROP CONSTRAINT "FK_65ba2a3f0c8e78599857d10758d"`);
    await queryRunner.query(`DROP INDEX "IDX_1aa6210f1bca9d9e4305f24806"`);
    await queryRunner.query(`DROP INDEX "IDX_ccf38c9ed2d680dd7886ab84f9"`);
    await queryRunner.query(`DROP TABLE "AuditAccountMap"`);
    await queryRunner.query(`DROP TABLE "Notification"`);
    await queryRunner.query(`DROP TABLE "Audit"`);
    await queryRunner.query(`DROP TYPE "audit_eventtype_enum"`);
  }

}
