import { MigrationInterface, QueryRunner } from 'typeorm';

export class donorContactInfoOverride1568332268268 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const alreadyCreated: boolean = (await queryRunner.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Account' AND column_name = 'contactInfoId')`
    ))[0].exists;
    if (alreadyCreated) { return; }
    await queryRunner.query(`ALTER TABLE "Account" ADD "contactInfoId" integer`);
    await queryRunner.query(`ALTER TABLE "Account" ADD CONSTRAINT "UQ_f3f5c02509d4f9b16cdebfd9bff" UNIQUE ("contactInfoId")`);
    await queryRunner.query(`ALTER TABLE "Account" ADD CONSTRAINT "FK_f3f5c02509d4f9b16cdebfd9bff" FOREIGN KEY ("contactInfoId") REFERENCES "ContactInfo"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "Donation" ADD "donorContactOverrideId" integer`);
    await queryRunner.query(`ALTER TABLE "Donation" ADD CONSTRAINT "UQ_d801d8ac724b6529fe5b438dca2" UNIQUE ("donorContactOverrideId")`);
    await queryRunner.query(`ALTER TABLE "Donation" ADD CONSTRAINT "FK_d801d8ac724b6529fe5b438dca2" FOREIGN KEY ("donorContactOverrideId") REFERENCES "ContactInfo"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`UPDATE "Account" SET "contactInfoId" = (SELECT "id" FROM "ContactInfo" WHERE "ContactInfo"."accountId" = "Account"."id")`);
    await queryRunner.query(`ALTER TABLE "ContactInfo" DROP CONSTRAINT "FK_6908e72e533a706c1d61f85dab7"`);
    await queryRunner.query(`ALTER TABLE "ContactInfo" DROP CONSTRAINT "REL_6908e72e533a706c1d61f85dab"`);
    await queryRunner.query(`ALTER TABLE "ContactInfo" DROP COLUMN "accountId"`);
    const donationContactInfo: any[] = await queryRunner.query(`
      SELECT
        "Donation"."id" AS "donationId",
        "ContactInfo"."email" AS "email",
        "ContactInfo"."phoneNumber" AS "phoneNumber",
        "ContactInfo"."streetAddress" AS "streetAddress",
        "ContactInfo"."city" AS "city",
        "ContactInfo"."stateProvince" AS "stateProvince",
        "ContactInfo"."postalCode" AS "postalCode",
        "ContactInfo"."location" AS "location",
        "ContactInfo"."timezone" AS "timezone"
      FROM "Donation"
      INNER JOIN "Account" ON "Donation"."donorAccountId" = "Account"."id"
      INNER JOIN "ContactInfo" ON "Account"."contactInfoId" = "ContactInfo"."id"
    `);
    donationContactInfo.forEach(async (item: any) => {
      const contactInfoId: number = (await queryRunner.query(
        ` INSERT INTO "ContactInfo" ("email", "phoneNumber", "streetAddress", "city", "stateProvince", "postalCode", "location", "timezone")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING "id"`,
        [item.email, item.phoneNumber, item.streetAddress, item.city, item.stateProvince, item.postalCode, item.location, item.timezone]
      ))[0].id;
      await queryRunner.query(
        ` UPDATE "Donation"
          SET "donorContactOverrideId" = $1
          WHERE "id" = $2`,
        [contactInfoId, item.donationId]
      );
    });
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "ContactInfo" ADD "accountId" integer');
    await queryRunner.query(`ALTER TABLE "ContactInfo" ADD CONSTRAINT "REL_6908e72e533a706c1d61f85dab" UNIQUE ("accountId")`);
    await queryRunner.query(`ALTER TABLE "ContactInfo" ADD CONSTRAINT "FK_6908e72e533a706c1d61f85dab7" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`UPDATE "ContactInfo" SET "accountId" = (SELECT "id" FROM "Account" WHERE "Account"."contactInfoId" = "ContactInfo"."id")`)
    await queryRunner.query(`ALTER TABLE "Donation" DROP CONSTRAINT "FK_d801d8ac724b6529fe5b438dca2"`);
    await queryRunner.query(`ALTER TABLE "Donation" DROP CONSTRAINT "UQ_d801d8ac724b6529fe5b438dca2"`);
    await queryRunner.query(`ALTER TABLE "Donation" DROP COLUMN "donorContactOverrideId"`);
    await queryRunner.query(`ALTER TABLE "Account" DROP CONSTRAINT "FK_f3f5c02509d4f9b16cdebfd9bff"`);
    await queryRunner.query(`ALTER TABLE "Account" DROP CONSTRAINT "UQ_f3f5c02509d4f9b16cdebfd9bff"`);
    await queryRunner.query(`ALTER TABLE "Account" DROP COLUMN "contactInfoId"`);
  }

}
