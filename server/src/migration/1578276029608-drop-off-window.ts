import { MigrationInterface, QueryRunner } from 'typeorm';

export class dropOffWindow1578276029608 implements MigrationInterface {
  name = 'dropOffWindow1578276029608'

  public async up(queryRunner: QueryRunner): Promise<any> {
    const alreadyCreated: boolean = (await queryRunner.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'DonationClaim' AND column_name = 'dropOffWindowStart')`
    ))[0].exists;
    if (alreadyCreated) { return; }

    await queryRunner.query(`DELETE FROM "Delivery" WHERE "donationId" IS NULL`);
    await queryRunner.query(`DELETE FROM "DonationClaim" WHERE "donationId" IS NULL`);

    await queryRunner.query(`ALTER TABLE "Delivery" ADD "dropOffWindowStart" TIMESTAMP WITH TIME ZONE`, undefined);
    await queryRunner.query(`ALTER TABLE "Delivery" ADD "dropOffWindowEnd" TIMESTAMP WITH TIME ZONE`, undefined);
    await queryRunner.query(`ALTER TABLE "DonationClaim" ADD "dropOffWindowStart" TIMESTAMP`, undefined);
    await queryRunner.query(`ALTER TABLE "DonationClaim" ADD "dropOffWindowEnd" TIMESTAMP`, undefined);

    await queryRunner.query(`
      UPDATE  "Delivery"
      SET     "dropOffWindowStart"  = "pickupWindowStart" + ("routeData"."durationMinToReceiver" || ' minutes')::interval,
              "dropOffWindowEnd"    = "pickupWindowEnd" + ("routeData"."durationMinToReceiver" || ' minutes')::interval
      FROM (
        SELECT      "Delivery"."id"           AS "deliveryId",
                    "MapRoute"."durationMin"  AS "durationMinToReceiver"
        FROM        "Donation"
        INNER JOIN  "DonationClaim"  ON "DonationClaim"."donationId" = "Donation"."id"
        INNER JOIN  "MapRoute"       ON "DonationClaim"."routeToReceiverId" = "MapRoute"."id"
        INNER JOIN  "Delivery"       ON "Delivery"."donationId" = "Donation"."id"
      ) AS "routeData"
      WHERE "id" = "routeData"."deliveryId"
    `);

    await queryRunner.query(`
      UPDATE  "DonationClaim"
      SET     "dropOffWindowStart"  = "routeData"."pickupWindowStart" + ("routeData"."durationMinToReceiver" || ' minutes')::interval,
              "dropOffWindowEnd"    = "routeData"."pickupWindowEnd" + ("routeData"."durationMinToReceiver" || ' minutes')::interval
      FROM (
        SELECT      "DonationClaim"."id"            AS "claimId",
                    "MapRoute"."durationMin"        AS "durationMinToReceiver",
                    "Donation"."pickupWindowStart"  AS "pickupWindowStart",
                    "Donation"."pickupWindowEnd"    AS "pickupWindowEnd"
        FROM        "Donation"
        INNER JOIN  "DonationClaim"  ON "DonationClaim"."donationId" = "Donation"."id"
        INNER JOIN  "MapRoute"       ON "DonationClaim"."routeToReceiverId" = "MapRoute"."id"
      ) AS "routeData"
      WHERE "id" = "routeData"."claimId"
    `);

    await queryRunner.query(`ALTER TABLE "Delivery" ALTER COLUMN "dropOffWindowStart" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "Delivery" ALTER COLUMN "dropOffWindowEnd" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "DonationClaim" ALTER COLUMN "dropOffWindowStart" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "DonationClaim" ALTER COLUMN "dropOffWindowEnd" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "DonationClaim" DROP COLUMN "dropOffWindowEnd"`, undefined);
    await queryRunner.query(`ALTER TABLE "DonationClaim" DROP COLUMN "dropOffWindowStart"`, undefined);
    await queryRunner.query(`ALTER TABLE "Delivery" DROP COLUMN "dropOffWindowEnd"`, undefined);
    await queryRunner.query(`ALTER TABLE "Delivery" DROP COLUMN "dropOffWindowStart"`, undefined);
  }

}
