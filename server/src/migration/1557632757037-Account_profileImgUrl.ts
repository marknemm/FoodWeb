import { MigrationInterface, QueryRunner } from 'typeorm';

export class AccountProfileImgUrl1557632757037 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const alreadyCreated: boolean = (await queryRunner.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Account' AND column_name = 'profileImgUrl')`
    ))[0].exists;
    if (alreadyCreated) { return; }
    await queryRunner.query(`ALTER TABLE "Account" ADD "profileImgUrl" character varying`);
    await queryRunner.query(`
      WITH "organizationNameChar" AS (
        SELECT UPPER(LEFT("Organization"."organizationName", 1)) AS "organizationNameChar"
        FROM "Account"
        INNER JOIN "Organization" ON "Account"."id" = "Organization"."accountId"
      )
      UPDATE "Account"
      SET "profileImgUrl" = '/assets/' || "organizationNameChar"."organizationNameChar" || '.svg'
      FROM "organizationNameChar"
      WHERE "Account"."profileImgUrl" IS NULL
    `);
    await queryRunner.query(`ALTER TABLE "Account" ALTER COLUMN "profileImgUrl" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Account" DROP COLUMN "profileImgUrl"`);
  }

}
