import { MigrationInterface, QueryRunner } from 'typeorm';
import { genDirections } from '../helpers/directions';
import { Directions, LatLngLiteral } from '../shared';

export class directions1576463243837 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Delivery" ADD "distanceMiToDonor" real`);
    await queryRunner.query(`ALTER TABLE "Delivery" ADD "durationMinToDonor" integer`);
    await queryRunner.query(`ALTER TABLE "Delivery" ADD "directionsToDonor" json`);
    await queryRunner.query(`ALTER TABLE "Delivery" ADD "createTimestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "DonationClaim" ADD "directionsToReceiver" json`);
    // Remove orphaned Deliveries.
    await queryRunner.query(`
      DELETE FROM "Delivery"
      WHERE       "Delivery"."donationId" IS NULL
    `);

    // Update Delivery directions.
    let results: any[] = await queryRunner.query(`
      SELECT      "delivery"."id"                                   AS "deliveryId",
                  ST_Y("donorContactInfo"."location"::geometry)     AS "donorLat",
                  ST_X("donorContactInfo"."location"::geometry)     AS "donorLng",
                  ST_Y("volunteerContactInfo"."location"::geometry) AS "volunteerLat",
                  ST_X("volunteerContactInfo"."location"::geometry) AS "volunteerLng"
      FROM        "Donation"    AS "donation"
      INNER JOIN  "Delivery"    AS "delivery"             ON "delivery"."donationId" = "donation"."id"
      INNER JOIN  "ContactInfo" AS "donorContactInfo"     ON "donorContactInfo"."id" = "donation"."donorContactOverrideId"
      INNER JOIN  "Account"     AS "volunteerAccount"     ON "volunteerAccount"."id" = "delivery"."volunteerAccountId"
      INNER JOIN  "ContactInfo" AS "volunteerContactInfo" ON "volunteerContactInfo"."id" = "volunteerAccount"."contactInfoId"
    `);
    for (const result of results) {
      const origin: LatLngLiteral = { lat: result.donorLat, lng: result.donorLng};
      const destination: LatLngLiteral = { lat: result.volunteerLat, lng: result.volunteerLng };
      const directions: Directions = await genDirections([origin, destination]);
      await queryRunner.query(`
        UPDATE  "Delivery"
        SET     "distanceMiToDonor" = $1,
                "durationMinToDonor" = $2,
                "directionsToDonor" = $3
        WHERE   "id" = $4
      `, [directions.distanceMi, directions.durationMin, directions, result.deliveryId]);
    }

    // Update DonationClaim direcitons.
    results = await queryRunner.query(`
      SELECT      "donationClaim"."id"                              AS "donationClaimId",
                  ST_Y("donorContactInfo"."location"::geometry)     AS "donorLat",
                  ST_X("donorContactInfo"."location"::geometry)     AS "donorLng",
                  ST_Y("receiverContactInfo"."location"::geometry)  AS "receiverLat",
                  ST_X("receiverContactInfo"."location"::geometry)  AS "receiverLng"
      FROM        "Donation"      AS "donation"
      INNER JOIN  "DonationClaim" AS "donationClaim"        ON "donationClaim"."donationId" = "donation"."id"
      INNER JOIN  "ContactInfo"   AS "donorContactInfo"     ON "donorContactInfo"."id" = "donation"."donorContactOverrideId"
      INNER JOIN  "Account"       AS "receiverAccount"      ON "receiverAccount"."id" = "donationClaim"."receiverAccountId"
      INNER JOIN  "ContactInfo"   AS "receiverContactInfo"  ON "receiverContactInfo"."id" = "receiverAccount"."contactInfoId"
    `);
    for (const result of results) {
      const origin: LatLngLiteral = { lat: result.donorLat, lng: result.donorLng };
      const destination: LatLngLiteral = { lat: result.receiverLat, lng: result.receiverLng };
      const directions: Directions = await genDirections([origin, destination]);
      await queryRunner.query(`
        UPDATE  "DonationClaim"
        SET     "distanceMiToReceiver" = $1,
                "durationMinToReceiver" = $2,
                "directionsToReceiver" = $3
        WHERE   "id" = $4
      `, [directions.distanceMi, directions.durationMin, directions, result.donationClaimId]);
    }

    await queryRunner.query(`ALTER TABLE "Delivery" ALTER COLUMN "distanceMiToDonor" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "Delivery" ALTER COLUMN "durationMinToDonor" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "Delivery" ALTER COLUMN "directionsToDonor" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "DonationClaim" ALTER COLUMN "directionsToReceiver" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "DonationClaim" DROP COLUMN "directionsToReceiver"`);
    await queryRunner.query(`ALTER TABLE "Delivery" DROP COLUMN "directionsToDonor"`);
    await queryRunner.query(`ALTER TABLE "Delivery" DROP COLUMN "directionsToDonor"`);
    await queryRunner.query(`ALTER TABLE "Delivery" DROP COLUMN "createTimestamp"`);
    await queryRunner.query(`ALTER TABLE "DonationClaim" DROP COLUMN "directionsToReceiver"`);
  }

}
