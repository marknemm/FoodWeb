import { MigrationInterface, QueryRunner } from 'typeorm';

export class fullTextSearchEntity1588193611219 implements MigrationInterface {
  name = 'fullTextSearchEntity1588193611219'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const alreadyCreated: boolean = (await queryRunner.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'FullTextSearch')`
    ))[0].exists;
    if (alreadyCreated) { return; }

    await queryRunner.query(`CREATE TABLE "FullTextSearch" ("id" SERIAL NOT NULL, "entityId" integer NOT NULL, "entityTable" character varying NOT NULL, "fullText" tsvector NOT NULL DEFAULT '', CONSTRAINT "PK_1028e0631223635028864c3420a" PRIMARY KEY ("id"))`, undefined);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a2bf19d1221030d712cab2c521" ON "FullTextSearch" ("entityId", "entityTable") `, undefined);
    await queryRunner.query(`CREATE INDEX "fullTextIdx" ON "FullTextSearch" USING GIN("fullText")`);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION "genAccountFullText"()
      RETURNS TRIGGER AS
      $func$ BEGIN
        INSERT INTO "FullTextSearch" ("entityId", "entityTable", "fullText")
        SELECT  "Account"."id" AS "entityId",
                'Account' AS "entityTable",
                (
                     SETWEIGHT(TO_TSVECTOR("Account"."accountType"::TEXT), 'B')
                  || SETWEIGHT(TO_TSVECTOR('simple', REGEXP_REPLACE("Account"."username", '[^\w]+', '', 'g')), 'B')
                  || SETWEIGHT(TO_TSVECTOR('simple', REGEXP_REPLACE("ContactInfo"."email", '[@\.]', ' ', 'g')), 'B')
                  || SETWEIGHT(TO_TSVECTOR('simple', "ContactInfo"."phoneNumber"), 'D')
                  || SETWEIGHT(TO_TSVECTOR('simple',
                      CASE WHEN ("Account"."accountType" <> 'Volunteer')
                        THEN CONCAT(
                          "ContactInfo"."streetAddress", ' ',
                          "ContactInfo"."city", ' ',
                          "ContactInfo"."stateProvince", ' ',
                          "ContactInfo"."postalCode"
                        )
                        ELSE ''
                      END
                     ), 'B')
                  || SETWEIGHT(TO_TSVECTOR(COALESCE("Organization"."name", '')), 'A')
                  || SETWEIGHT(TO_TSVECTOR(COALESCE("Organization"."description", '')), 'B')
                  || SETWEIGHT(TO_TSVECTOR(COALESCE("Organization"."deliveryInstructions", '')), 'C')
                  || SETWEIGHT(TO_TSVECTOR(COALESCE("Volunteer"."firstName", '')), 'A')
                  || SETWEIGHT(TO_TSVECTOR(COALESCE("Volunteer"."lastName", '')), 'A')
                ) AS "fullText"
        FROM      "Account"
        LEFT JOIN "ContactInfo"   ON "Account"."contactInfoId" = "ContactInfo"."id"
        LEFT JOIN "Organization"  ON "Organization"."accountId" = "Account"."id"
        LEFT JOIN "Volunteer"     ON "Volunteer"."accountId" = "Account"."id"
        WHERE CASE (TG_ARGV[0])
          WHEN 'Account'      THEN "Account"."id" = NEW."id"
          WHEN 'ContactInfo'  THEN "ContactInfo"."id" = NEW."id"
          WHEN 'Organization' THEN "Organization"."id" = NEW."id"
          WHEN 'Volunteer'    THEN "Volunteer"."id" = NEW."id"
        END
        ON CONFLICT ("entityId", "entityTable") DO UPDATE
        SET "entityId"    = excluded."entityId",
            "entityTable" = excluded."entityTable",
            "fullText"    = excluded."fullText";
        RETURN NEW;
      END $func$ LANGUAGE plpgsql
    `);

    await queryRunner.query(`
      CREATE TRIGGER "genAccountFullText_Account"
      AFTER INSERT OR UPDATE ON "Account"
      FOR EACH ROW EXECUTE PROCEDURE "genAccountFullText"('Account')
    `);

    await queryRunner.query(`
      CREATE TRIGGER "genAccountFullText_ContactInfo"
      AFTER INSERT OR UPDATE ON "ContactInfo"
      FOR EACH ROW EXECUTE PROCEDURE "genAccountFullText"('ContactInfo')
    `);

    await queryRunner.query(`
      CREATE TRIGGER "genAccountFullText_Organization"
      AFTER INSERT OR UPDATE ON "Organization"
      FOR EACH ROW EXECUTE PROCEDURE "genAccountFullText"('Organization')
    `);

    await queryRunner.query(`
      CREATE TRIGGER "genAccountFullText_Volunteer"
      AFTER INSERT OR UPDATE ON "Volunteer"
      FOR EACH ROW EXECUTE PROCEDURE "genAccountFullText"('Volunteer')
    `);

    await queryRunner.query(`
      UPDATE  "Account"
      SET     "id" = "Account"."id"
    `);

    await queryRunner.query(`
      UPDATE  "ContactInfo"
      SET     "id" = "ContactInfo"."id"
    `);

    await queryRunner.query(`
      UPDATE  "Organization"
      SET     "id" = "Organization"."id"
    `);

    await queryRunner.query(`
      UPDATE  "Volunteer"
      SET     "id" = "Volunteer"."id"
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION "genDonationFullText"()
      RETURNS TRIGGER AS
      $func$ BEGIN
        INSERT INTO "FullTextSearch" ("entityId", "entityTable", "fullText")
        SELECT  "Donation"."id" AS "entityId",
                'Donation' AS "entityTable",
                (
                     SETWEIGHT(TO_TSVECTOR("Donation"."donorLastName"), 'B')
                  || SETWEIGHT(TO_TSVECTOR("Donation"."donorFirstName"), 'B')
                  || SETWEIGHT(TO_TSVECTOR("Donation"."donationType"), 'A')
                  || SETWEIGHT(TO_TSVECTOR("Donation"."description"), 'A')
                  || SETWEIGHT(TO_TSVECTOR("Donation"."donationStatus"::TEXT), 'A')
                  || SETWEIGHT(TO_TSVECTOR(
                      REGEXP_REPLACE(COALESCE("DonorContactOverride"."email", ''), '[@\.]', ' ', 'g')
                     ), 'B')
                  || SETWEIGHT(TO_TSVECTOR('simple',
                      CASE WHEN ("DonorContactOverride"."id" IS NOT NULL)
                        THEN CONCAT(
                          "DonorContactOverride"."streetAddress", ' ',
                          "DonorContactOverride"."city", ' ',
                          "DonorContactOverride"."stateProvince", ' ',
                          "DonorContactOverride"."postalCode"
                        )
                        ELSE ''
                      END
                     ), 'B')
                ) AS "fullText"
        FROM      "Donation"
        LEFT JOIN "ContactInfo" AS "DonorContactOverride" ON  "Donation"."donorContactOverrideId" = "DonorContactOverride"."id"
        WHERE CASE (TG_ARGV[0])
          WHEN 'Donation'             THEN "Donation"."id" = NEW."id"
          WHEN 'DonorContactOverride' THEN "DonorContactOverride"."id" = NEW."id"
        END
        ON CONFLICT ("entityId", "entityTable") DO UPDATE
        SET "entityId"    = excluded."entityId",
            "entityTable" = excluded."entityTable",
            "fullText"    = excluded."fullText";
        RETURN NEW;
      END $func$ LANGUAGE plpgsql
    `);

    await queryRunner.query(`
      CREATE TRIGGER "genDonationFullText_Donation"
      AFTER INSERT OR UPDATE ON "Donation"
      FOR EACH ROW EXECUTE PROCEDURE "genDonationFullText"('Donation')
    `);

    await queryRunner.query(`
      CREATE TRIGGER "genDonationFullText_DonorContactOverride"
      AFTER INSERT OR UPDATE ON "ContactInfo"
      FOR EACH ROW EXECUTE PROCEDURE "genDonationFullText"('DonorContactOverride')
    `);

    await queryRunner.query(`
      UPDATE  "Donation"
      SET     "id" = "Donation"."id"
    `);

    await queryRunner.query(`
      UPDATE  "ContactInfo"
      SET     "id" = "ContactInfo"."id"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS "genAccountFullText_Volunteer" ON "Volunteer"`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS "genAccountFullText_Organization" ON "Organization"`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS "genAccountFullText_ContactInfo" ON "ContactInfo"`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS "genAccountFullText_Account" ON "Account"`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS "genAccountFullText"()`);

    await queryRunner.query(`DROP TRIGGER IF EXISTS "genDonationFullText_DonorContactOverride" ON "ContactInfo"`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS "genDonationFullText_Donation" ON "Donation"`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS "genDonationFullText"()`);

    await queryRunner.query(`DROP INDEX IF EXISTS "fullTextIdx"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_a2bf19d1221030d712cab2c521"`, undefined);
    await queryRunner.query(`DROP TABLE IF EXISTS "FullTextSearch"`, undefined);
  }

}
