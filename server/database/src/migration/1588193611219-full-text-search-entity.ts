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
                TO_TSVECTOR(
                  CONCAT(
                    "Account"."accountType", ' ',
                    REGEXP_REPLACE("Account"."username", '[^\w]+', '', 'g'), ' ',
                    REGEXP_REPLACE("ContactInfo"."email", '[@\.]', ' ', 'g'), ' ',
                    "ContactInfo"."phoneNumber", ' ',
                    CASE WHEN ("Account"."accountType" <> 'Volunteer')
                      THEN CONCAT(
                        "ContactInfo"."streetAddress", ' ',
                        "ContactInfo"."city", ' ',
                        "ContactInfo"."stateProvince", ' ',
                        "ContactInfo"."postalCode", ' ',
                        "ContactInfo"."timezone", ' '
                      )
                      ELSE ''
                    END,
                    "Organization"."name", ' ',
                    "Organization"."description", ' ',
                    "Organization"."deliveryInstructions", ' ',
                    "Volunteer"."lastName", ' ',
                    "Volunteer"."firstName"
                  )
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
      AFTER INSERT OR UPDATE ON "Account"
      FOR EACH ROW EXECUTE PROCEDURE "genAccountFullText"('ContactInfo')
    `);

    await queryRunner.query(`
      CREATE TRIGGER "genAccountFullText_Organization"
      AFTER INSERT OR UPDATE ON "Account"
      FOR EACH ROW EXECUTE PROCEDURE "genAccountFullText"('Organization')
    `);

    await queryRunner.query(`
      CREATE TRIGGER "genAccountFullText_Volunteer"
      AFTER INSERT OR UPDATE ON "Account"
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
                TO_TSVECTOR(
                  CONCAT(
                    "Donation"."donorLastName", ' ',
                    "Donation"."donorFirstName", ' ',
                    "Donation"."donationType", ' ',
                    "Donation"."description", ' ',
                    "Donation"."donationStatus", ' ',
                    TO_CHAR("Donation"."createTimestamp", 'Month DD YYYY HH12:MI AM'), ' ',
                    TO_CHAR("Donation"."createTimestamp", 'MM/DD/YYYY'), ' ',
                    TO_CHAR("Donation"."pickupWindowStart", 'Month DD YYYY HH12:MI AM'), ' ',
                    TO_CHAR("Donation"."pickupWindowStart", 'MM/DD/YYYY'), ' ',
                    TO_CHAR("Donation"."pickupWindowEnd", 'Month DD YYYY HH12:MI AM'), ' ',
                    TO_CHAR("Donation"."pickupWindowEnd", 'MM/DD/YYYY'), ' ',
                    CASE WHEN ("DonorContactOverride"."email" IS NOT NULL)
                      THEN REGEXP_REPLACE("DonorContactOverride"."email", '[@\.]', ' ', 'g')
                      ELSE ''
                    END, ' ',
                    "DonorContactOverride"."phoneNumber", ' ',
                    "DonorContactOverride"."streetAddress", ' ',
                    "DonorContactOverride"."city", ' ',
                    "DonorContactOverride"."stateProvince", ' ',
                    "DonorContactOverride"."postalCode", ' ',
                    "DonorContactOverride"."timezone", ' ',
                    TO_CHAR("DonationClaim"."createTimestamp", 'Month DD YYYY HH12:MI AM'), ' ',
                    TO_CHAR("DonationClaim"."createTimestamp", 'MM/DD/YYYY'), ' ',
                    TO_CHAR("DonationClaim"."dropOffWindowStart", 'Month DD YYYY HH12:MI AM'), ' ',
                    TO_CHAR("DonationClaim"."dropOffWindowStart", 'MM/DD/YYYY'), ' ',
                    TO_CHAR("DonationClaim"."dropOffWindowEnd", 'Month DD YYYY HH12:MI AM'), ' ',
                    TO_CHAR("DonationClaim"."dropOffWindowEnd", 'MM/DD/YYYY'), ' ',
                    TO_CHAR("Delivery"."createTimestamp", 'Month DD YYYY HH12:MI AM'), ' ',
                    TO_CHAR("Delivery"."createTimestamp", 'MM/DD/YYYY'), ' ',
                    TO_CHAR("Delivery"."pickupWindowStart", 'Month DD YYYY HH12:MI AM'), ' ',
                    TO_CHAR("Delivery"."pickupWindowStart", 'MM/DD/YYYY'), ' ',
                    TO_CHAR("Delivery"."pickupWindowEnd", 'Month DD YYYY HH12:MI AM'), ' ',
                    TO_CHAR("Delivery"."pickupWindowEnd", 'MM/DD/YYYY'), ' ',
                    TO_CHAR("Delivery"."dropOffWindowStart", 'Month DD YYYY HH12:MI AM'), ' ',
                    TO_CHAR("Delivery"."dropOffWindowStart", 'MM/DD/YYYY'), ' ',
                    TO_CHAR("Delivery"."dropOffWindowEnd", 'Month DD YYYY HH12:MI AM'), ' ',
                    TO_CHAR("Delivery"."dropOffWindowEnd", 'MM/DD/YYYY'), ' ',
                    CASE WHEN ("Delivery"."startTime" IS NOT NULL)
                      THEN CONCAT(
                        TO_CHAR("Delivery"."startTime", 'Month DD YYYY HH12:MI AM'), ' ',
                        TO_CHAR("Delivery"."startTime", 'MM/DD/YYYY'), ' '
                      )
                      ELSE ''
                    END,
                    CASE WHEN ("Delivery"."pickupTime" IS NOT NULL)
                      THEN CONCAT(
                        TO_CHAR("Delivery"."pickupTime", 'Month DD YYYY'), ' ',
                        TO_CHAR("Delivery"."pickupTime", 'MM/DD/YYYY'), ' '
                      )
                      ELSE ''
                    END,
                    CASE WHEN ("Delivery"."dropOffTime" IS NOT NULL)
                      THEN CONCAT(
                        TO_CHAR("Delivery"."dropOffTime", 'Month DD YYYY'), ' ',
                        TO_CHAR("Delivery"."dropOffTime", 'MM/DD/YYYY'), ' '
                      )
                      ELSE ''
                    END
                  )
                ) AS "fullText"
        FROM      "Donation"
        LEFT JOIN "ContactInfo" AS "DonorContactOverride" ON  "Donation"."donorContactOverrideId" = "DonorContactOverride"."id"
        LEFT JOIN "DonationClaim"                         ON  "DonationClaim"."donationId" = "Donation"."id"
        LEFT JOIN "Delivery"                              ON  "Delivery"."claimId" = "DonationClaim"."id"
        WHERE CASE (TG_ARGV[0])
          WHEN 'Donation'             THEN "Donation"."id" = NEW."id"
          WHEN 'DonorContactOverride' THEN "DonorContactOverride"."id" = NEW."id"
          WHEN 'DonationClaim'        THEN "DonationClaim"."id" = NEW."id"
          WHEN 'Delivery'             THEN "Delivery"."id" = NEW."id"
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
      CREATE TRIGGER "genDonationFullText_DonationClaim"
      AFTER INSERT OR UPDATE ON "DonationClaim"
      FOR EACH ROW EXECUTE PROCEDURE "genDonationFullText"('DonationClaim')
    `);

    await queryRunner.query(`
      CREATE TRIGGER "genDonationFullText_Delivery"
      AFTER INSERT OR UPDATE ON "Delivery"
      FOR EACH ROW EXECUTE PROCEDURE "genDonationFullText"('Delivery')
    `);

    await queryRunner.query(`
      UPDATE  "Donation"
      SET     "id" = "Donation"."id"
    `);

    await queryRunner.query(`
      UPDATE  "ContactInfo"
      SET     "id" = "ContactInfo"."id"
    `);

    await queryRunner.query(`
      UPDATE  "DonationClaim"
      SET     "id" = "DonationClaim"."id"
    `);

    await queryRunner.query(`
      UPDATE  "Delivery"
      SET     "id" = "Delivery"."id"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER "genAccountFullText_Volunteer"`);
    await queryRunner.query(`DROP TRIGGER "genAccountFullText_Organization"`);
    await queryRunner.query(`DROP TRIGGER "genAccountFullText_ContactInfo"`);
    await queryRunner.query(`DROP TRIGGER "genAccountFullText_Account"`);
    await queryRunner.query(`DROP FUNCTION "genAccountFullText"()`);

    await queryRunner.query(`DROP TRIGGER "genDonationFullText_Delivery`);
    await queryRunner.query(`DROP TRIGGER "genDonationFullText_DonationClaim`);
    await queryRunner.query(`DROP TRIGGER "genDonationFullText_DonorContactOverride`);
    await queryRunner.query(`DROP TRIGGER "genDonationFullText_Donation`);
    await queryRunner.query(`DROP FUNCTION "genDonationFullText"()`);

    await queryRunner.query(`DROP INDEX "fullTextIdx"`);
    await queryRunner.query(`DROP INDEX "IDX_a2bf19d1221030d712cab2c521"`, undefined);
    await queryRunner.query(`DROP TABLE "FullTextSearch"`, undefined);
  }

}
