import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class mapRoute1577582732218 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const alreadyCreated: boolean = (await queryRunner.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'MapRoute')`
    ))[0].exists;
    if (alreadyCreated) { return; }

    // Create new MapRoute table where we shall store all map route/direction data for each donation's delivery waypoint segments (e.g. 'volunteer to donor' & 'donor to receiver').
    await queryRunner.query(`CREATE TABLE "MapRoute" ("id" SERIAL NOT NULL, "distanceMi" real NOT NULL, "durationMin" integer NOT NULL, "directions" json NOT NULL, "endLocation" geography NOT NULL, "startLocation" geography NOT NULL, CONSTRAINT "PK_4fc2a0cc574443434c185f01016" PRIMARY KEY ("id"))`);

    // Add columns to Delivery & DonationClaim tables which will contain MapRoute entry IDs for association.
    await queryRunner.query(`ALTER TABLE "Delivery" ADD "routeToDonorId" integer`);
    await queryRunner.query(`ALTER TABLE "DonationClaim" ADD "routeToReceiverId" integer`);

    // Copy over route/direction data from Delivery table to the new MapRoute table.
    await queryRunner.query(`
      WITH "mapRoute" AS (
        INSERT INTO "MapRoute" ("distanceMi", "durationMin", "directions", "endLocation", "startLocation")
        SELECT DISTINCT ON (
          "Delivery"."distanceMiToDonor",
          "Delivery"."durationMinToDonor",
          "Delivery"."directionsToDonor"->>'encodedPolyline'
        )
          "Delivery"."distanceMiToDonor",
          "Delivery"."durationMinToDonor",
          "Delivery"."directionsToDonor",
          "donorContactInfo"."location",
          "volunteerContactInfo"."location"
        FROM "Delivery"
        INNER JOIN "Account" AS "volunteerAccount" ON "Delivery"."volunteerAccountId" = "volunteerAccount"."id"
        INNER JOIN "ContactInfo" AS "volunteerContactInfo" ON "volunteerAccount"."contactInfoId" = "volunteerContactInfo"."id"
        INNER JOIN "Donation" ON "Delivery"."donationId" = "Donation"."id"
        INNER JOIN "ContactInfo" AS "donorContactInfo" ON "Donation"."donorContactOverrideId" = "donorContactInfo"."id"
        RETURNING *
      )
      UPDATE "Delivery"
      SET "routeToDonorId" = "mapRoute"."id"
      FROM "mapRoute"
      WHERE "Delivery"."distanceMiToDonor" = "mapRoute"."distanceMi"
        AND "Delivery"."durationMinToDonor" = "mapRoute"."durationMin"
        AND "Delivery"."directionsToDonor"->>'encodedPolyline' = "mapRoute"."directions"->>'encodedPolyline'
    `);

    // Copy over route/direction data from DonationClaim table to the new MapRoute table.
    await queryRunner.query(`
      WITH "mapRoute" AS (
        INSERT INTO "MapRoute" ("distanceMi", "durationMin", "directions", "endLocation", "startLocation")
        SELECT DISTINCT ON (
          "DonationClaim"."distanceMiToReceiver",
          "DonationClaim"."durationMinToReceiver",
          "DonationClaim"."directionsToReceiver"->>'encodedPolyline'
        )
          "DonationClaim"."distanceMiToReceiver",
          "DonationClaim"."durationMinToReceiver",
          "DonationClaim"."directionsToReceiver",
          "receiverContactInfo"."location",
          "donorContactInfo"."location"
        FROM "DonationClaim"
        INNER JOIN "Account" AS "receiverAccount" ON "DonationClaim"."receiverAccountId" = "receiverAccount"."id"
        INNER JOIN "ContactInfo" AS "receiverContactInfo" ON "receiverAccount"."contactInfoId" = "receiverContactInfo"."id"
        INNER JOIN "Donation" ON "DonationClaim"."donationId" = "Donation"."id"
        INNER JOIN "ContactInfo" AS "donorContactInfo" ON "Donation"."donorContactOverrideId" = "donorContactInfo"."id"
        RETURNING *
      )
      UPDATE "DonationClaim"
      SET "routeToReceiverId" = "mapRoute"."id"
      FROM "mapRoute"
      WHERE "DonationClaim"."distanceMiToReceiver" = "mapRoute"."distanceMi"
        AND "DonationClaim"."durationMinToReceiver" = "mapRoute"."durationMin"
        AND "DonationClaim"."directionsToReceiver"->>'encodedPolyline' = "mapRoute"."directions"->>'encodedPolyline'
    `);

    // Add foreign key constraints that link the DonationClaim & Delivery tables to their respective entries in the MapRoute table.
    await queryRunner.query(`ALTER TABLE "Delivery" ADD CONSTRAINT "FK_f051bc007fa27012d377bdef6b7" FOREIGN KEY ("routeToDonorId") REFERENCES "MapRoute"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "DonationClaim" ADD CONSTRAINT "FK_4df1f6cac9d40458b5f5a2d505a" FOREIGN KEY ("routeToReceiverId") REFERENCES "MapRoute"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

    // Cleanup old location of values that have been consolidated into MapRoute table.
    await queryRunner.query(`ALTER TABLE "Delivery" DROP COLUMN "distanceMiToDonor"`);
    await queryRunner.query(`ALTER TABLE "Delivery" DROP COLUMN "durationMinToDonor"`);
    await queryRunner.query(`ALTER TABLE "Delivery" DROP COLUMN "directionsToDonor"`);
    await queryRunner.query(`ALTER TABLE "DonationClaim" DROP COLUMN "distanceMiToReceiver"`);
    await queryRunner.query(`ALTER TABLE "DonationClaim" DROP COLUMN "durationMinToReceiver"`);
    await queryRunner.query(`ALTER TABLE "DonationClaim" DROP COLUMN "directionsToReceiver"`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "DonationClaim" DROP CONSTRAINT "FK_4df1f6cac9d40458b5f5a2d505a"`);
    await queryRunner.query(`ALTER TABLE "Delivery" DROP CONSTRAINT "FK_f051bc007fa27012d377bdef6b7"`);
    await queryRunner.query(`ALTER TABLE "DonationClaim" DROP COLUMN "routeToReceiverId"`);
    await queryRunner.query(`ALTER TABLE "Delivery" DROP COLUMN "routeToDonorId"`);
    await queryRunner.query(`ALTER TABLE "DonationClaim" ADD "directionsToReceiver" json NOT NULL`);
    await queryRunner.query(`ALTER TABLE "DonationClaim" ADD "durationMinToReceiver" integer NOT NULL`);
    await queryRunner.query(`ALTER TABLE "DonationClaim" ADD "distanceMiToReceiver" real NOT NULL`);
    await queryRunner.query(`ALTER TABLE "Delivery" ADD "directionsToDonor" json NOT NULL`);
    await queryRunner.query(`ALTER TABLE "Delivery" ADD "durationMinToDonor" integer NOT NULL`);
    await queryRunner.query(`ALTER TABLE "Delivery" ADD "distanceMiToDonor" real NOT NULL`);
    await queryRunner.query(`DROP TABLE "MapRoute"`);
  }

}
